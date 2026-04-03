"""
AISMS Flask API Server
======================
Receives webcam frames from the browser, runs AI models (eye/face/voice),
and returns real-time analysis results.

Architecture:
  - Browser captures webcam via getUserMedia
  - Browser sends frames as base64 JPEG to POST /api/process-frame
  - Backend runs eye tracking + face detection on the frame
  - Backend runs voice detection in a background thread (sounddevice)
  - Backend returns results; frontend updates UI

Endpoints:
  POST /api/session/start     — Initialize a new session (calibrates mic, starts voice thread)
  POST /api/session/stop      — Stop session, save data, return summary
  POST /api/process-frame     — Process a single webcam frame (base64 JPEG)
  GET  /api/live-data         — Current snapshot of all detections
  GET  /api/session-summary   — Session summary (after stop)
  GET  /api/feedback          — AI-generated feedback from session data
  GET  /api/health            — Health check
"""

import os
import sys
import time
import json
import base64
import threading
import traceback
from datetime import datetime

import cv2
import numpy as np
from flask import Flask, jsonify, request
from flask_cors import CORS

# ── Ensure backend modules are importable ──────────────────────
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, BASE_DIR)

from database import (
    init_db, create_user, authenticate_user, create_token,
    get_user_by_token, get_user_sessions, save_session, get_session, get_session_data
)
from risk_module.risk_engine import RiskScoringEngine
from eye_tracking.gaze_detection_tasks import get_eye_status
from face_tracking.face_detection import get_face_status

# Voice is optional (mic may not be available)
VOICE_AVAILABLE = False
try:
    from voice_module.voice_detection import calibrate_noise, detect_voice
    VOICE_AVAILABLE = True
except Exception as e:
    print(f"⚠ Voice module unavailable: {e}")

from feedback_engine import generate_feedback

# ── Init DB on startup ─────────────────────────────────────────
init_db()

# ── Flask App ──────────────────────────────────────────────────
app = Flask(__name__)
CORS(app, origins=["http://localhost:3000", "http://localhost:3001", "http://127.0.0.1:3000", "http://127.0.0.1:3001"])

# ── Session State ──────────────────────────────────────────────

engine = None
session_data = []
noise_level = None
voice_thread = None
voice_lock = threading.Lock()

state = {
    "running": False,
    "session_id": None,
    "start_time": None,
    "elapsed": 0,
    "current_user_id": None,  # Set when session starts

    "eye_direction": "center",
    "eye_status": "normal",
    "eye_violations": 0,

    "face_detected": True,
    "face_count": 1,
    "face_status": "Normal",
    "face_violations": 0,

    "voice_status": "Normal",
    "noise_detected": False,
    "voice_violations": 0,
    "audio_level": 0.0,

    "risk_score": 0,
    "risk_level": "LOW",
    "risk_history": [],
    "alerts": [],
}

# Eye buffer for stability
eye_buffer = []
BUFFER_SIZE = 5
last_engine_update = 0
alert_id_counter = 0


# ── Voice Monitoring Thread ────────────────────────────────────

def voice_monitoring_loop():
    """Background thread that continuously monitors microphone via sounddevice."""
    global noise_level
    import sounddevice as sd

    print("Voice monitoring thread started")

    while state["running"]:
        try:
            # Record a short audio sample
            duration = 0.3  # 300ms samples
            audio = sd.rec(int(duration * 44100), samplerate=44100, channels=1)
            sd.wait()

            # Use RMS (root mean square) — comparable to calibration regardless of duration
            rms = float(np.sqrt(np.mean(audio ** 2)))

            with voice_lock:
                if noise_level and rms > noise_level * 1.5:
                    state["voice_status"] = "Background voice detected"
                    state["noise_detected"] = True
                    state["audio_level"] = round(rms, 4)
                else:
                    state["voice_status"] = "Normal"
                    state["noise_detected"] = False
                    state["audio_level"] = round(rms, 4)

        except Exception as e:
            print(f"Voice detection error: {e}")
            time.sleep(0.5)

    print("Voice monitoring thread stopped")


def decode_frame(base64_data: str) -> np.ndarray:
    """Decode a base64 JPEG string into an OpenCV BGR frame."""
    if "," in base64_data:
        base64_data = base64_data.split(",", 1)[1]
    img_bytes = base64.b64decode(base64_data)
    nparr = np.frombuffer(img_bytes, np.uint8)
    frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    return frame


# ── API Endpoints ──────────────────────────────────────────────

@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({
        "status": "ok",
        "voice_available": VOICE_AVAILABLE,
        "timestamp": datetime.now().isoformat(),
    })


@app.route("/api/session/start", methods=["POST"])
def start_session():
    global engine, session_data, eye_buffer, last_engine_update, alert_id_counter, noise_level, voice_thread

    if state["running"]:
        return jsonify({"error": "Session already running", "session_id": state["session_id"]}), 400

    # Optionally resolve user from auth header and/or request payload user_id
    data = request.get_json(silent=True) or {}
    requested_user_id = data.get("user_id")

    user_id = None
    auth_header = request.headers.get("Authorization", "")
    if auth_header.startswith("Bearer "):
        token = auth_header[7:]
        user = get_user_by_token(token)
        if user:
            user_id = user["id"]
    elif requested_user_id:
        user_id = requested_user_id

    import uuid
    session_id = f"sess-{uuid.uuid4().hex[:12]}"
    state["running"] = True
    state["session_id"] = session_id
    state["current_user_id"] = user_id
    state["start_time"] = time.time()
    state["elapsed"] = 0
    state["eye_violations"] = 0
    state["face_violations"] = 0
    state["voice_violations"] = 0
    state["voice_status"] = "Normal"
    state["noise_detected"] = False
    state["audio_level"] = 0.0
    state["risk_score"] = 0
    state["risk_level"] = "LOW"
    state["risk_history"] = []
    state["alerts"] = []

    engine = RiskScoringEngine()
    session_data = []
    eye_buffer = []
    last_engine_update = time.time()
    alert_id_counter = 0

    # Calibrate voice and start background monitoring
    voice_ok = False
    if VOICE_AVAILABLE:
        try:
            noise_level = calibrate_noise(duration=1)
            print(f"Voice calibrated. Noise RMS: {noise_level:.6f}, Threshold: {noise_level * 1.5:.6f}")
            voice_ok = True
            voice_thread = threading.Thread(target=voice_monitoring_loop, daemon=True)
            voice_thread.start()
        except Exception as e:
            print(f"⚠ Voice calibration failed: {e}")

    print(f"🟢 Session started: {session_id} (user: {user_id or 'anonymous'})")

    return jsonify({
        "status": "started",
        "session_id": session_id,
        "voice_available": voice_ok,
    })


@app.route("/api/session/stop", methods=["POST"])
def stop_session():
    global session_data, voice_thread

    if not state["running"]:
        return jsonify({"error": "No active session"}), 400

    state["running"] = False

    # Stop voice thread
    if voice_thread is not None:
        voice_thread.join(timeout=3)
        voice_thread = None

    total = len(session_data) if session_data else 1
    avg_risk = round(sum(d["score"] for d in session_data) / total, 2) if session_data else 0
    max_risk = round(max((d["score"] for d in session_data), default=0), 2)
    evaluation = "good" if avg_risk < 3 else ("needs_improvement" if avg_risk < 6 else "high_risk")

    # Save session.json for feedback engine
    session_file = os.path.join(BASE_DIR, "session.json")
    try:
        with open(session_file, "w") as f:
            json.dump(session_data, f)
        print(f"💾 Session JSON saved ({total} records)")
    except Exception as e:
        print(f"⚠ Could not save session JSON: {e}")

    # Save to SQLite DB (if user is authenticated)
    payload = request.get_json(silent=True) or {}
    user_id = state.get("current_user_id") or payload.get("user_id")
    session_id = state["session_id"]
    db_saved = False
    if user_id:
        try:
            save_session(
                user_id=user_id,
                session_id=session_id,
                duration_sec=state["elapsed"],
                eye_violations=state["eye_violations"],
                face_violations=state["face_violations"],
                voice_violations=state["voice_violations"],
                avg_risk=avg_risk,
                max_risk=max_risk,
                risk_level=state["risk_level"],
                evaluation=evaluation,
                total_records=total,
                raw_records=session_data,
            )
            db_saved = True
            print(f"💾 Session saved to DB for user {user_id}")
        except Exception as e:
            print(f"⚠ DB save failed: {e}")
            traceback.print_exc()

    summary = {
        "session_id": session_id,
        "duration": state["elapsed"],
        "eye_violations": state["eye_violations"],
        "face_violations": state["face_violations"],
        "voice_violations": state["voice_violations"],
        "avg_risk": avg_risk,
        "max_risk": max_risk,
        "risk_history": state["risk_history"],
        "total_records": total,
        "evaluation": evaluation,
        "db_saved": db_saved,
    }

    print(f"🔴 Session stopped: {session_id}")
    return jsonify({"status": "stopped", "summary": summary})


@app.route("/api/process-frame", methods=["POST"])
def process_frame():
    """
    Receives a webcam frame from the browser as base64 JPEG.
    Runs eye tracking (gaze_model.pkl) + face detection on it.
    Voice status is read from the background monitoring thread.
    """
    global eye_buffer, last_engine_update, alert_id_counter

    if not state["running"]:
        return jsonify({"error": "No active session"}), 400

    data = request.get_json()
    if not data or "frame" not in data:
        return jsonify({"error": "No frame data provided"}), 400

    try:
        frame = decode_frame(data["frame"])
        if frame is None:
            return jsonify({"error": "Could not decode frame"}), 400
    except Exception as e:
        return jsonify({"error": f"Frame decode error: {str(e)}"}), 400

    current_time = time.time()

    # ── Eye detection (uses trained gaze_model.pkl) ──
    try:
        eye_raw = get_eye_status(frame)
    except Exception as ex:
        print(f"⚠ Eye detection error: {ex}")
        eye_raw = "normal"

    eye_buffer.append(eye_raw)
    if len(eye_buffer) > BUFFER_SIZE:
        eye_buffer.pop(0)
    final_eye = max(set(eye_buffer), key=eye_buffer.count)

    # ── Face detection (MediaPipe FaceLandmarker) ──
    try:
        face_raw = get_face_status(frame)
    except Exception as ex:
        print(f"⚠ Face detection error: {ex}")
        face_raw = "Normal"

    face_detected = (face_raw == "Normal")
    multiple_faces = (face_raw == "Multiple Faces")
    face_count = 0 if face_raw == "Face Missing" else (2 if face_raw == "Multiple Faces" else 1)

    # ── Voice status (read from background thread — non-blocking) ──
    with voice_lock:
        voice_raw = state["voice_status"]
        noise_flag = state["noise_detected"]
        audio_level = state["audio_level"]

    # ── Update risk engine (throttled to every 0.5s) ──
    if current_time - last_engine_update > 0.5:
        looking_direction = final_eye if final_eye in ["left", "right"] else "center"
        engine.update_eye(looking_direction)
        engine.update_face(face_detected, multiple_faces)
        engine.update_voice(noise_flag)
        last_engine_update = current_time

    risk_score = engine.calculate_risk()
    risk_level = engine.get_risk_level()

    # ── Generate alerts ──
    new_alerts = []
    if final_eye in ["left", "right"]:
        new_alerts.append({"id": alert_id_counter, "type": "warn", "msg": f"👁 Gaze deviation — looking {final_eye}"})
        alert_id_counter += 1
    if final_eye == "down":
        new_alerts.append({"id": alert_id_counter, "type": "warn", "msg": "👁 Looking down — possible phone/notes usage"})
        alert_id_counter += 1
    if face_raw == "Face Missing":
        new_alerts.append({"id": alert_id_counter, "type": "err", "msg": "🧑 Face not detected — candidate may have left frame"})
        alert_id_counter += 1
    if face_raw == "Multiple Faces":
        new_alerts.append({"id": alert_id_counter, "type": "err", "msg": "🧑 Multiple faces — unauthorized person detected"})
        alert_id_counter += 1
    if noise_flag:
        new_alerts.append({"id": alert_id_counter, "type": "warn", "msg": f"🎤 Background noise detected — volume {audio_level:.1f}"})
        alert_id_counter += 1
    if final_eye == "normal" and face_raw == "Normal" and not noise_flag and len(session_data) % 8 == 0:
        new_alerts.append({"id": alert_id_counter, "type": "ok", "msg": "✅ All systems normal — session integrity stable"})
        alert_id_counter += 1

    # ── Update state ──
    elapsed = current_time - state["start_time"] if state["start_time"] else 0
    state["elapsed"] = int(elapsed)
    state["eye_direction"] = final_eye
    state["eye_status"] = "warning" if final_eye in ["left", "right", "down"] else "normal"
    state["eye_violations"] = engine.eye_violations
    state["face_detected"] = face_detected
    state["face_count"] = face_count
    state["face_status"] = face_raw
    state["face_violations"] = engine.face_violations
    state["voice_violations"] = engine.voice_violations
    state["risk_score"] = risk_score
    state["risk_level"] = risk_level
    state["risk_history"].append(risk_score)
    if len(state["risk_history"]) > 30:
        state["risk_history"] = state["risk_history"][-30:]
    state["alerts"] = (new_alerts + state["alerts"])[:12]

    # ── Record session data ──
    session_data.append({
        "eye": final_eye,
        "face": face_raw,
        "voice": voice_raw,
        "score": risk_score,
        "level": risk_level,
        "time": current_time,
    })

    # Return results immediately
    return jsonify({
        "eye": {"direction": final_eye, "status": state["eye_status"], "violations": engine.eye_violations},
        "face": {"detected": face_detected, "count": face_count, "status": face_raw, "violations": engine.face_violations},
        "voice": {"status": voice_raw, "noise_detected": noise_flag, "violations": engine.voice_violations, "audio_level": audio_level},
        "risk": {"score": risk_score, "level": risk_level},
        "elapsed": state["elapsed"],
    })


@app.route("/api/live-data", methods=["GET"])
def live_data():
    if not state["running"]:
        return jsonify({"error": "No active session", "running": False}), 200

    return jsonify({
        "running": True,
        "session_id": state["session_id"],
        "elapsed": state["elapsed"],
        "eye": {
            "direction": state["eye_direction"],
            "status": state["eye_status"],
            "violations": state["eye_violations"],
        },
        "face": {
            "detected": state["face_detected"],
            "count": state["face_count"],
            "status": state["face_status"],
            "violations": state["face_violations"],
        },
        "voice": {
            "status": state["voice_status"],
            "noise_detected": state["noise_detected"],
            "violations": state["voice_violations"],
            "audio_level": state["audio_level"],
        },
        "risk": {
            "score": state["risk_score"],
            "level": state["risk_level"],
            "history": state["risk_history"],
        },
        "alerts": state["alerts"][:8],
    })


@app.route("/api/session-summary", methods=["GET"])
def session_summary():
    session_file = os.path.join(BASE_DIR, "session.json")
    if not os.path.exists(session_file):
        return jsonify({"error": "No session data found"}), 404

    try:
        with open(session_file, "r") as f:
            data = json.load(f)

        total = len(data) if data else 1
        eye_issues = sum(1 for d in data if d["eye"] in ["left", "right", "down"])
        face_issues = sum(1 for d in data if d["face"] != "Normal")
        voice_issues = sum(1 for d in data if d["voice"] != "Normal")
        avg_risk = round(sum(d["score"] for d in data) / total, 2)
        risk_history = [d["score"] for d in data[::max(1, len(data) // 20)]]

        evaluation = "good" if avg_risk < 3 else ("needs_improvement" if avg_risk < 6 else "high_risk")

        return jsonify({
            "duration": int(data[-1]["time"] - data[0]["time"]) if len(data) > 1 else 0,
            "eye_violations": eye_issues,
            "face_violations": face_issues,
            "voice_violations": voice_issues,
            "avg_risk": avg_risk,
            "risk_history": risk_history,
            "evaluation": evaluation,
            "total_records": total,
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/feedback", methods=["GET"])
def feedback():
    session_file = os.path.join(BASE_DIR, "session.json")
    if not os.path.exists(session_file):
        return jsonify({"error": "No session data found"}), 404

    try:
        result = generate_feedback(session_file)
        suggestions = []
        for msg in result["feedback"]:
            category = "General"
            compliance = 75
            if "eye" in msg.lower():
                category = "Eye Contact"
                compliance = max(30, 100 - result["eye_issues"] * 5)
            elif "face" in msg.lower() or "visible" in msg.lower():
                category = "Face Presence"
                compliance = max(30, 100 - result["face_issues"] * 8)
            elif "voice" in msg.lower() or "audio" in msg.lower() or "noise" in msg.lower():
                category = "Audio Environment"
                compliance = max(30, 100 - result["voice_issues"] * 5)
            elif "focus" in msg.lower() or "distraction" in msg.lower():
                category = "Focus & Discipline"
                compliance = max(30, 100 - int(result["avg_score"] * 8))

            suggestions.append({
                "category": category,
                "message": msg,
                "compliance": compliance,
            })

        return jsonify({
            "suggestions": suggestions,
            "score": result["avg_score"],
            "eye_issues": result["eye_issues"],
            "face_issues": result["face_issues"],
            "voice_issues": result["voice_issues"],
        })
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


# ── Auth Endpoints ─────────────────────────────────────────────

@app.route("/api/auth/register", methods=["POST"])
def register():
    data = request.get_json() or {}
    required = ["name", "email", "password", "college", "branch", "course", "year"]
    missing = [f for f in required if not data.get(f, "").strip()]
    if missing:
        return jsonify({"error": f"Missing fields: {', '.join(missing)}"}), 400

    try:
        user = create_user(
            name=data["name"].strip(),
            email=data["email"].strip(),
            password=data["password"],
            college=data["college"].strip(),
            branch=data["branch"].strip(),
            course=data["course"].strip(),
            year=data["year"].strip(),
            role=data.get("role", "student"),
        )
        token = create_token(user["id"])
        print(f"✅ Registered: {user['email']}")
        return jsonify({"user": user, "token": token}), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 409
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


@app.route("/api/auth/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    email = data.get("email", "").strip()
    password = data.get("password", "")
    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    user = authenticate_user(email, password)
    if not user:
        return jsonify({"error": "Invalid email or password"}), 401

    token = create_token(user["id"])
    print(f"✅ Login: {user['email']}")
    return jsonify({"user": user, "token": token})


@app.route("/api/auth/me", methods=["GET"])
def me():
    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        return jsonify({"error": "No token provided"}), 401
    token = auth_header[7:]
    user = get_user_by_token(token)
    if not user:
        return jsonify({"error": "Invalid or expired token"}), 401
    return jsonify({"user": user})


def _get_authenticated_user():
    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        return None, (jsonify({"error": "Authentication required"}), 401)

    token = auth_header[7:]
    user = get_user_by_token(token)
    if not user:
        return None, (jsonify({"error": "Invalid token"}), 401)
    return user, None


# ── User Data Endpoints ────────────────────────────────────────

@app.route("/api/users/<user_id>/sessions", methods=["GET"])
def user_sessions(user_id):
    """Return all sessions for a user (self access, or admin)."""
    user, auth_error = _get_authenticated_user()
    if auth_error:
        return auth_error

    if user["id"] != user_id and user.get("role") != "admin":
        return jsonify({"error": "Forbidden"}), 403

    sessions = get_user_sessions(user_id)
    return jsonify({"sessions": sessions, "user": user})


@app.route("/api/users/sessions", methods=["GET"])
def user_sessions_legacy():
    """Backward-compatible endpoint for existing frontend clients."""
    user, auth_error = _get_authenticated_user()
    if auth_error:
        return auth_error
    sessions = get_user_sessions(user["id"])
    return jsonify({"sessions": sessions, "user": user})


@app.route("/api/users/<user_id>/sessions/<session_id>", methods=["GET"])
def user_session_detail(user_id, session_id):
    """Return one session summary and its raw frame data."""
    user, auth_error = _get_authenticated_user()
    if auth_error:
        return auth_error

    if user["id"] != user_id and user.get("role") != "admin":
        return jsonify({"error": "Forbidden"}), 403

    session = get_session(session_id)
    if not session or session.get("user_id") != user_id:
        return jsonify({"error": "Session not found"}), 404

    records = get_session_data(session_id)
    # Return sampled risk history (max 30 points)
    scores = [r["score"] for r in records if r["score"] is not None]
    step = max(1, len(scores) // 30)
    sampled = scores[::step]

    return jsonify({
        "session": session,
        "session_data": records,
        "risk_history": sampled,
        "total_records": len(records),
    })


@app.route("/api/users/sessions/<session_id>/records", methods=["GET"])
def session_records_legacy(session_id):
    """Backward-compatible endpoint for existing frontend clients."""
    user, auth_error = _get_authenticated_user()
    if auth_error:
        return auth_error
    session = get_session(session_id)
    if not session or session.get("user_id") != user.get("id"):
        return jsonify({"error": "Session not found"}), 404
    records = get_session_data(session_id)
    scores = [r["score"] for r in records if r["score"] is not None]
    step = max(1, len(scores) // 30)
    sampled = scores[::step]
    return jsonify({"session": session, "risk_history": sampled, "total_records": len(records)})



# ── Run Server ─────────────────────────────────────────────────

if __name__ == "__main__":
    print("=" * 50)
    print("  AISMS Backend API Server")
    print(f"  Voice module: {'✅ Available' if VOICE_AVAILABLE else '⚠ Disabled'}")
    print("  Server: http://localhost:5001")
    print("  Mode: Browser webcam + background voice monitoring")
    print("  Auth: SQLite database at aisms.db")
    print("=" * 50)
    app.run(host="0.0.0.0", port=5001, debug=False, threaded=True)


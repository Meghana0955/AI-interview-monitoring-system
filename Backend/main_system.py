import cv2
import time
import json
# Risk Engine
from risk_module.risk_engine import RiskScoringEngine

# Eye Tracking
from eye_tracking.gaze_detection_tasks import get_eye_status

# Face Tracking
from face_tracking.face_detection import get_face_status

# Voice
from voice_module.voice_detection import calibrate_noise, detect_voice

# ---------------- INIT ---------------- #

engine = RiskScoringEngine()
cap = cv2.VideoCapture(0)

# Calibrate voice once
noise_level = calibrate_noise()

print("System Started... Press Q to exit")

# 🔥 NEW: TIMERS
last_update_time = time.time()
last_print_time = time.time()

# 🔥 NEW: BUFFER FOR STABILITY
eye_buffer = []
BUFFER_SIZE = 5

# 🔥 SESSION DATA (FOR FEEDBACK)
session_data = []

# ---------------- MAIN LOOP ---------------- #

while True:
    ret, frame = cap.read()
    if not ret:
        break

    current_time = time.time()

    # 👁️ Eye detection
    eye_status = get_eye_status(frame)

    # 🙂 Face detection
    face_status = get_face_status(frame)

    # 🎤 Voice detection
    voice_status = detect_voice(noise_level)

    # ---------------- BUFFER LOGIC (ANTI-NOISE) ---------------- #

    eye_buffer.append(eye_status)
    if len(eye_buffer) > BUFFER_SIZE:
        eye_buffer.pop(0)

    # Majority decision (smooth output)
    final_eye = max(set(eye_buffer), key=eye_buffer.count)

    # ---------------- CONVERT TO ENGINE INPUT ---------------- #

    # Eye
    if final_eye in ["left", "right"]:
        looking_direction = final_eye
    else:
        looking_direction = "center"

    # Face
    face_detected = (face_status == "Normal")
    multiple_faces = (face_status == "Multiple Faces")

    # Voice
    noise_detected = (voice_status != "Normal")

    # ---------------- CONTROLLED UPDATE ---------------- #
    # 🔥 Update only every 0.5 sec

    if current_time - last_update_time > 0.5:
        engine.update_eye(looking_direction)
        engine.update_face(face_detected, multiple_faces)
        engine.update_voice(noise_detected)

        last_update_time = current_time

    session_data.append({
        "eye": final_eye,
        "face": face_status,
        "voice": voice_status,
        "score": engine.calculate_risk(),
        "level": engine.get_risk_level(),
        "time": current_time
    })

    # ---------------- CONTROLLED DISPLAY ---------------- #
    # 🔥 Print only every 2 sec

    if current_time - last_print_time > 2:
        engine.display_status()
        last_print_time = current_time

    # ---------------- SHOW CAMERA ---------------- #

    cv2.imshow("Interview Monitoring System", frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

with open("session.json", "w") as f:
    json.dump(session_data, f)

print("Session data saved to session.json")

# ---------------- CLEANUP ---------------- #

cap.release()
cv2.destroyAllWindows()
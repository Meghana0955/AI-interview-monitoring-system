import time

class RiskScoringEngine:
    def __init__(self):
        # Violation Counters
        self.eye_violations = 0
        self.face_violations = 0
        self.voice_violations = 0

        # Time tracking
        self.look_start_time = None
        self.no_face_start_time = None
        self.noise_start_time = None

        # Weights (adjustable)
        self.weights = {
            "eye": 1.0,
            "face": 1.2,
            "voice": 1.0
        }

    # ---------------- EYE TRACKING ---------------- #
    def update_eye(self, looking_direction):
        current_time = time.time()

        if looking_direction in ["left", "right"]:
            if self.look_start_time is None:
                self.look_start_time = current_time
            else:
                duration = current_time - self.look_start_time

                if duration > 3:  # suspicious if >3 sec
                    self.eye_violations += 1
                    print(f"[EYE] Suspicious look detected ({duration:.2f}s)")
                    self.look_start_time = current_time
        else:
            self.look_start_time = None

    # ---------------- FACE TRACKING ---------------- #
    def update_face(self, face_detected, multiple_faces=False):
        current_time = time.time()

        if not face_detected:
            if self.no_face_start_time is None:
                self.no_face_start_time = current_time
            else:
                duration = current_time - self.no_face_start_time
                if duration > 1:
                    self.face_violations += 1
                    print(f"[FACE] No face detected ({duration:.2f}s)")
                    self.no_face_start_time = current_time
        else:
            self.no_face_start_time = None

        if multiple_faces:
            self.face_violations += 2
            print("[FACE] Multiple faces detected!")

    # ---------------- VOICE TRACKING ---------------- #
    def update_voice(self, noise_detected):
        current_time = time.time()

        if noise_detected:
            if self.noise_start_time is None:
                self.noise_start_time = current_time
            else:
                duration = current_time - self.noise_start_time
                if duration > 2:
                    self.voice_violations += 1
                    print(f"[VOICE] Background noise detected ({duration:.2f}s)")
                    self.noise_start_time = current_time
        else:
            self.noise_start_time = None

    # ---------------- FINAL RISK SCORE ---------------- #
    def calculate_risk(self):
        risk_score = (
            self.eye_violations * self.weights["eye"] +
            self.face_violations * self.weights["face"] +
            self.voice_violations * self.weights["voice"]
        )

        return round(risk_score, 2)

    # ---------------- RISK LEVEL ---------------- #
    def get_risk_level(self):
        score = self.calculate_risk()

        if score < 3:
            return "LOW"
        elif score < 6:
            return "MEDIUM"
        else:
            return "HIGH"

    # ---------------- DEBUG DISPLAY ---------------- #
    def display_status(self):
        print("\n===== RISK STATUS =====")
        print(f"Eye Violations   : {self.eye_violations}")
        print(f"Face Violations  : {self.face_violations}")
        print(f"Voice Violations : {self.voice_violations}")
        print(f"Risk Score       : {self.calculate_risk()}")
        print(f"Risk Level       : {self.get_risk_level()}")
        print("=======================\n")
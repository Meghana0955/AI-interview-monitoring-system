from risk_engine import RiskScoringEngine
import time

engine = RiskScoringEngine()

print("Testing violations...")

while True:
    # FORCE VIOLATION
    looking_direction = "left"
    face_detected = False
    multiple_faces = False
    noise_detected = True

    engine.update_eye(looking_direction)
    engine.update_face(face_detected, multiple_faces)
    engine.update_voice(noise_detected)

    engine.display_status()

    time.sleep(1)
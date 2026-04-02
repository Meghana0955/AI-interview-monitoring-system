import cv2
import numpy as np
import joblib
import mediapipe as mp
import pandas as pd

from mediapipe.tasks import python
from mediapipe.tasks.python import vision

# ---------------- LOAD MODEL ---------------- #
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(BASE_DIR, "gaze_model.pkl")

model = joblib.load(model_path)

# ---------------- LOAD FACE LANDMARKER ---------------- #

base_options = python.BaseOptions(model_asset_path=os.path.join(BASE_DIR, "face_landmarker.task"))

options = vision.FaceLandmarkerOptions(
    base_options=base_options,
    num_faces=1
)

landmarker = vision.FaceLandmarker.create_from_options(options)

# ---------------- NEW FUNCTION (IMPORTANT) ---------------- #

def get_eye_status(frame):
    """
    Returns:
    - 'normal'
    - 'left'
    - 'right'
    - 'down'
    """

    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb)

    result = landmarker.detect(mp_image)

    if result.face_landmarks:

        landmarks = result.face_landmarks[0]

        left_eye = landmarks[33]
        right_eye = landmarks[263]
        nose = landmarks[1]

        features = pd.DataFrame([[ 
            left_eye.x, left_eye.y,
            right_eye.x, right_eye.y,
            nose.x, nose.y
        ]], columns=[
            "left_x", "left_y",
            "right_x", "right_y",
            "nose_x", "nose_y"
        ])

        prediction = model.predict(features)[0]

        return prediction  # clean return

    return "normal"


# ---------------- STANDALONE TEST (only runs directly) ---------------- #

if __name__ == "__main__":
    cap = cv2.VideoCapture(0)

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        eye_status = get_eye_status(frame)

        # Display (for testing)
        if eye_status == "normal":
            display_text = "Normal"
        else:
            display_text = f"Suspicious: {eye_status}"

        cv2.putText(frame, display_text, (30, 40),
                    cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)

        cv2.imshow("Gaze Detection", frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()
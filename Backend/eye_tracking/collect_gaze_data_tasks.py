import cv2
import pandas as pd
import mediapipe as mp

from mediapipe.tasks import python
from mediapipe.tasks.python import vision

# Load face landmarker
base_options = python.BaseOptions(model_asset_path="../face_landmarker.task")
options = vision.FaceLandmarkerOptions(
    base_options=base_options,
    num_faces=1
)

landmarker = vision.FaceLandmarker.create_from_options(options)

cap = cv2.VideoCapture(0)

data = []

print("Press:")
print("n = normal, l = left, r = right, d = down, q = quit")

while True:
    ret, frame = cap.read()
    if not ret:
        break

    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb)

    result = landmarker.detect(mp_image)

    features = None

    if result.face_landmarks:
        landmarks = result.face_landmarks[0]

        left_eye = landmarks[33]
        right_eye = landmarks[263]
        nose = landmarks[1]

        features = [
            left_eye.x, left_eye.y,
            right_eye.x, right_eye.y,
            nose.x, nose.y
        ]

        cv2.putText(frame, "Collecting...", (20, 40),
                    cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

    cv2.imshow("Gaze Data Collection", frame)
    key = cv2.waitKey(1) & 0xFF

    if features:
        if key == ord('n'):
            data.append(features + ["normal"])
            print("Saved: normal")

        elif key == ord('l'):
            data.append(features + ["left"])
            print("Saved: left")

        elif key == ord('r'):
            data.append(features + ["right"])
            print("Saved: right")

        elif key == ord('d'):
            data.append(features + ["down"])
            print("Saved: down")

    if key == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()

columns = [
    "left_x", "left_y",
    "right_x", "right_y",
    "nose_x", "nose_y",
    "label"
]

df = pd.DataFrame(data, columns=columns)
df.to_csv("gaze_dataset.csv", index=False)

print("Dataset saved as gaze_dataset.csv")

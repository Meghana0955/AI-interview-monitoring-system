import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

import cv2
import mediapipe as mp
import urllib.request

from mediapipe.tasks import python
from mediapipe.tasks.python import vision

# ---------------- MODEL SETUP ---------------- #

model_path = "../face_landmarker.task"

if not os.path.exists(model_path):
    print("Downloading face landmarker model...")
    url = "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/latest/face_landmarker.task"
    urllib.request.urlretrieve(url, model_path)
    print("Download complete.")

# Load face landmarker
base_options = python.BaseOptions(model_asset_path=model_path)

options = vision.FaceLandmarkerOptions(
    base_options=base_options,
    num_faces=5
)

landmarker = vision.FaceLandmarker.create_from_options(options)

# ---------------- NEW FUNCTION (IMPORTANT) ---------------- #

def get_face_status(frame):
    """
    Returns:
    - 'Normal'
    - 'Face Missing'
    - 'Multiple Faces'
    """

    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb)

    result = landmarker.detect(mp_image)

    face_count = len(result.face_landmarks) if result.face_landmarks else 0

    if face_count == 0:
        return "Face Missing"

    elif face_count == 1:
        return "Normal"

    else:
        return "Multiple Faces"


# ---------------- EXISTING CODE (UNCHANGED) ---------------- #

cap = cv2.VideoCapture(0)

while True:
    ret, frame = cap.read()
    if not ret:
        break

    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb)

    result = landmarker.detect(mp_image)

    face_count = len(result.face_landmarks) if result.face_landmarks else 0

    suspicious = False

    # Determine status
    if face_count == 0:
        status = "Face Missing"
        color = (0, 0, 255)
        suspicious = True

    elif face_count == 1:
        status = "Normal"
        color = (0, 255, 0)

    else:
        status = "WARNING: Multiple Faces Detected"
        color = (0, 0, 255)
        suspicious = True

    # Draw face count
    cv2.putText(frame, f"Faces: {face_count}", (30, 40),
                cv2.FONT_HERSHEY_SIMPLEX, 1, color, 2)

    # Draw status
    cv2.putText(frame, status, (30, 80),
                cv2.FONT_HERSHEY_SIMPLEX, 1, color, 2)

    cv2.imshow("Face Detection", frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()

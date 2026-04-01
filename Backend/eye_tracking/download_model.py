import urllib.request
import os

model_path = "../face_landmarker.task"

if not os.path.exists(model_path):
    url = "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/latest/face_landmarker.task"
    print("Downloading face landmarker model...")
    urllib.request.urlretrieve(url, model_path)
    print("Download complete.")
else:
    print("Model already exists.")

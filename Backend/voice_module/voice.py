from .voice_detection import detect_voice

print("Starting voice detection...")

while True:
    status = detect_voice()
    print("Voice Status:", status)
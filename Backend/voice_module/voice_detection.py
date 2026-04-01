import sounddevice as sd
import numpy as np

# -------- CALIBRATION -------- #

def calibrate_noise(duration=2):
    print("Calibrating... Stay silent")

    audio = sd.rec(int(duration * 44100),
                   samplerate=44100,
                   channels=1)
    sd.wait()

    noise_level = np.linalg.norm(audio)

    print(f"Noise Level: {noise_level:.5f}")
    return noise_level


# -------- DETECTION -------- #

def detect_voice(noise_level, duration=0.5, factor=1.2):

    audio = sd.rec(int(duration * 44100),
                   samplerate=44100,
                   channels=1)
    sd.wait()

    volume = np.linalg.norm(audio)

    print(f"[DEBUG] Volume: {volume:.5f}")

    if volume > noise_level * factor:
        return "Background voice detected"
    else:
        return "Normal"
    
    print(f"[VOICE CHECK] Threshold: {noise_level * factor}")

# -------- MAIN -------- #

if __name__ == "__main__":

    noise_level = calibrate_noise()

    print("\nVoice Detection Started... Press Ctrl+C to stop\n")

    try:
        while True:
            status = detect_voice(noise_level)
            print("Voice Status:", status)

    except KeyboardInterrupt:
        print("\nStopped")
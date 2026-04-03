import sounddevice as sd
import numpy as np

# -------- CALIBRATION -------- #

def calibrate_noise(duration=2):
    print("Calibrating... Stay silent")

    audio = sd.rec(int(duration * 44100),
                   samplerate=44100,
                   channels=1)
    sd.wait()

    # Use RMS (root mean square) so the value is independent of recording length
    rms = float(np.sqrt(np.mean(audio ** 2)))

    print(f"Noise Level (RMS): {rms:.5f}")
    return rms


# -------- DETECTION -------- #

def detect_voice(noise_level, duration=0.5, factor=1.5):

    audio = sd.rec(int(duration * 44100),
                   samplerate=44100,
                   channels=1)
    sd.wait()

    # Use RMS so it's comparable to the calibration value
    rms = float(np.sqrt(np.mean(audio ** 2)))

    if rms > noise_level * factor:
        return "Background voice detected", rms
    else:
        return "Normal", rms

# -------- MAIN -------- #

if __name__ == "__main__":

    noise_level = calibrate_noise()

    print("\nVoice Detection Started... Press Ctrl+C to stop\n")

    try:
        while True:
            status, vol = detect_voice(noise_level)
            print(f"Voice Status: {status} (RMS: {vol:.5f}, Threshold: {noise_level * 1.5:.5f})")

    except KeyboardInterrupt:
        print("\nStopped")
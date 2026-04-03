"use client";
import { useRef, useCallback, useEffect, useState } from "react";

interface AudioMonitorOptions {
  /** Callback with current volume level (0-100) every tick */
  onLevel?: (level: number) => void;
  /** Callback when noise threshold is exceeded */
  onNoiseDetected?: (level: number) => void;
  /** Volume above this is considered noise (0-100, default 15) */
  threshold?: number;
  /** Milliseconds between level updates (default 200) */
  interval?: number;
}

export function useAudioMonitor({
  onLevel,
  onNoiseDetected,
  threshold = 15,
  interval = 200,
}: AudioMonitorOptions = {}) {
  const streamRef = useRef<MediaStream | null>(null);
  const contextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const timerRef = useRef<number | null>(null);
  const [active, setActive] = useState(false);
  const [level, setLevel] = useState(0);
  const [noiseDetected, setNoiseDetected] = useState(false);
  const [calibratedNoise, setCalibratedNoise] = useState(5); // baseline noise floor

  const start = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: false, // we want to detect noise
          autoGainControl: true,
        },
      });

      const ctx = new AudioContext();
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.3;
      source.connect(analyser);

      streamRef.current = stream;
      contextRef.current = ctx;
      analyserRef.current = analyser;
      setActive(true);

      // Calibration: measure noise floor for 1 second
      const calibrationSamples: number[] = [];
      const calibTimer = setInterval(() => {
        const data = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteTimeDomainData(data);
        let sum = 0;
        for (let i = 0; i < data.length; i++) {
          const d = (data[i] - 128) / 128;
          sum += d * d;
        }
        const rms = Math.sqrt(sum / data.length);
        const vol = Math.min(100, Math.round(rms * 300));
        calibrationSamples.push(vol);
      }, 100);

      setTimeout(() => {
        clearInterval(calibTimer);
        if (calibrationSamples.length > 0) {
          const avgNoise = calibrationSamples.reduce((a, b) => a + b, 0) / calibrationSamples.length;
          setCalibratedNoise(Math.max(3, avgNoise));
        }

        // Start monitoring loop
        timerRef.current = window.setInterval(() => {
          if (!analyserRef.current) return;
          const data = new Uint8Array(analyserRef.current.frequencyBinCount);
          analyserRef.current.getByteTimeDomainData(data);

          let sum = 0;
          for (let i = 0; i < data.length; i++) {
            const d = (data[i] - 128) / 128;
            sum += d * d;
          }
          const rms = Math.sqrt(sum / data.length);
          const vol = Math.min(100, Math.round(rms * 300));

          setLevel(vol);
          onLevel?.(vol);

          const isNoise = vol > threshold;
          setNoiseDetected(isNoise);
          if (isNoise) {
            onNoiseDetected?.(vol);
          }
        }, interval);
      }, 1000); // 1 second calibration period

    } catch (err) {
      console.error("Microphone access denied or unavailable:", err);
      setActive(false);
    }
  }, [onLevel, onNoiseDetected, threshold, interval]);

  const stop = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (contextRef.current) {
      contextRef.current.close().catch(() => {});
      contextRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    analyserRef.current = null;
    setActive(false);
    setLevel(0);
    setNoiseDetected(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => { stop(); };
  }, [stop]);

  return { start, stop, active, level, noiseDetected, calibratedNoise };
}

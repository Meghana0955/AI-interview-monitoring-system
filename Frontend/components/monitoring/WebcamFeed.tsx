"use client";
import { useRef, useEffect, useState, useCallback } from "react";

interface WebcamFeedProps {
  label?: string;
  showMesh?: boolean;
  showAudio?: boolean;
  aspectRatio?: string;
  className?: string;
  /** If true, enable the camera stream */
  active?: boolean;
  /** Called with base64 JPEG frame every captureInterval ms */
  onFrame?: (base64: string) => void;
  /** How often to capture a frame (ms). Default 1500 */
  captureInterval?: number;
}

export function WebcamFeed({
  label = "LIVE FEED · 720p",
  showMesh = true,
  showAudio = true,
  aspectRatio = "aspect-video",
  className = "",
  active = true,
  onFrame,
  captureInterval = 1500,
}: WebcamFeedProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Start/stop camera
  useEffect(() => {
    if (!active) return;

    let cancelled = false;

    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: "user" },
          audio: false,
        });

        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play();
            setCameraReady(true);
          };
        }
      } catch (err: unknown) {
        console.error("Camera error:", err);
        const msg = err instanceof Error ? err.message : "Camera unavailable";
        setCameraError(msg.includes("NotAllowed") ? "Camera permission denied" : msg);
      }
    }

    startCamera();

    return () => {
      cancelled = true;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      setCameraReady(false);
    };
  }, [active]);

  // Capture frames and send to parent
  const captureFrame = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || !cameraReady) return null;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.7);
  }, [cameraReady]);

  useEffect(() => {
    if (!onFrame || !cameraReady) return;

    const id = setInterval(() => {
      const frame = captureFrame();
      if (frame) onFrame(frame);
    }, captureInterval);

    return () => clearInterval(id);
  }, [onFrame, cameraReady, captureFrame, captureInterval]);

  return (
    <div
      className={`relative bg-[#050912] border border-[#1e2d47] rounded-lg overflow-hidden ${aspectRatio} ${className}`}
    >
      {/* Real camera video */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 w-full h-full object-cover"
        style={{ transform: "scaleX(-1)" }}
      />

      {/* Hidden canvas for frame capture */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Fallback when camera is not ready */}
      {!cameraReady && !cameraError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
          <div className="absolute inset-0 bg-grid opacity-60" style={{ backgroundSize: "24px 24px" }} />
          <div className="relative w-8 h-8 mb-3">
            <div className="absolute inset-0 rounded-full border-2 border-[#1e2d47]" />
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-cyan-400 animate-spin" />
          </div>
          <div className="text-[11px] text-slate-500 font-mono relative z-10">Starting camera...</div>
        </div>
      )}

      {/* Camera error */}
      {cameraError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
          <div className="absolute inset-0 bg-grid opacity-60" style={{ backgroundSize: "24px 24px" }} />
          <div className="text-red-400 text-xl mb-2 relative z-10">⚠</div>
          <div className="text-[11px] text-red-300 font-mono relative z-10">{cameraError}</div>
          <div className="text-[10px] text-slate-500 font-mono mt-1 relative z-10">Allow camera in browser settings</div>
        </div>
      )}

      {/* AI overlay when camera is active */}
      {cameraReady && (
        <>
          {/* Face mesh SVG overlay */}
          {showMesh && (
            <svg
              className="absolute inset-0 w-full h-full opacity-15 pointer-events-none z-10"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <ellipse cx="50" cy="40" rx="22" ry="28" fill="none" stroke="#06b6d4" strokeWidth="0.4" />
              <line x1="50" y1="20" x2="50" y2="60" stroke="#06b6d4" strokeWidth="0.3" strokeDasharray="2 2" />
              <line x1="30" y1="40" x2="70" y2="40" stroke="#06b6d4" strokeWidth="0.3" strokeDasharray="2 2" />
              <circle cx="38" cy="36" r="2" fill="none" stroke="#06b6d4" strokeWidth="0.4" />
              <circle cx="62" cy="36" r="2" fill="none" stroke="#06b6d4" strokeWidth="0.4" />
              <path d="M43 50 Q50 55 57 50" fill="none" stroke="#06b6d4" strokeWidth="0.4" />
            </svg>
          )}

          {/* Scanning crosshair */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 border border-cyan-500/40 animate-scan z-10 pointer-events-none">
            <div className="absolute top-1/2 -left-1.5 right-[-6px] h-px bg-cyan-500/40" />
            <div className="absolute left-1/2 -top-1.5 bottom-[-6px] w-px bg-cyan-500/40" />
          </div>

          {/* Scan rings */}
          <div className="absolute top-1/2 left-1/2 border border-cyan-400/30 rounded-full animate-ring z-10 pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 border border-cyan-400/20 rounded-full animate-ring z-10 pointer-events-none" style={{ animationDelay: "1s" }} />
        </>
      )}

      {/* Bottom label */}
      <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 text-[9px] font-mono text-cyan-500/50 tracking-widest z-20 pointer-events-none">
        {cameraReady ? "AI ANALYSIS ACTIVE" : "FACIAL MESH ACTIVE"}
      </div>

      {/* Audio bar */}
      {showAudio && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-500/10 z-20">
          <div className="h-full bg-cyan-500/50 animate-audio" style={{ width: "35%" }} />
        </div>
      )}

      {/* Top-left label */}
      <div className="absolute top-2.5 left-2.5 bg-[#080c14]/85 border border-cyan-500/30 rounded px-2 py-1 text-[10px] font-mono text-cyan-400 z-20">
        {label}
      </div>

      {/* REC badge */}
      {cameraReady && (
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 bg-red-500/20 border border-red-500/40 rounded px-2 py-1 text-[10px] font-mono text-red-300 z-20">
          <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse-dot" />
          REC
        </div>
      )}
    </div>
  );
}

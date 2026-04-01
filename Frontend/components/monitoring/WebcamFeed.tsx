"use client";

interface WebcamFeedProps {
  label?: string;
  showMesh?: boolean;
  showAudio?: boolean;
  aspectRatio?: string;
  className?: string;
}

export function WebcamFeed({
  label = "LIVE FEED · 720p",
  showMesh = true,
  showAudio = true,
  aspectRatio = "aspect-video",
  className = "",
}: WebcamFeedProps) {
  return (
    <div
      className={`relative bg-[#050912] border border-[#1e2d47] rounded-lg overflow-hidden flex items-center justify-center ${aspectRatio} ${className}`}
    >
      {/* Grid */}
      <div className="absolute inset-0 bg-grid opacity-60" style={{ backgroundSize: "24px 24px" }} />

      {/* Face mesh SVG overlay */}
      {showMesh && (
        <svg
          className="absolute inset-0 w-full h-full opacity-20"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <ellipse cx="50" cy="40" rx="22" ry="28" fill="none" stroke="#06b6d4" strokeWidth="0.4" />
          <line x1="50" y1="20" x2="50" y2="60" stroke="#06b6d4" strokeWidth="0.3" strokeDasharray="2 2" />
          <line x1="30" y1="40" x2="70" y2="40" stroke="#06b6d4" strokeWidth="0.3" strokeDasharray="2 2" />
          <circle cx="38" cy="36" r="2" fill="none" stroke="#06b6d4" strokeWidth="0.4" />
          <circle cx="62" cy="36" r="2" fill="none" stroke="#06b6d4" strokeWidth="0.4" />
          <path d="M43 50 Q50 55 57 50" fill="none" stroke="#06b6d4" strokeWidth="0.4" />
          <line x1="30" y1="28" x2="38" y2="32" stroke="#06b6d4" strokeWidth="0.3" />
          <line x1="70" y1="28" x2="62" y2="32" stroke="#06b6d4" strokeWidth="0.3" />
        </svg>
      )}

      {/* Crosshair */}
      <div className="absolute w-14 h-14 border border-cyan-500/40 animate-scan">
        <div className="absolute top-1/2 -left-1.5 right-[-6px] h-px bg-cyan-500/40" />
        <div className="absolute left-1/2 -top-1.5 bottom-[-6px] w-px bg-cyan-500/40" />
      </div>

      {/* Scan rings */}
      <div className="absolute top-1/2 left-1/2 border border-cyan-400/60 rounded-full animate-ring" />
      <div className="absolute top-1/2 left-1/2 border border-cyan-400/40 rounded-full animate-ring" style={{ animationDelay: "1s" }} />

      {/* Bottom mesh label */}
      <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 text-[9px] font-mono text-cyan-500/50 tracking-widest">
        FACIAL MESH ACTIVE
      </div>

      {/* Audio bar */}
      {showAudio && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-500/10">
          <div className="h-full bg-cyan-500/50 animate-audio" style={{ width: "35%" }} />
        </div>
      )}

      {/* Top-left label */}
      <div className="absolute top-2.5 left-2.5 bg-[#080c14]/85 border border-cyan-500/30 rounded px-2 py-1 text-[10px] font-mono text-cyan-400">
        {label}
      </div>

      {/* REC badge */}
      <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 bg-red-500/20 border border-red-500/40 rounded px-2 py-1 text-[10px] font-mono text-red-300">
        <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse-dot" />
        REC
      </div>
    </div>
  );
}

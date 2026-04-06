"use client";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  color?: string;
  height?: string;
  className?: string;
  showLabel?: boolean;
  label?: string;
}

export function ProgressBar({
  value,
  color = "#3b82f6",
  height = "h-1.5",
  className,
  showLabel,
  label,
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div className={className}>
      {(showLabel || label) && (
        <div className="flex justify-between text-[11px] text-white/35 mb-1.5">
          <span>{label ?? "Progress"}</span>
          <span className="font-mono">{Math.round(clamped)}%</span>
        </div>
      )}
      <div className={cn("w-full bg-white/[0.06] rounded-full overflow-hidden", height)}>
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${clamped}%`, background: color, boxShadow: `0 0 8px ${color}30` }}
        />
      </div>
    </div>
  );
}

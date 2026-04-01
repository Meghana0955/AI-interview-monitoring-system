"use client";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number; // 0–100
  color?: string;
  height?: string;
  className?: string;
  showLabel?: boolean;
  label?: string;
}

export function ProgressBar({
  value,
  color = "#06b6d4",
  height = "h-1.5",
  className,
  showLabel,
  label,
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div className={className}>
      {(showLabel || label) && (
        <div className="flex justify-between text-[11px] text-slate-400 mb-1.5">
          <span>{label ?? "Progress"}</span>
          <span>{Math.round(clamped)}%</span>
        </div>
      )}
      <div className={cn("w-full bg-[#1e2d47] rounded-full overflow-hidden", height)}>
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${clamped}%`, background: color }}
        />
      </div>
    </div>
  );
}

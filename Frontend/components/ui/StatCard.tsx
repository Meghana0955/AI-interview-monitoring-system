import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  accentColor?: string;
  className?: string;
}

export function StatCard({ label, value, sub, accentColor = "#06b6d4", className }: StatCardProps) {
  return (
    <div
      className={cn(
        "relative bg-[#0f1724] border border-[#1e2d47] rounded-xl p-5 overflow-hidden",
        className
      )}
    >
      {/* Left accent bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-0.5 rounded-l-xl"
        style={{ background: accentColor }}
      />
      <div className="text-[11px] text-slate-500 font-medium uppercase tracking-wider mb-2">{label}</div>
      <div
        className="text-3xl font-bold font-mono tracking-tighter mb-1"
        style={{ color: accentColor }}
      >
        {value}
      </div>
      {sub && <div className="text-xs text-slate-400">{sub}</div>}
    </div>
  );
}

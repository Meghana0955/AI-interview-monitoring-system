import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon?: React.ReactNode;
  accentColor?: string;
  className?: string;
}

export function StatCard({ label, value, sub, icon, accentColor = "#3b82f6", className }: StatCardProps) {
  return (
    <div
      className={cn(
        "theme-panel theme-panel-hover theme-glow group relative overflow-hidden rounded-2xl p-5",
        className
      )}
    >
      {/* Left accent bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-0.5 rounded-l-2xl"
        style={{ background: accentColor, boxShadow: `0 0 12px ${accentColor}40` }}
      />
      {/* Subtle glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-[0.08] blur-3xl transition-opacity duration-300 group-hover:opacity-[0.14]"
        style={{ background: accentColor }}
      />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-2">
          <div className="text-[11px] text-white/40 font-semibold uppercase tracking-[0.18em]">{label}</div>
          {icon && <div className="text-white/25">{icon}</div>}
        </div>
        <div
          className="text-3xl font-bold font-mono tracking-tighter mb-1"
          style={{ color: accentColor }}
        >
          {value}
        </div>
        {sub && <div className="text-xs text-white/35">{sub}</div>}
      </div>
    </div>
  );
}

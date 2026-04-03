import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon?: React.ReactNode;
  accentColor?: string;
  className?: string;
}

export function StatCard({ label, value, sub, icon, accentColor = "#7c3aed", className }: StatCardProps) {
  return (
    <div
      className={cn(
        "relative bg-[#0e0e1a] border border-white/[0.07] rounded-2xl p-5 overflow-hidden transition-all duration-300 hover:border-white/[0.12]",
        className
      )}
    >
      {/* Left accent bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-0.5 rounded-l-2xl"
        style={{ background: accentColor, boxShadow: `0 0 12px ${accentColor}40` }}
      />
      {/* Subtle glow */}
      <div
        className="absolute -top-10 -right-10 w-24 h-24 rounded-full opacity-[0.06] blur-2xl pointer-events-none"
        style={{ background: accentColor }}
      />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-2">
          <div className="text-[11px] text-white/35 font-semibold uppercase tracking-[0.18em]">{label}</div>
          {icon && <div className="text-white/20">{icon}</div>}
        </div>
        <div
          className="text-3xl font-bold font-mono tracking-tighter mb-1"
          style={{ color: accentColor }}
        >
          {value}
        </div>
        {sub && <div className="text-xs text-white/30">{sub}</div>}
      </div>
    </div>
  );
}

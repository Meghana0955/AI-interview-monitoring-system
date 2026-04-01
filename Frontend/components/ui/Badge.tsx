import { cn, RiskLevel } from "@/lib/utils";

type BadgeVariant = "green" | "amber" | "red" | "blue" | "cyan" | "purple";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const styles: Record<BadgeVariant, string> = {
  green:  "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  amber:  "bg-amber-500/15   text-amber-400   border-amber-500/30",
  red:    "bg-red-500/15     text-red-400     border-red-500/30",
  blue:   "bg-blue-500/15    text-blue-400    border-blue-500/30",
  cyan:   "bg-cyan-500/15    text-cyan-400    border-cyan-500/30",
  purple: "bg-purple-500/15  text-purple-400  border-purple-500/30",
};

export function Badge({ variant = "blue", children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide uppercase border",
        styles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

export function RiskBadge({ level }: { level: RiskLevel }) {
  const map: Record<RiskLevel, { variant: BadgeVariant; label: string; icon: string }> = {
    low:    { variant: "green", label: "Low Risk",    icon: "✓" },
    medium: { variant: "amber", label: "Medium Risk", icon: "⚠" },
    high:   { variant: "red",   label: "High Risk",   icon: "✗" },
  };
  const { variant, label, icon } = map[level];
  return <Badge variant={variant}>{icon} {label}</Badge>;
}

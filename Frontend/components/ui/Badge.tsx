import { cn, RiskLevel } from "@/lib/utils";
import { CheckCircle, AlertTriangle, XCircle } from "lucide-react";

type BadgeVariant = "green" | "amber" | "red" | "blue" | "cyan" | "purple";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const styles: Record<BadgeVariant, string> = {
  green:  "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  amber:  "bg-amber-500/10   text-amber-400   border-amber-500/20",
  red:    "bg-red-500/10     text-red-400     border-red-500/20",
  blue:   "bg-blue-500/10    text-blue-400    border-blue-500/20",
  cyan:   "bg-cyan-500/10    text-cyan-400    border-cyan-500/20",
  purple: "bg-[#7c3aed]/10   text-[#a78bfa]   border-[#7c3aed]/20",
};

export function Badge({ variant = "blue", children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide uppercase border",
        styles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

export function RiskBadge({ level }: { level: RiskLevel }) {
  const map: Record<RiskLevel, { variant: BadgeVariant; label: string; icon: React.ReactNode }> = {
    low:    { variant: "green", label: "Low Risk",    icon: <CheckCircle className="w-3 h-3" /> },
    medium: { variant: "amber", label: "Medium Risk", icon: <AlertTriangle className="w-3 h-3" /> },
    high:   { variant: "red",   label: "High Risk",   icon: <XCircle className="w-3 h-3" /> },
  };
  const { variant, label, icon } = map[level];
  return <Badge variant={variant}>{icon} {label}</Badge>;
}

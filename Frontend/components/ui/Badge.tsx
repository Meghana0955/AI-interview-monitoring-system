import { cn, RiskLevel } from "@/lib/utils";
import { CheckCircle, AlertTriangle, XCircle } from "lucide-react";

type BadgeVariant = "green" | "amber" | "red" | "blue" | "cyan" | "purple";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const styles: Record<BadgeVariant, string> = {
  green:  "bg-[#10b981]/10 text-[#10b981] border-[#10b981]/25",
  amber:  "bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/25",
  red:    "bg-[#ef4444]/10 text-[#ef4444] border-[#ef4444]/25",
  blue:   "bg-[#3b82f6]/10 text-[#3b82f6] border-[#3b82f6]/25",
  cyan:   "bg-[#06b6d4]/10 text-[#06b6d4] border-[#06b6d4]/25",
  purple: "bg-[#8b5cf6]/10 text-[#8b5cf6] border-[#8b5cf6]/25",
};

export function Badge({ variant = "blue", children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide backdrop-blur-md",
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

import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "outline" | "ghost" | "danger";
type ButtonSize    = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
}

const variants: Record<ButtonVariant, string> = {
  primary: "bg-gradient-to-r from-[#3b82f6] via-[#06b6d4] to-[#3b82f6] text-white shadow-[0_8px_28px_rgba(59,130,246,0.32)] hover:shadow-[0_12px_36px_rgba(6,182,212,0.48)] hover:-translate-y-0.5",
  outline: "bg-white/[0.02] text-[#94a3b8] border border-[#1e2d47] hover:border-[#243655] hover:text-[#e2e8f0] hover:bg-[#3b82f6]/5",
  ghost:   "bg-transparent text-[#64748b] hover:text-[#e2e8f0] hover:bg-white/[0.04]",
  danger:  "bg-[#ef4444]/10 text-[#ef4444] border border-[#ef4444]/20 hover:bg-[#ef4444]/20 hover:border-[#ef4444]/40",
};

const sizes: Record<ButtonSize, string> = {
  sm: "px-3.5 py-1.5 text-xs",
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3 text-sm",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl border border-transparent px-4 py-2 font-semibold tracking-wide transition-all duration-300 active:scale-[.97] disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

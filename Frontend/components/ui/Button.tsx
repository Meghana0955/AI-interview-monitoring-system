import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "outline" | "ghost" | "danger";
type ButtonSize    = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
}

const variants: Record<ButtonVariant, string> = {
  primary: "bg-gradient-to-r from-blue-700 to-blue-500 text-white hover:shadow-[0_8px_24px_rgba(59,130,246,.35)] hover:-translate-y-px",
  outline: "bg-transparent text-slate-200 border border-[#243655] hover:border-blue-500/60 hover:text-blue-300 hover:bg-blue-500/5",
  ghost:   "bg-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5",
  danger:  "bg-red-500/15 text-red-400 border border-red-500/30 hover:bg-red-500/25",
};

const sizes: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs",
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
        "inline-flex items-center justify-center gap-2 rounded-lg font-semibold tracking-wide transition-all duration-200 active:scale-[.97] disabled:opacity-50 disabled:cursor-not-allowed",
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

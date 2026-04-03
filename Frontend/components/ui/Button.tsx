import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "outline" | "ghost" | "danger";
type ButtonSize    = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
}

const variants: Record<ButtonVariant, string> = {
  primary: "bg-[#7c3aed] text-white hover:bg-[#6d28d9] shadow-[0_4px_24px_rgba(124,58,237,0.4)] hover:shadow-[0_6px_32px_rgba(124,58,237,0.55)] hover:-translate-y-0.5",
  outline: "bg-transparent text-white/60 border border-white/[0.07] hover:border-[#7c3aed]/40 hover:text-[#a78bfa] hover:bg-[#7c3aed]/5",
  ghost:   "bg-transparent text-white/40 hover:text-white hover:bg-white/5",
  danger:  "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 hover:border-red-500/40",
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
        "inline-flex items-center justify-center gap-2 rounded-xl font-semibold tracking-wide transition-all duration-200 active:scale-[.97] disabled:opacity-50 disabled:cursor-not-allowed",
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

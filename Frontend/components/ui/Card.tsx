import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  glass?: boolean;
  hover?: boolean;
}

export function Card({ children, className, glass, hover, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "theme-panel theme-panel-hover theme-glow relative overflow-hidden rounded-2xl p-5",
        glass ? "bg-[#101828]/80" : "bg-[#101828]",
        hover && "hover:border-[#243655] hover:-translate-y-0.5",
        className
      )}
      {...props}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  right,
  className,
}: {
  title: string;
  right?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-4 flex items-center justify-between gap-3", className)}>
      <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#64748b]">{title}</h3>
      {right && <div>{right}</div>}
    </div>
  );
}

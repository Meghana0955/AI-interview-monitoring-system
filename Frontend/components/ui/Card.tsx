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
        "rounded-2xl border border-white/[0.07] p-5 transition-all duration-300",
        glass ? "bg-[#0e0e1a]/85 backdrop-blur-md" : "bg-[#0e0e1a]",
        hover && "hover:border-[#7c3aed]/30 hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(124,58,237,0.08)]",
        className
      )}
      {...props}
    >
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
    <div className={cn("flex items-center justify-between mb-4", className)}>
      <h3 className="text-[11px] font-semibold text-white/40 uppercase tracking-[0.18em]">{title}</h3>
      {right && <div>{right}</div>}
    </div>
  );
}

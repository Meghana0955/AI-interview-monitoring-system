import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  glass?: boolean;
}

export function Card({ children, className, glass, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-[#1e2d47] p-5",
        glass ? "bg-[#0f1724]/85 backdrop-blur-md" : "bg-[#0f1724]",
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
      <h3 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{title}</h3>
      {right && <div>{right}</div>}
    </div>
  );
}

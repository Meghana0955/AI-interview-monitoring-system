import { cn } from "@/lib/utils";

type AlertType = "ok" | "warn" | "err";

interface AlertProps {
  type?: AlertType;
  children: React.ReactNode;
  className?: string;
}

const styles: Record<AlertType, string> = {
  ok:   "bg-emerald-500/8 border-emerald-500/30 text-emerald-300",
  warn: "bg-amber-500/8   border-amber-500/30   text-amber-300",
  err:  "bg-red-500/8     border-red-500/30     text-red-300",
};

const icons: Record<AlertType, string> = {
  ok: "✓", warn: "⚠", err: "✗",
};

export function Alert({ type = "ok", children, className }: AlertProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-2 px-3 py-2.5 rounded-lg border text-xs font-medium",
        styles[type],
        className
      )}
    >
      <span className="flex-shrink-0 mt-0.5">{icons[type]}</span>
      <span>{children}</span>
    </div>
  );
}

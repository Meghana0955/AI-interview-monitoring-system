import { cn } from "@/lib/utils";
import { CheckCircle, AlertTriangle, XOctagon } from "lucide-react";

type AlertType = "ok" | "warn" | "err";

interface AlertProps {
  type?: AlertType;
  children: React.ReactNode;
  className?: string;
}

const alertStyles: Record<AlertType, string> = {
  ok:   "bg-emerald-500/[0.06] border-emerald-500/20 text-emerald-300",
  warn: "bg-amber-500/[0.06]   border-amber-500/20   text-amber-300",
  err:  "bg-red-500/[0.06]     border-red-500/20     text-red-300",
};

const icons: Record<AlertType, React.ReactNode> = {
  ok:   <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" />,
  warn: <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />,
  err:  <XOctagon className="w-3.5 h-3.5 flex-shrink-0" />,
};

export function Alert({ type = "ok", children, className }: AlertProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-2.5 px-3.5 py-2.5 rounded-xl border text-xs font-medium",
        alertStyles[type],
        className
      )}
    >
      <span className="mt-0.5">{icons[type]}</span>
      <span>{children}</span>
    </div>
  );
}

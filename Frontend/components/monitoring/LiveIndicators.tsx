"use client";
import { cn } from "@/lib/utils";

interface Indicator {
  label: string;
  value: string;
  status: "ok" | "warn" | "err";
}

const dotColors = { ok: "bg-emerald-400", warn: "bg-amber-400", err: "bg-red-400" };
const textColors = { ok: "text-emerald-300", warn: "text-amber-300", err: "text-red-300" };

export function LiveIndicators({ indicators }: { indicators: Indicator[] }) {
  return (
    <div className="flex gap-2.5 flex-wrap mt-3">
      {indicators.map((ind) => (
        <div
          key={ind.label}
          className="flex-1 min-w-[80px] bg-[#131e2e] border border-[#1e2d47] rounded-lg px-3 py-2.5"
        >
          <div className="text-[10px] text-slate-500 mb-1 font-medium uppercase tracking-wide">{ind.label}</div>
          <div className={cn("text-xs font-semibold flex items-center gap-1.5", textColors[ind.status])}>
            <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", dotColors[ind.status])} />
            {ind.value}
          </div>
        </div>
      ))}
    </div>
  );
}

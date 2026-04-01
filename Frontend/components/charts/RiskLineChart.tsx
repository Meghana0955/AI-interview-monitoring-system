"use client";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from "recharts";

interface Props { data: number[]; }

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-[#131e2e] border border-[#243655] rounded-lg px-3 py-2 text-xs">
        <p className="text-slate-400">{label}</p>
        <p className="text-amber-400 font-bold font-mono">{Math.round(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

export function RiskLineChart({ data }: Props) {
  const chartData = data.map((v, i) => ({ t: `${i * 2}m`, risk: v }));
  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e2d47" />
        <XAxis dataKey="t" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} />
        <YAxis domain={[0, 100]} tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <ReferenceLine y={70} stroke="#ef444440" strokeDasharray="4 4" />
        <Line
          type="monotone" dataKey="risk" stroke="#f59e0b" strokeWidth={2}
          dot={{ fill: "#f59e0b", r: 2 }} activeDot={{ r: 4 }}
          fill="none"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

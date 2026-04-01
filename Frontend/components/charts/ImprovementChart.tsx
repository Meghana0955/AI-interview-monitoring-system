"use client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const DATA = [
  { session: "Session 1", risk: 78 },
  { session: "Session 2", risk: 65 },
  { session: "Session 3", risk: 61 },
  { session: "Today",     risk: 54 },
];
const COLORS = ["#ef4444bb", "#f59e0bbb", "#f59e0b88", "#10b981bb"];

export function ImprovementChart() {
  return (
    <ResponsiveContainer width="100%" height={150}>
      <BarChart data={DATA} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e2d47" />
        <XAxis dataKey="session" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} />
        <YAxis domain={[0, 100]} tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{ background: "#131e2e", border: "1px solid #243655", borderRadius: "8px", fontSize: "12px" }}
          labelStyle={{ color: "#94a3b8" }}
          itemStyle={{ color: "#e2e8f0" }}
        />
        <Bar dataKey="risk" radius={[4, 4, 0, 0]}>
          {DATA.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

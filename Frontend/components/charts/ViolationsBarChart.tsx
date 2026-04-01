"use client";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from "recharts";

interface Props { eye: number; face: number; voice: number; }

const COLORS = ["#06b6d4", "#3b82f6", "#8b5cf6", "#f59e0b"];

export function ViolationsBarChart({ eye, face, voice }: Props) {
  const data = [
    { name: "Eye",      value: eye },
    { name: "Face",     value: face },
    { name: "Voice",    value: voice },
    { name: "Combined", value: eye + face + voice },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload?.length) {
      return (
        <div className="bg-[#131e2e] border border-[#243655] rounded-lg px-3 py-2 text-xs">
          <p className="text-slate-400">{label}</p>
          <p className="font-bold font-mono" style={{ color: payload[0].fill }}>{payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e2d47" />
        <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
          {data.map((_, i) => <Cell key={i} fill={COLORS[i]} fillOpacity={0.75} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

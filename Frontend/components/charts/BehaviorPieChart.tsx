"use client";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const DATA = [
  { name: "Focused",    value: 68, color: "#10b981" },
  { name: "Eye Dev.",   value: 14, color: "#06b6d4" },
  { name: "Voice",      value: 11, color: "#8b5cf6" },
  { name: "Face Abs.",  value:  7, color: "#ef4444" },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-[#131e2e] border border-[#243655] rounded-lg px-3 py-2 text-xs">
        <p style={{ color: payload[0].payload.color }} className="font-bold">{payload[0].name}</p>
        <p className="text-slate-300 font-mono">{payload[0].value}%</p>
      </div>
    );
  }
  return null;
};

export function BehaviorPieChart() {
  return (
    <ResponsiveContainer width="100%" height={180}>
      <PieChart>
        <Pie data={DATA} cx="50%" cy="50%" innerRadius={45} outerRadius={72} dataKey="value" paddingAngle={2}>
          {DATA.map((entry, i) => (
            <Cell key={i} fill={entry.color} fillOpacity={0.8} stroke="none" />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          iconType="circle"
          iconSize={8}
          formatter={(value) => <span style={{ color: "#94a3b8", fontSize: "11px" }}>{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

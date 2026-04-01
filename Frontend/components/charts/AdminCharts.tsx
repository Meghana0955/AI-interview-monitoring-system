"use client";
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";

const PIE_DATA = [
  { name: "Low Risk",  value: 31, color: "#10b981" },
  { name: "Medium",    value: 11, color: "#f59e0b" },
  { name: "High Risk", value:  5, color: "#ef4444" },
];

const BAR_DATA = [
  { time: "9am",  sessions: 4  },
  { time: "10am", sessions: 8  },
  { time: "11am", sessions: 12 },
  { time: "12pm", sessions: 7  },
  { time: "1pm",  sessions: 9  },
  { time: "2pm",  sessions: 11 },
];

export function AdminPieChart() {
  return (
    <ResponsiveContainer width="100%" height={180}>
      <PieChart>
        <Pie data={PIE_DATA} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" paddingAngle={3}>
          {PIE_DATA.map((e, i) => <Cell key={i} fill={e.color} fillOpacity={0.8} stroke="none" />)}
        </Pie>
        <Tooltip
          contentStyle={{ background: "#131e2e", border: "1px solid #243655", borderRadius: "8px", fontSize: "12px" }}
          labelStyle={{ color: "#94a3b8" }}
        />
        <Legend
          iconType="circle" iconSize={8}
          formatter={(v) => <span style={{ color: "#94a3b8", fontSize: "11px" }}>{v}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function AdminBarChart() {
  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={BAR_DATA} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e2d47" />
        <XAxis dataKey="time" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{ background: "#131e2e", border: "1px solid #243655", borderRadius: "8px", fontSize: "12px" }}
          labelStyle={{ color: "#94a3b8" }}
          itemStyle={{ color: "#e2e8f0" }}
        />
        <Bar dataKey="sessions" fill="#3b82f6" fillOpacity={0.7} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

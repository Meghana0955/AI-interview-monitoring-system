"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Card, CardHeader } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { Badge, RiskBadge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { AdminPieChart, AdminBarChart } from "@/components/charts/AdminCharts";
import { MOCK_CANDIDATES, getRiskColor } from "@/lib/utils";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import { Download, Search, Users, ShieldCheck, AlertTriangle, XCircle } from "lucide-react";

const ALERT_BREAKDOWN = [
  { label: "Eye Deviation",    pct: 42, color: "#3b82f6" },
  { label: "Background Noise", pct: 31, color: "#8b5cf6" },
  { label: "Face Absence",     pct: 18, color: "#06b6d4" },
  { label: "Multiple Persons", pct:  9, color: "#ef4444" },
];

export default function AdminPage() {
  const [search, setSearch] = useState("");
  const filtered = MOCK_CANDIDATES.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.dept.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ProtectedRoute>
    <div className="min-h-screen bg-[#080c14] pt-24">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">

        <PageHeader
          title="Admin Control Panel"
          subtitle="Evaluator view — full session oversight"
          badge={<Badge variant="purple">12 Active Sessions</Badge>}
          actions={
            <Button variant="outline" size="sm" onClick={() => toast.success("All reports exported")}>
              <Download className="w-3.5 h-3.5" /> Export All
            </Button>
          }
        />

        {/* Stats */}
        <motion.div
          initial={{ opacity:0,y:12 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6"
        >
          <StatCard label="Total Candidates" value={47} sub="This session" icon={<Users className="w-4 h-4" />} accentColor="#3b82f6" />
          <StatCard label="Low Risk" value={31} sub="65.9%" icon={<ShieldCheck className="w-4 h-4" />} accentColor="#10b981" />
          <StatCard label="Medium Risk" value={11} sub="23.4%" icon={<AlertTriangle className="w-4 h-4" />} accentColor="#f59e0b" />
          <StatCard label="High Risk" value={5} sub="10.6%" icon={<XCircle className="w-4 h-4" />} accentColor="#ef4444" />
        </motion.div>

        {/* Candidates table */}
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.15 }} className="mb-4">
          <Card>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <h3 className="text-[11px] font-semibold text-[#64748b] uppercase tracking-[0.18em]">
                Candidate Performance Overview
              </h3>
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#64748b]" />
                <input
                  type="text"
                  placeholder="Search candidates..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 pr-3 py-1.5 bg-[#0d1524] border border-[#1e2d47] rounded-xl text-xs text-white outline-none focus:border-[#3b82f6]/60 focus:ring-2 focus:ring-[#3b82f6]/15 transition-all duration-200 w-48"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#1e2d47]">
                    {["Candidate","Dept","Eye","Face","Voice","Risk Score","Level","Action"].map(h => (
                      <th key={h} className="text-left text-[10px] font-semibold text-[#64748b] uppercase tracking-[0.15em] px-3 py-2.5 whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c) => {
                    const rc = getRiskColor(c.level);
                    return (
                      <tr
                        key={c.id}
                        className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                      >
                        <td className="px-3 py-3 font-semibold text-white/70 whitespace-nowrap">{c.name}</td>
                        <td className="px-3 py-3">
                          <Badge variant="purple" className="text-[10px] py-0.5">{c.dept}</Badge>
                        </td>
                        <td className="px-3 py-3 font-mono text-[#06b6d4] text-sm">{c.eye}</td>
                        <td className="px-3 py-3 font-mono text-[#8b5cf6] text-sm">{c.face}</td>
                        <td className="px-3 py-3 font-mono text-[#3b82f6] text-sm">{c.voice}</td>
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all"
                                style={{ width: `${c.risk}%`, background: rc.hex }}
                              />
                            </div>
                            <span className="font-mono text-xs text-[#94a3b8]">{c.risk}</span>
                          </div>
                        </td>
                        <td className="px-3 py-3">
                          <RiskBadge level={c.level} />
                        </td>
                        <td className="px-3 py-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toast.success(`Viewing ${c.name}'s report`)}
                          >
                            View
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div className="text-center py-10 text-[#64748b] text-sm">No candidates match your search.</div>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Bottom charts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.2 }}>
            <Card>
              <CardHeader title="Risk Distribution" />
              <AdminPieChart />
            </Card>
          </motion.div>
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.25 }}>
            <Card>
              <CardHeader title="Hourly Session Activity" />
              <AdminBarChart />
            </Card>
          </motion.div>
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.3 }}>
            <Card>
              <CardHeader title="Top Alert Triggers" />
              <div className="space-y-3 mt-1">
                {ALERT_BREAKDOWN.map((a) => (
                  <ProgressBar
                    key={a.label}
                    value={a.pct}
                    color={a.color}
                    label={a.label}
                    showLabel
                  />
                ))}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
    </ProtectedRoute>
  );
}

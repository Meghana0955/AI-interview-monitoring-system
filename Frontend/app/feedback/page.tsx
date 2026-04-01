"use client";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Card, CardHeader } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { RiskLineChart } from "@/components/charts/RiskLineChart";
import { ImprovementChart } from "@/components/charts/ImprovementChart";
import { Button } from "@/components/ui/Button";
import { MOCK_RISK_HISTORY } from "@/lib/utils";

const RECOMMENDATIONS = [
  {
    icon: "👁",
    category: "Eye Contact",
    color: "#06b6d4",
    bg: "rgba(6,182,212,.06)",
    border: "rgba(6,182,212,.2)",
    msg: "Maintain consistent gaze toward the camera. Your eye deviated 7 times — practice focusing on a fixed center point during responses.",
    compliance: 62,
  },
  {
    icon: "🎙",
    category: "Audio Environment",
    color: "#8b5cf6",
    bg: "rgba(139,92,246,.06)",
    border: "rgba(139,92,246,.2)",
    msg: "Reduce background noise by choosing a quieter environment or using noise-cancellation headphones. 5 audio violations were flagged.",
    compliance: 78,
  },
  {
    icon: "✓",
    category: "Identity Verification",
    color: "#10b981",
    bg: "rgba(16,185,129,.06)",
    border: "rgba(16,185,129,.2)",
    msg: "Excellent — single-person presence was maintained throughout the session. No identity violations detected.",
    compliance: 95,
  },
];

export default function FeedbackPage() {
  return (
    <div className="min-h-screen bg-[#080c14] pt-14">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <motion.div initial={{ opacity:0,y:12 }} animate={{ opacity:1,y:0 }}>
            <h2 className="text-xl font-bold tracking-tight">Session Performance Report</h2>
            <div className="text-[11px] text-slate-500 font-mono mt-1">Generated · Session #2847</div>
          </motion.div>
          <Button variant="outline" size="sm" onClick={() => toast.success("Report exported as PDF")}>
            ⬇ Export PDF
          </Button>
        </div>

        {/* Evaluation banner */}
        <motion.div
          initial={{ opacity:0,y:12 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.1 }}
          className="bg-amber-500/6 border border-amber-500/25 rounded-xl p-6 mb-6 flex flex-wrap gap-6 items-center"
        >
          <div>
            <div className="text-6xl font-bold font-mono tracking-tighter text-amber-400">54</div>
            <div className="text-xs text-slate-400 mt-1">Average Risk Score</div>
          </div>
          <div className="flex-1 min-w-[200px]">
            <div className="inline-block px-5 py-2 rounded-lg bg-amber-500/15 text-amber-400 border border-amber-500/30 text-sm font-bold uppercase tracking-wide mb-3">
              ⚠ Needs Improvement
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              The candidate showed moderate behavioral irregularities including repeated gaze deviations and
              background audio interference. Identity was consistently verified. Focus improvement recommended.
            </p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold font-mono text-emerald-400">82%</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Integrity Score</div>
          </div>
        </motion.div>

        {/* Summary stats */}
        <motion.div
          initial={{ opacity:0,y:12 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.15 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6"
        >
          <StatCard label="Eye Issues"     value={7}    sub="3 critical, 4 minor"  accentColor="#06b6d4" />
          <StatCard label="Face Issues"    value={3}    sub="1 absence event"      accentColor="#3b82f6" />
          <StatCard label="Voice Issues"   value={5}    sub="Background noise"     accentColor="#8b5cf6" />
          <StatCard label="Clean Periods"  value="68%"  sub="12 min no violations" accentColor="#10b981" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Recommendations */}
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.2 }}>
            <Card>
              <CardHeader title="AI Smart Recommendations" />
              <div className="space-y-4">
                {RECOMMENDATIONS.map((r, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-lg border"
                    style={{ background: r.bg, borderColor: r.border }}
                  >
                    <div className="text-xs font-semibold mb-2" style={{ color: r.color }}>
                      {r.icon} {r.category}
                    </div>
                    <p className="text-sm text-slate-200 leading-relaxed mb-3">{r.msg}</p>
                    <ProgressBar
                      value={r.compliance}
                      color={r.color}
                      showLabel
                      label="Compliance"
                    />
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Charts */}
          <div className="flex flex-col gap-4">
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.25 }}>
              <Card>
                <CardHeader title="Risk Trend Analysis" />
                <RiskLineChart data={MOCK_RISK_HISTORY} />
              </Card>
            </motion.div>
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.3 }}>
              <Card>
                <CardHeader title="Improvement Across Sessions" />
                <ImprovementChart />
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Final evaluation */}
        <motion.div
          initial={{ opacity:0,y:12 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.35 }}
          className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3"
        >
          {[
            { icon:"👁", label:"Eye Contact",  score:62, color:"#06b6d4", verdict:"Fair" },
            { icon:"🎙", label:"Voice Control", score:78, color:"#8b5cf6", verdict:"Good" },
            { icon:"🧑", label:"Face Presence", score:95, color:"#10b981", verdict:"Excellent" },
          ].map((item, i) => (
            <Card key={i} className="text-center">
              <div className="text-2xl mb-2">{item.icon}</div>
              <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">{item.label}</div>
              <div className="text-2xl font-bold font-mono mb-1" style={{ color: item.color }}>{item.score}%</div>
              <div className="text-xs font-semibold" style={{ color: item.color }}>{item.verdict}</div>
              <ProgressBar value={item.score} color={item.color} className="mt-3" />
            </Card>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

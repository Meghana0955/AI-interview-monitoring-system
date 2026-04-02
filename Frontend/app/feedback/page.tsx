"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Card, CardHeader } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { RiskLineChart } from "@/components/charts/RiskLineChart";
import { ImprovementChart } from "@/components/charts/ImprovementChart";
import { Button } from "@/components/ui/Button";
import { MOCK_RISK_HISTORY } from "@/lib/utils";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { getFeedback, getSessionSummary, checkHealth, getUserSessions, SessionRecord } from "@/lib/api";

const FALLBACK_RECOMMENDATIONS = [
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

const CATEGORY_CONFIG: Record<string, { icon: string; color: string; bg: string; border: string }> = {
  "Eye Contact":       { icon: "👁", color: "#06b6d4", bg: "rgba(6,182,212,.06)",   border: "rgba(6,182,212,.2)" },
  "Audio Environment": { icon: "🎙", color: "#8b5cf6", bg: "rgba(139,92,246,.06)", border: "rgba(139,92,246,.2)" },
  "Face Presence":     { icon: "✓",  color: "#10b981", bg: "rgba(16,185,129,.06)", border: "rgba(16,185,129,.2)" },
  "Focus & Discipline":{ icon: "🎯", color: "#f59e0b", bg: "rgba(245,158,11,.06)", border: "rgba(245,158,11,.2)" },
  "General":           { icon: "📋", color: "#3b82f6", bg: "rgba(59,130,246,.06)", border: "rgba(59,130,246,.2)" },
  "No Data":           { icon: "⚠",  color: "#ef4444", bg: "rgba(239,68,68,.06)",  border: "rgba(239,68,68,.2)" },
};

export default function FeedbackPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [backendConnected, setBackendConnected] = useState(false);
  const [recommendations, setRecommendations] = useState(FALLBACK_RECOMMENDATIONS);
  const [avgRisk, setAvgRisk] = useState(54);
  const [eyeIssues, setEyeIssues] = useState(7);
  const [faceIssues, setFaceIssues] = useState(3);
  const [voiceIssues, setVoiceIssues] = useState(5);
  const [riskHistory, setRiskHistory] = useState<number[]>(MOCK_RISK_HISTORY);
  const [evaluation, setEvaluation] = useState<string>("needs_improvement");
  const [integrityScore, setIntegrityScore] = useState(82);
  const [userSessions, setUserSessions] = useState<SessionRecord[]>([]);

  // Fetch real data on mount
  useEffect(() => {
    async function load() {
      const health = await checkHealth();
      setBackendConnected(!!health);

      if (health) {
        // Fetch real feedback
        const [feedback, summary] = await Promise.all([
          getFeedback(),
          getSessionSummary(),
        ]);

        // Process feedback suggestions
        if (feedback.suggestions && feedback.suggestions.length > 0 && feedback.suggestions[0].category !== "No Data") {
          const recs = feedback.suggestions.map((s) => {
            const cfg = CATEGORY_CONFIG[s.category] || CATEGORY_CONFIG["General"];
            return {
              icon: cfg.icon,
              category: s.category,
              color: cfg.color,
              bg: cfg.bg,
              border: cfg.border,
              msg: s.message,
              compliance: s.compliance,
            };
          });
          setRecommendations(recs);
          setAvgRisk(Math.round(feedback.score * 10));
        }

        if (summary.risk_history && summary.risk_history.length > 0) {
          setRiskHistory(summary.risk_history.map((s) => Math.min(100, Math.round(s * 10))));
        }

        if (feedback.eye_issues !== undefined) setEyeIssues(feedback.eye_issues);
        if (feedback.face_issues !== undefined) setFaceIssues(feedback.face_issues);
        if (feedback.voice_issues !== undefined) setVoiceIssues(feedback.voice_issues);

        if (summary.evaluation) setEvaluation(summary.evaluation);

        // Calculate integrity score
        const total = (summary.eye_violations || 0) + (summary.face_violations || 0) + (summary.voice_violations || 0);
        setIntegrityScore(Math.max(20, 100 - total * 2));

        if (user?.id) {
          const history = await getUserSessions(user.id);
          if (history?.sessions) {
            setUserSessions(history.sessions);
          }
        }
      }

      setLoading(false);
    }
    load();
  }, [user?.id]);

  const handleExportPdf = () => {
    const latest = userSessions[0];
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("AISMS Session Report", 14, 18);

    doc.setFontSize(11);
    doc.text(`Name: ${user?.name || "N/A"}`, 14, 28);
    doc.text(`College: ${user?.college || "N/A"}`, 14, 35);
    doc.text(`Session ID: ${latest?.id || "N/A"}`, 14, 42);
    doc.text(`Session Date: ${latest ? new Date(latest.session_date).toLocaleString() : "N/A"}`, 14, 49);

    doc.text(`Risk Score: ${avgRisk}`, 14, 60);
    doc.text(`Evaluation: ${evalLabel.replace(/[✅🚨⚠]/g, "").trim()}`, 14, 67);
    doc.text(`Integrity: ${integrityScore}%`, 14, 74);

    doc.text(`Eye Violations: ${eyeIssues}`, 14, 85);
    doc.text(`Face Violations: ${faceIssues}`, 14, 92);
    doc.text(`Voice Violations: ${voiceIssues}`, 14, 99);

    autoTable(doc, {
      startY: 108,
      head: [["Recommendations"]],
      body: recommendations.map((r) => [`${r.category}: ${r.msg}`]),
      styles: { fontSize: 10 },
    });

    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 8,
      head: [["Session", "Date", "Score", "Evaluation"]],
      body: userSessions.map((s, idx) => [
        `Session ${userSessions.length - idx}`,
        new Date(s.session_date).toLocaleDateString(),
        Math.min(100, Math.round(s.avg_risk * 10)).toString(),
        s.evaluation,
      ]),
      styles: { fontSize: 10 },
    });

    const filename = `aisms-report-${latest?.id || Date.now()}.pdf`;
    doc.save(filename);
    toast.success("PDF exported successfully");
  };

  const evalLabel = evaluation === "good" ? "✅ Good Performance" : evaluation === "high_risk" ? "🚨 High Risk" : "⚠ Needs Improvement";
  const evalColor = evaluation === "good" ? "emerald" : evaluation === "high_risk" ? "red" : "amber";

  return (
    <ProtectedRoute>
    <div className="min-h-screen bg-[#080c14] pt-16">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <motion.div initial={{ opacity:0,y:12 }} animate={{ opacity:1,y:0 }}>
            <h2 className="text-xl font-bold tracking-tight">Session Performance Report</h2>
            <div className="text-[11px] text-slate-500 font-mono mt-1">
              {backendConnected ? "AI-Generated from real session data" : "Generated · Session #2847"}
            </div>
          </motion.div>
          <Button variant="outline" size="sm" onClick={handleExportPdf}>
            ⬇ Export PDF
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-12 h-12">
                <div className="absolute inset-0 rounded-full border-2 border-[#1e2d47]" />
                <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-cyan-400 animate-spin" />
              </div>
              <div className="text-sm text-slate-400">Loading AI feedback...</div>
            </div>
          </div>
        ) : (
          <>
            {/* Evaluation banner */}
            <motion.div
              initial={{ opacity:0,y:12 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.1 }}
              className={`bg-${evalColor}-500/6 border border-${evalColor}-500/25 rounded-xl p-6 mb-6 flex flex-wrap gap-6 items-center`}
              style={{
                background: `rgba(${evalColor === "emerald" ? "16,185,129" : evalColor === "red" ? "239,68,68" : "245,158,11"}, 0.06)`,
                borderColor: `rgba(${evalColor === "emerald" ? "16,185,129" : evalColor === "red" ? "239,68,68" : "245,158,11"}, 0.25)`,
              }}
            >
              <div>
                <div
                  className="text-6xl font-bold font-mono tracking-tighter"
                  style={{ color: evalColor === "emerald" ? "#10b981" : evalColor === "red" ? "#ef4444" : "#f59e0b" }}
                >
                  {avgRisk}
                </div>
                <div className="text-xs text-slate-400 mt-1">Average Risk Score</div>
              </div>
              <div className="flex-1 min-w-[200px]">
                <div
                  className="inline-block px-5 py-2 rounded-lg text-sm font-bold uppercase tracking-wide mb-3"
                  style={{
                    background: `rgba(${evalColor === "emerald" ? "16,185,129" : evalColor === "red" ? "239,68,68" : "245,158,11"}, 0.15)`,
                    color: evalColor === "emerald" ? "#10b981" : evalColor === "red" ? "#ef4444" : "#f59e0b",
                    border: `1px solid rgba(${evalColor === "emerald" ? "16,185,129" : evalColor === "red" ? "239,68,68" : "245,158,11"}, 0.3)`,
                  }}
                >
                  {evalLabel}
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {evaluation === "good"
                    ? "Excellent session! The candidate maintained good eye contact, stayed visible, and had minimal audio disruptions."
                    : evaluation === "high_risk"
                    ? "The session showed significant behavioral irregularities. Multiple violations detected across eye tracking, face detection, and audio modules."
                    : "The candidate showed moderate behavioral irregularities including repeated gaze deviations and background audio interference. Focus improvement recommended."}
                </p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold font-mono text-emerald-400">{integrityScore}%</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Integrity Score</div>
              </div>
            </motion.div>

            {/* Summary stats */}
            <motion.div
              initial={{ opacity:0,y:12 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.15 }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6"
            >
              <StatCard label="Eye Issues"     value={eyeIssues}   sub={`${Math.max(0, eyeIssues - 2)} critical`}  accentColor="#06b6d4" />
              <StatCard label="Face Issues"    value={faceIssues}   sub="Absence events"      accentColor="#3b82f6" />
              <StatCard label="Voice Issues"   value={voiceIssues}  sub="Background noise"     accentColor="#8b5cf6" />
              <StatCard label="Clean Periods"  value={`${Math.max(30, 100 - (eyeIssues + faceIssues + voiceIssues) * 3)}%`}  sub="No violations" accentColor="#10b981" />
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Recommendations */}
              <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.2 }}>
                <Card>
                  <CardHeader title="AI Smart Recommendations" />
                  <div className="space-y-4">
                    {recommendations.map((r, i) => (
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
                    <RiskLineChart data={riskHistory} />
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
                { icon:"👁", label:"Eye Contact",  score: Math.max(20, 100 - eyeIssues * 5), color:"#06b6d4", verdict: eyeIssues < 3 ? "Good" : eyeIssues < 8 ? "Fair" : "Poor" },
                { icon:"🎙", label:"Voice Control", score: Math.max(20, 100 - voiceIssues * 5), color:"#8b5cf6", verdict: voiceIssues < 3 ? "Excellent" : voiceIssues < 8 ? "Good" : "Fair" },
                { icon:"🧑", label:"Face Presence", score: Math.max(20, 100 - faceIssues * 8), color:"#10b981", verdict: faceIssues < 2 ? "Excellent" : faceIssues < 5 ? "Good" : "Fair" },
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
          </>
        )}
      </div>
    </div>
    </ProtectedRoute>
  );
}

"use client";
import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardHeader } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { Button } from "@/components/ui/Button";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { getUserSessions, SessionRecord } from "@/lib/api";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  BarChart,
  Bar,
} from "recharts";

function toUiScore(avgRisk: number) {
  return Math.min(100, Math.max(0, Math.round(avgRisk * 10)));
}

function labelForEvaluation(value: string) {
  if (value === "good") return "Good";
  if (value === "high_risk") return "High Risk";
  return "Needs Improvement";
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<SessionRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!user?.id) return;
      setLoading(true);
      const result = await getUserSessions(user.id);
      setSessions(result?.sessions || []);
      setLoading(false);
    }
    load();
  }, [user?.id]);

  const stats = useMemo(() => {
    if (!sessions.length) {
      return { total: 0, avg: 0, best: 0, latest: 0 };
    }

    const scores = sessions.map((s) => toUiScore(s.avg_risk));
    const latest = scores[0];
    const best = Math.max(...scores);
    const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    return { total: sessions.length, avg, best, latest };
  }, [sessions]);

  const scoreTrendData = useMemo(() => {
    const chronological = [...sessions].reverse();
    return chronological.map((s, i) => ({
      label: `S${i + 1}`,
      score: toUiScore(s.avg_risk),
      date: new Date(s.session_date).toLocaleDateString(),
    }));
  }, [sessions]);

  const violationBreakdownData = useMemo(() => {
    const chronological = [...sessions].reverse();
    return chronological.map((s, i) => ({
      label: `S${i + 1}`,
      eye: s.eye_violations,
      face: s.face_violations,
      voice: s.voice_violations,
    }));
  }, [sessions]);

  return (
    <ProtectedRoute>
    <div className="min-h-screen bg-[#080c14] pt-16">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <motion.div initial={{ opacity:0,y:12 }} animate={{ opacity:1,y:0 }}>
            <h2 className="text-xl font-bold tracking-tight">Performance Dashboard</h2>
            <div className="text-[11px] text-slate-500 font-mono mt-1">Historical sessions and trends</div>
          </motion.div>
          <Link href="/interview">
            <Button size="sm">Start New Session</Button>
          </Link>
        </div>

        <motion.div
          initial={{ opacity:0,y:12 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.1 }}
          className="bg-[#131e2e] border border-[#1e2d47] rounded-xl p-5 mb-5"
        >
          <div className="text-[11px] text-slate-500 uppercase tracking-wider mb-2">Profile</div>
          <div className="text-lg font-semibold">{user?.name || "Candidate"}</div>
          <div className="text-sm text-slate-400 mt-1">
            {user?.college || "-"} • {user?.branch || "-"} • {user?.course || "-"} • {user?.year || "-"}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity:0,y:12 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.15 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5"
        >
          <StatCard label="Total Sessions" value={stats.total} sub="All completed sessions" accentColor="#06b6d4" />
          <StatCard label="Average Score" value={stats.avg} sub="Across all sessions" accentColor="#3b82f6" />
          <StatCard label="Best Score" value={stats.best} sub="Highest session score" accentColor="#10b981" />
          <StatCard label="Latest Score" value={stats.latest} sub="Most recent session" accentColor="#f59e0b" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.2 }}>
            <Card>
              <CardHeader title="Score Trend" />
              <div>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={scoreTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e2d47" />
                    <XAxis dataKey="label" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 100]} tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Line dataKey="score" stroke="#f59e0b" strokeWidth={2} dot={{ r: 2 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.25 }}>
            <Card>
              <CardHeader title="Performance Breakdown" />
              <div>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={violationBreakdownData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e2d47" />
                    <XAxis dataKey="label" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="eye" fill="#06b6d4" />
                    <Bar dataKey="face" fill="#3b82f6" />
                    <Bar dataKey="voice" fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </motion.div>
        </div>

        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.3 }}>
          <Card>
            <CardHeader title="Session History" />
            <div>
              {loading ? (
                <div className="text-sm text-slate-400">Loading sessions...</div>
              ) : sessions.length === 0 ? (
                <div className="text-sm text-slate-400">No sessions found. Start your first interview session.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-slate-400 border-b border-white/10">
                        <th className="py-2 pr-3">Session</th>
                        <th className="py-2 pr-3">Date</th>
                        <th className="py-2 pr-3">Score</th>
                        <th className="py-2 pr-3">Evaluation</th>
                        <th className="py-2 pr-3">Eye</th>
                        <th className="py-2 pr-3">Face</th>
                        <th className="py-2 pr-3">Voice</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sessions.map((s, idx) => (
                        <tr key={s.id} className="border-b border-white/5 text-slate-200">
                          <td className="py-2 pr-3">Session {sessions.length - idx}</td>
                          <td className="py-2 pr-3">{new Date(s.session_date).toLocaleString()}</td>
                          <td className="py-2 pr-3 font-semibold">{toUiScore(s.avg_risk)}</td>
                          <td className="py-2 pr-3">{labelForEvaluation(s.evaluation)}</td>
                          <td className="py-2 pr-3">{s.eye_violations}</td>
                          <td className="py-2 pr-3">{s.face_violations}</td>
                          <td className="py-2 pr-3">{s.voice_violations}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
    </ProtectedRoute>
  );
}

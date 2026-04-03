"use client";
import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardHeader } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingState } from "@/components/ui/LoadingState";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { getUserSessions, SessionRecord } from "@/lib/api";
import {
  Activity, TrendingUp, Award, Clock, MonitorPlay,
  GraduationCap, BarChart3, ArrowRight, Eye, User as UserIcon, Mic,
  Calendar, ChevronRight
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
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

function evalBadgeVariant(value: string): "green" | "amber" | "red" {
  if (value === "good") return "green";
  if (value === "high_risk") return "red";
  return "amber";
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
}

const quickActions = [
  {
    icon: <MonitorPlay className="w-5 h-5" />,
    title: "Start Session",
    desc: "Begin a monitored interview",
    href: "/interview",
    accent: "#7c3aed",
  },
  {
    icon: <GraduationCap className="w-5 h-5" />,
    title: "Practice Mode",
    desc: "Mock interview practice",
    href: "/test",
    accent: "#a78bfa",
  },
  {
    icon: <BarChart3 className="w-5 h-5" />,
    title: "View Reports",
    desc: "AI feedback & analytics",
    href: "/feedback",
    accent: "#8b5cf6",
  },
];

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

  const recentSessions = sessions.slice(0, 5);

  return (
    <ProtectedRoute>
    <div className="min-h-screen bg-[#08080f] pt-24">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">

        {/* Welcome Header */}
        <PageHeader
          title={`${getGreeting()}, ${user?.name?.split(" ")[0] || "there"}`}
          subtitle="Here is your performance overview and quick actions"
          actions={
            <Link href="/interview">
              <Button size="sm">
                <MonitorPlay className="w-3.5 h-3.5" /> Start Session
              </Button>
            </Link>
          }
        />

        {loading ? (
          <LoadingState message="Loading your dashboard..." />
        ) : (
          <>
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6"
            >
              {quickActions.map((action, i) => (
                <Link key={i} href={action.href}>
                  <div className="group rounded-2xl border border-white/[0.07] bg-[#0e0e1a] p-4 hover:border-[#7c3aed]/30 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer overflow-hidden relative">
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_top_right,rgba(124,58,237,0.06),transparent_60%)]" />
                    <div className="relative z-10 flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center border"
                        style={{
                          background: `${action.accent}10`,
                          borderColor: `${action.accent}20`,
                          color: action.accent,
                        }}
                      >
                        {action.icon}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-white">{action.title}</div>
                        <div className="text-[11px] text-white/30">{action.desc}</div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-white/15 group-hover:text-[#7c3aed] transition-colors" />
                    </div>
                  </div>
                </Link>
              ))}
            </motion.div>

            {/* Stats Grid */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6"
            >
              <StatCard
                label="Total Sessions"
                value={stats.total}
                sub="All completed sessions"
                icon={<Activity className="w-4 h-4" />}
                accentColor="#7c3aed"
              />
              <StatCard
                label="Average Score"
                value={stats.avg}
                sub="Across all sessions"
                icon={<TrendingUp className="w-4 h-4" />}
                accentColor="#a78bfa"
              />
              <StatCard
                label="Best Score"
                value={stats.best}
                sub="Highest session score"
                icon={<Award className="w-4 h-4" />}
                accentColor="#10b981"
              />
              <StatCard
                label="Latest Score"
                value={stats.latest}
                sub="Most recent session"
                icon={<Clock className="w-4 h-4" />}
                accentColor="#f59e0b"
              />
            </motion.div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
                <Card>
                  <CardHeader title="Score Trend" />
                  {scoreTrendData.length === 0 ? (
                    <div className="text-sm text-white/25 text-center py-10">
                      Complete sessions to see your score trend
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={220}>
                      <LineChart data={scoreTrendData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                        <XAxis dataKey="label" tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 10 }} axisLine={false} tickLine={false} />
                        <YAxis domain={[0, 100]} tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 10 }} axisLine={false} tickLine={false} />
                        <Tooltip
                          contentStyle={{
                            background: "#0e0e1a",
                            border: "1px solid rgba(255,255,255,0.07)",
                            borderRadius: 12,
                            fontSize: 12,
                          }}
                        />
                        <Line dataKey="score" stroke="#7c3aed" strokeWidth={2} dot={{ r: 3, fill: "#7c3aed", stroke: "#0e0e1a", strokeWidth: 2 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                <Card>
                  <CardHeader title="Violation Breakdown" />
                  {violationBreakdownData.length === 0 ? (
                    <div className="text-sm text-white/25 text-center py-10">
                      No violation data available yet
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={violationBreakdownData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                        <XAxis dataKey="label" tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 10 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 10 }} axisLine={false} tickLine={false} />
                        <Tooltip
                          contentStyle={{
                            background: "#0e0e1a",
                            border: "1px solid rgba(255,255,255,0.07)",
                            borderRadius: 12,
                            fontSize: 12,
                          }}
                        />
                        <Bar dataKey="eye" fill="#7c3aed" radius={[4, 4, 0, 0]} name="Eye" />
                        <Bar dataKey="face" fill="#a78bfa" radius={[4, 4, 0, 0]} name="Face" />
                        <Bar dataKey="voice" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Voice" />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </Card>
              </motion.div>
            </div>

            {/* Recent Activity + Session History */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Recent Activity */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
                <Card className="h-full">
                  <CardHeader title="Recent Activity" />
                  {recentSessions.length === 0 ? (
                    <EmptyState
                      icon={<Activity className="w-6 h-6" />}
                      title="No sessions yet"
                      description="Start your first interview session to see activity here"
                      actionLabel="Start Session"
                      actionHref="/interview"
                    />
                  ) : (
                    <div className="space-y-3">
                      {recentSessions.map((s, idx) => (
                        <div
                          key={s.id}
                          className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08] transition-colors"
                        >
                          <div className="w-8 h-8 rounded-lg bg-[#7c3aed]/10 border border-[#7c3aed]/20 flex items-center justify-center text-[#a78bfa] text-xs font-bold">
                            {sessions.length - idx}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-medium text-white truncate">
                              Session {sessions.length - idx}
                            </div>
                            <div className="flex items-center gap-1.5 text-[10px] text-white/25">
                              <Calendar className="w-3 h-3" />
                              {new Date(s.session_date).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-bold font-mono text-[#a78bfa]">
                              {toUiScore(s.avg_risk)}
                            </div>
                            <Badge variant={evalBadgeVariant(s.evaluation)} className="text-[8px] px-1.5 py-0.5">
                              {labelForEvaluation(s.evaluation)}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              </motion.div>

              {/* Session History Table */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="lg:col-span-2">
                <Card className="h-full">
                  <CardHeader
                    title="Session History"
                    right={
                      sessions.length > 0 && (
                        <Link href="/feedback" className="flex items-center gap-1 text-[11px] text-[#a78bfa] hover:text-white transition-colors">
                          View All <ChevronRight className="w-3 h-3" />
                        </Link>
                      )
                    }
                  />
                  {sessions.length === 0 ? (
                    <EmptyState
                      icon={<BarChart3 className="w-6 h-6" />}
                      title="No sessions found"
                      description="Start your first interview session to build your history"
                      actionLabel="Start Session"
                      actionHref="/interview"
                    />
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-left border-b border-white/[0.06]">
                            <th className="py-2.5 pr-3 text-[10px] font-semibold text-white/25 uppercase tracking-[0.15em]">Session</th>
                            <th className="py-2.5 pr-3 text-[10px] font-semibold text-white/25 uppercase tracking-[0.15em]">Date</th>
                            <th className="py-2.5 pr-3 text-[10px] font-semibold text-white/25 uppercase tracking-[0.15em]">Score</th>
                            <th className="py-2.5 pr-3 text-[10px] font-semibold text-white/25 uppercase tracking-[0.15em]">Status</th>
                            <th className="py-2.5 pr-3 text-[10px] font-semibold text-white/25 uppercase tracking-[0.15em]">
                              <Eye className="w-3 h-3 inline" />
                            </th>
                            <th className="py-2.5 pr-3 text-[10px] font-semibold text-white/25 uppercase tracking-[0.15em]">
                              <UserIcon className="w-3 h-3 inline" />
                            </th>
                            <th className="py-2.5 pr-3 text-[10px] font-semibold text-white/25 uppercase tracking-[0.15em]">
                              <Mic className="w-3 h-3 inline" />
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {sessions.map((s, idx) => (
                            <tr
                              key={s.id}
                              className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                            >
                              <td className="py-3 pr-3 text-white/70 font-medium">Session {sessions.length - idx}</td>
                              <td className="py-3 pr-3 text-white/40 text-xs">{new Date(s.session_date).toLocaleString()}</td>
                              <td className="py-3 pr-3 font-bold font-mono text-[#a78bfa]">{toUiScore(s.avg_risk)}</td>
                              <td className="py-3 pr-3">
                                <Badge variant={evalBadgeVariant(s.evaluation)} className="text-[9px]">
                                  {labelForEvaluation(s.evaluation)}
                                </Badge>
                              </td>
                              <td className="py-3 pr-3 font-mono text-xs text-white/40">{s.eye_violations}</td>
                              <td className="py-3 pr-3 font-mono text-xs text-white/40">{s.face_violations}</td>
                              <td className="py-3 pr-3 font-mono text-xs text-white/40">{s.voice_violations}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </Card>
              </motion.div>
            </div>
          </>
        )}
      </div>
    </div>
    </ProtectedRoute>
  );
}

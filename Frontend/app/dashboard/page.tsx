"use client";
import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardHeader } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
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
    accent: "#3b82f6",
  },
  {
    icon: <GraduationCap className="w-5 h-5" />,
    title: "Practice Mode",
    desc: "Mock interview practice",
    href: "/test",
    accent: "#06b6d4",
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
      <div className="relative isolate min-h-screen overflow-hidden bg-[#080c14] pt-24">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-[-8rem] h-[24rem] w-[24rem] -translate-x-1/2 rounded-full bg-[#3b82f6]/10 blur-[140px]" />
          <div className="absolute right-[-6rem] top-[18rem] h-[18rem] w-[18rem] rounded-full bg-[#8b5cf6]/10 blur-[120px]" />
          <div className="absolute bottom-[-8rem] left-[-8rem] h-[18rem] w-[18rem] rounded-full bg-[#06b6d4]/6 blur-[120px]" />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-6 md:px-6">
          <section className="mb-6 rounded-2xl border border-white/[0.05] bg-white/[0.02] px-5 py-5 backdrop-blur-xl md:px-6 md:py-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#3b82f6]">Dashboard Overview</div>
                <h1 className="text-3xl font-bold tracking-[-0.03em] text-white sm:text-4xl">
                  {getGreeting()}, {user?.name?.split(" ")[0] || "there"}
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#94a3b8] sm:text-base">
                  Here is your performance overview, monitoring activity, and AI-driven session insights.
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <Link href="/interview">
                  <Button size="sm">
                    <MonitorPlay className="h-3.5 w-3.5" /> Start Session
                  </Button>
                </Link>
              </div>
            </div>
          </section>

        {loading ? (
          <LoadingState message="Loading your dashboard..." />
        ) : (
          <>
            <section className="mb-6">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="grid grid-cols-1 gap-3 sm:grid-cols-3"
              >
                {quickActions.map((action, i) => (
                  <Link key={i} href={action.href}>
                    <div className="theme-panel theme-panel-hover theme-glow group relative cursor-pointer overflow-hidden rounded-2xl p-4">
                      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.08),transparent_60%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                      <div className="relative z-10 flex items-center gap-3">
                        <div
                          className="flex h-10 w-10 items-center justify-center rounded-xl border"
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
                          <div className="text-[11px] text-[#64748b]">{action.desc}</div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-[#64748b] transition-colors group-hover:text-[#06b6d4]" />
                      </div>
                    </div>
                  </Link>
                ))}
              </motion.div>
            </section>

            <section className="mb-6">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-2 gap-3 lg:grid-cols-4"
              >
                <StatCard
                  label="Total Sessions"
                  value={stats.total}
                  sub="All completed sessions"
                  icon={<Activity className="h-4 w-4" />}
                  accentColor="#3b82f6"
                />
                <StatCard
                  label="Average Score"
                  value={stats.avg}
                  sub="Across all sessions"
                  icon={<TrendingUp className="h-4 w-4" />}
                  accentColor="#06b6d4"
                />
                <StatCard
                  label="Best Score"
                  value={stats.best}
                  sub="Highest session score"
                  icon={<Award className="h-4 w-4" />}
                  accentColor="#10b981"
                />
                <StatCard
                  label="Latest Score"
                  value={stats.latest}
                  sub="Most recent session"
                  icon={<Clock className="h-4 w-4" />}
                  accentColor="#f59e0b"
                />
              </motion.div>
            </section>

            <section className="mb-6">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#3b82f6]">Analytics</div>
                  <h2 className="mt-1 text-xl font-bold text-white">Performance Charts</h2>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
                  <Card className="bg-[#101828] border border-[#1e2d47]">
                    <CardHeader title="Score Trend" />
                    {scoreTrendData.length === 0 ? (
                      <div className="py-10 text-center text-sm text-[#64748b]">
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
                              background: "#101828",
                              border: "1px solid rgba(255,255,255,0.07)",
                              borderRadius: 12,
                              fontSize: 12,
                            }}
                          />
                          <Line dataKey="score" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3, fill: "#3b82f6", stroke: "#101828", strokeWidth: 2 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    )}
                  </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                  <Card className="bg-[#101828] border border-[#1e2d47]">
                    <CardHeader title="Violation Breakdown" />
                    {violationBreakdownData.length === 0 ? (
                      <div className="py-10 text-center text-sm text-[#64748b]">
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
                              background: "#101828",
                              border: "1px solid rgba(255,255,255,0.07)",
                              borderRadius: 12,
                              fontSize: 12,
                            }}
                          />
                          <Bar dataKey="eye" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Eye" />
                          <Bar dataKey="face" fill="#06b6d4" radius={[4, 4, 0, 0]} name="Face" />
                          <Bar dataKey="voice" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Voice" />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </Card>
                </motion.div>
              </div>
            </section>

            <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
                <Card className="h-full bg-[#101828] border border-[#1e2d47]">
                  <CardHeader title="Recent Activity" />
                  {recentSessions.length === 0 ? (
                    <EmptyState
                      icon={<Activity className="h-6 w-6" />}
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
                          className="flex items-center gap-3 rounded-xl border border-white/[0.04] bg-white/[0.02] p-3 transition-all duration-300 hover:border-[#243655] hover:-translate-y-0.5"
                        >
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#3b82f6]/20 bg-[#3b82f6]/10 text-xs font-bold text-[#06b6d4]">
                            {sessions.length - idx}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="truncate text-xs font-medium text-white">Session {sessions.length - idx}</div>
                            <div className="flex items-center gap-1.5 text-[10px] text-[#64748b]">
                              <Calendar className="h-3 w-3" />
                              {new Date(s.session_date).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-mono text-sm font-bold text-[#06b6d4]">{toUiScore(s.avg_risk)}</div>
                            <Badge variant={evalBadgeVariant(s.evaluation)} className="px-1.5 py-0.5 text-[8px]">
                              {labelForEvaluation(s.evaluation)}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="xl:col-span-2">
                <Card className="h-full bg-[#101828] border border-[#1e2d47]">
                  <CardHeader
                    title="Session History"
                    right={
                      sessions.length > 0 && (
                        <Link href="/feedback" className="flex items-center gap-1 text-[11px] text-[#06b6d4] transition-colors hover:text-white">
                          View All <ChevronRight className="h-3 w-3" />
                        </Link>
                      )
                    }
                  />
                  {sessions.length === 0 ? (
                    <EmptyState
                      icon={<BarChart3 className="h-6 w-6" />}
                      title="No sessions found"
                      description="Start your first interview session to build your history"
                      actionLabel="Start Session"
                      actionHref="/interview"
                    />
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-[#1e2d47] text-left">
                            <th className="py-2.5 pr-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#64748b]">Session</th>
                            <th className="py-2.5 pr-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#64748b]">Date</th>
                            <th className="py-2.5 pr-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#64748b]">Score</th>
                            <th className="py-2.5 pr-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#64748b]">Status</th>
                            <th className="py-2.5 pr-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#64748b]"><Eye className="inline h-3 w-3" /></th>
                            <th className="py-2.5 pr-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#64748b]"><UserIcon className="inline h-3 w-3" /></th>
                            <th className="py-2.5 pr-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#64748b]"><Mic className="inline h-3 w-3" /></th>
                          </tr>
                        </thead>
                        <tbody>
                          {sessions.map((s, idx) => (
                            <tr key={s.id} className="border-b border-white/[0.03] transition-colors hover:bg-white/[0.02]">
                              <td className="py-3 pr-3 font-medium text-white/70">Session {sessions.length - idx}</td>
                              <td className="py-3 pr-3 text-xs text-[#94a3b8]">{new Date(s.session_date).toLocaleString()}</td>
                              <td className="py-3 pr-3 font-mono font-bold text-[#06b6d4]">{toUiScore(s.avg_risk)}</td>
                              <td className="py-3 pr-3">
                                <Badge variant={evalBadgeVariant(s.evaluation)} className="text-[9px]">
                                  {labelForEvaluation(s.evaluation)}
                                </Badge>
                              </td>
                              <td className="py-3 pr-3 font-mono text-xs text-[#94a3b8]">{s.eye_violations}</td>
                              <td className="py-3 pr-3 font-mono text-xs text-[#94a3b8]">{s.face_violations}</td>
                              <td className="py-3 pr-3 font-mono text-xs text-[#94a3b8]">{s.voice_violations}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </Card>
              </motion.div>
            </section>
          </>
        )}
      </div>
    </div>
    </ProtectedRoute>
  );
}

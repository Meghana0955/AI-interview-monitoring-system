"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Card, CardHeader } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { RiskBadge, Badge } from "@/components/ui/Badge";
import { Alert } from "@/components/ui/Alert";
import { WebcamFeed } from "@/components/monitoring/WebcamFeed";
import { LiveIndicators } from "@/components/monitoring/LiveIndicators";
import { RiskLineChart } from "@/components/charts/RiskLineChart";
import { ViolationsBarChart } from "@/components/charts/ViolationsBarChart";
import { BehaviorPieChart } from "@/components/charts/BehaviorPieChart";
import { getRiskLevel, formatTime, MOCK_RISK_HISTORY } from "@/lib/utils";

const EYE_DIRS   = ["Forward","Forward","Forward","Left","Right","Forward","Up","Forward"];
const VOICE_STAT = ["Clear","Moderate","Background noise","Clear","Moderate"];
const ALERTS: { type: "ok"|"warn"|"err"; msg: string }[] = [
  { type: "warn", msg: "Looking away detected — top-right direction" },
  { type: "ok",   msg: "Face identity verified — single person" },
  { type: "err",  msg: "Background noise spike — 72 dB" },
  { type: "ok",   msg: "Eye contact restored" },
  { type: "warn", msg: "Gaze deviation — left side" },
];

export default function DashboardPage() {
  const [riskData, setRiskData]     = useState<number[]>([...MOCK_RISK_HISTORY]);
  const [riskScore, setRiskScore]   = useState(54);
  const [eyeDir, setEyeDir]         = useState("Forward");
  const [voiceStat, setVoiceStat]   = useState("Moderate");
  const [eyeCount, setEyeCount]     = useState(7);
  const [faceCount, setFaceCount]   = useState(3);
  const [voiceCount, setVoiceCount] = useState(5);
  const [elapsed, setElapsed]       = useState(23 * 60 + 47);
  const [alerts, setAlerts]         = useState(ALERTS.slice(0, 2));

  // Clock
  const [clock, setClock] = useState("");
  useEffect(() => {
    const tick = () => setClock(new Date().toLocaleTimeString("en-IN", { hour12: false }));
    tick(); const id = setInterval(tick, 1000); return () => clearInterval(id);
  }, []);

  // Session timer
  useEffect(() => {
    const id = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(id);
  }, []);

  // Live data polling (simulated)
  useEffect(() => {
    let alertIdx = 0;
    const id = setInterval(() => {
      const score = 35 + Math.floor(Math.random() * 40);
      setRiskScore(score);
      setEyeDir(EYE_DIRS[Math.floor(Math.random() * EYE_DIRS.length)]);
      setVoiceStat(VOICE_STAT[Math.floor(Math.random() * VOICE_STAT.length)]);
      setRiskData(prev => {
        const next = [...prev.slice(1), score];
        return next;
      });
      const nextAlert = ALERTS[alertIdx % ALERTS.length];
      setAlerts(prev => [nextAlert, ...prev].slice(0, 3));
      alertIdx++;
      if (score > 68) toast.error(`⚠ Risk score high: ${score}`);
    }, 3500);
    return () => clearInterval(id);
  }, []);

  const level = getRiskLevel(riskScore);

  return (
    <div className="min-h-screen bg-[#080c14] pt-14">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">

        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <motion.div initial={{ opacity:0,y:12 }} animate={{ opacity:1,y:0 }}>
            <h2 className="text-xl font-bold tracking-tight">Mission Control Dashboard</h2>
            <div className="text-[11px] text-slate-500 font-mono mt-1">{clock} IST · Session #2847</div>
          </motion.div>
          <div className="flex gap-2 items-center flex-wrap">
            <RiskBadge level={level} />
            <Badge variant="blue">SESSION #2847</Badge>
          </div>
        </div>

        {/* Profile */}
        <motion.div
          initial={{ opacity:0,y:12 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.1 }}
          className="flex items-center gap-4 bg-[#131e2e] border border-[#1e2d47] rounded-xl p-4 mb-5"
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-700 to-purple-600 flex items-center justify-center font-bold text-lg flex-shrink-0">
            RS
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-[15px]">Rahul Sharma</div>
            <div className="text-xs text-slate-400">Computer Science · Final Year · Interview #12</div>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-[10px] text-slate-500 mb-0.5 uppercase tracking-wide">Session Duration</div>
            <div className="text-base font-bold font-mono text-cyan-400">{formatTime(elapsed)}</div>
          </div>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity:0,y:12 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.15 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5"
        >
          <StatCard label="Eye Violations"  value={eyeCount}   sub="↑ 2 in last 5 min"   accentColor="#06b6d4" />
          <StatCard label="Face Violations" value={faceCount}  sub="Identity verified"    accentColor="#3b82f6" />
          <StatCard label="Voice Violations"value={voiceCount} sub="Background noise"     accentColor="#8b5cf6" />
          <StatCard label="Risk Score"      value={riskScore}  sub="Threshold: 70"        accentColor="#f59e0b" />
        </motion.div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.2 }}>
            <Card>
              <CardHeader title="Risk Score Timeline" right={<span className="text-[10px] text-emerald-400 font-mono animate-pulse-dot">● LIVE</span>} />
              <RiskLineChart data={riskData} />
            </Card>
          </motion.div>
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.25 }}>
            <Card>
              <CardHeader title="Violations Breakdown" />
              <ViolationsBarChart eye={eyeCount} face={faceCount} voice={voiceCount} />
            </Card>
          </motion.div>
        </div>

        {/* Live feed + behavior */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.3 }}>
            <Card>
              <CardHeader title="Live Monitoring Feed" />
              <WebcamFeed />
              <LiveIndicators indicators={[
                { label: "Eye Direction", value: eyeDir,    status: eyeDir === "Forward" ? "ok" : "warn" },
                { label: "Face Status",   value: "Detected", status: "ok" },
                { label: "Audio Level",   value: voiceStat,  status: voiceStat === "Clear" ? "ok" : "warn" },
              ]} />
            </Card>
          </motion.div>
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.35 }}>
            <Card>
              <CardHeader title="Behavior Distribution" />
              <BehaviorPieChart />
              <div className="mt-4 space-y-2">
                <div className="text-[11px] text-slate-500 uppercase tracking-wide mb-2">Active Alerts</div>
                {alerts.map((a, i) => (
                  <Alert key={i} type={a.type}>{a.msg}</Alert>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

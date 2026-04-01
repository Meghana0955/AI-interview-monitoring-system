"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge, RiskBadge } from "@/components/ui/Badge";
import { Alert } from "@/components/ui/Alert";
import { WebcamFeed } from "@/components/monitoring/WebcamFeed";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Button } from "@/components/ui/Button";
import { getRiskLevel, formatTime } from "@/lib/utils";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const EYE_EVENTS: { type:"ok"|"warn"|"err"; msg: string }[] = [
  { type:"warn", msg: "Background noise detected — audio level 68 dB" },
  { type:"ok",   msg: "Face verification successful" },
  { type:"warn", msg: "Gaze deviation — right side (2.3 s)" },
  { type:"ok",   msg: "Session stable — low risk window" },
  { type:"err",  msg: "Multiple looks away — streak of 3" },
  { type:"warn", msg: "Audio spike detected — 74 dB" },
  { type:"ok",   msg: "Eye contact restored" },
  { type:"err",  msg: "Face partially obscured" },
];

function getRiskBarColor(score: number) {
  if (score < 40) return "linear-gradient(90deg,#10b981,#34d399)";
  if (score < 70) return "linear-gradient(90deg,#10b981,#f59e0b)";
  return "linear-gradient(90deg,#f59e0b,#ef4444)";
}

export default function InterviewPage() {
  const router = useRouter();
  const [riskScore, setRiskScore]   = useState(54);
  const [elapsed, setElapsed]       = useState(0);
  const [running, setRunning]       = useState(true);
  const [eyeStatus, setEyeStatus]   = useState("Forward — Stable");
  const [voiceStatus, setVoiceStatus] = useState("Background noise");
  const [log, setLog]               = useState(EYE_EVENTS.slice(0, 4));
  const logRef = useRef<HTMLDivElement>(null);
  let eventIdx = 4;

  // Elapsed
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  // Live simulation
  useEffect(() => {
    const dirs = ["Forward — Stable","Forward","Looking Left","Looking Right","Forward — Stable"];
    const voices = ["Clear","Background noise","Noise spike","Clear","Moderate noise"];
    const id = setInterval(() => {
      const score = 30 + Math.floor(Math.random() * 50);
      setRiskScore(score);
      setEyeStatus(dirs[Math.floor(Math.random() * dirs.length)]);
      setVoiceStatus(voices[Math.floor(Math.random() * voices.length)]);
      const ev = EYE_EVENTS[eventIdx % EYE_EVENTS.length]; eventIdx++;
      setLog(prev => [ev, ...prev].slice(0, 8));
      if (score >= 70) toast.error(`High risk detected: ${score}`);
    }, 3000);
    return () => clearInterval(id);
  }, []);

  const level = getRiskLevel(riskScore);

  const endSession = () => {
    setRunning(false);
    toast.success("Session ended. Generating report…");
    setTimeout(() => router.push("/feedback"), 1200);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#080c14] pt-14">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">

          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <motion.div initial={{ opacity:0,y:12 }} animate={{ opacity:1,y:0 }}>
              <h2 className="text-xl font-bold tracking-tight">Live Interview Session</h2>
              <div className="text-[11px] text-slate-500 font-mono mt-1">Duration: {formatTime(elapsed)}</div>
            </motion.div>
            <div className="flex gap-2 items-center flex-wrap">
              <Badge variant="red">● Monitoring Active</Badge>
              <Button variant="outline" size="sm" onClick={endSession}>⏹ End Session</Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            {/* Camera */}
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.1 }}>
              <Card className="p-0 overflow-hidden">
                <WebcamFeed label="SESSION CAM · HD" aspectRatio="aspect-[4/3]" className="rounded-none border-0" />
              </Card>
            </motion.div>

            {/* Right panel */}
            <div className="flex flex-col gap-4">
              {/* Risk meter */}
              <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.15 }}>
                <Card>
                  <CardHeader title="Real-Time Risk Monitor" />
                  <div className="text-center py-4">
                    <div
                      className="text-6xl font-bold font-mono tracking-tighter"
                      style={{ color: level === "low" ? "#10b981" : level === "medium" ? "#f59e0b" : "#ef4444" }}
                    >
                      {riskScore}
                    </div>
                    <div className="text-xs text-slate-400 mt-1 mb-4">Current Risk Score</div>
                    <div className="h-2 bg-[#1e2d47] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${riskScore}%`, background: getRiskBarColor(riskScore) }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500 mt-1.5">
                      <span>0 LOW</span><span>50 MED</span><span>100 HIGH</span>
                    </div>
                    <div className="mt-3">
                      <RiskBadge level={level} />
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* AI detector panels */}
              <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.2 }}>
                <Card>
                  <CardHeader title="AI Detection Panels" />
                  <div className="space-y-2.5">
                    {/* Eye */}
                    <div className={`flex items-center justify-between p-3 rounded-lg border ${eyeStatus.includes("Forward") ? "bg-emerald-500/5 border-emerald-500/20" : "bg-amber-500/5 border-amber-500/20"}`}>
                      <div>
                        <div className="text-[10px] text-slate-500 uppercase tracking-wide mb-0.5">Eye Tracking</div>
                        <div className={`text-sm font-semibold ${eyeStatus.includes("Forward") ? "text-emerald-300" : "text-amber-300"}`}>
                          {eyeStatus}
                        </div>
                      </div>
                      <Badge variant={eyeStatus.includes("Forward") ? "green" : "amber"}>
                        {eyeStatus.includes("Forward") ? "Normal" : "Warning"}
                      </Badge>
                    </div>
                    {/* Face */}
                    <div className="flex items-center justify-between p-3 rounded-lg border bg-emerald-500/5 border-emerald-500/20">
                      <div>
                        <div className="text-[10px] text-slate-500 uppercase tracking-wide mb-0.5">Face Detection</div>
                        <div className="text-sm font-semibold text-emerald-300">1 Person · Verified</div>
                      </div>
                      <Badge variant="green">Verified</Badge>
                    </div>
                    {/* Voice */}
                    <div className={`flex items-center justify-between p-3 rounded-lg border ${voiceStatus === "Clear" ? "bg-emerald-500/5 border-emerald-500/20" : "bg-amber-500/5 border-amber-500/20"}`}>
                      <div>
                        <div className="text-[10px] text-slate-500 uppercase tracking-wide mb-0.5">Voice Analysis</div>
                        <div className={`text-sm font-semibold ${voiceStatus === "Clear" ? "text-emerald-300" : "text-amber-300"}`}>
                          {voiceStatus}
                        </div>
                      </div>
                      <Badge variant={voiceStatus === "Clear" ? "green" : "amber"}>
                        {voiceStatus === "Clear" ? "Clear" : "Warning"}
                      </Badge>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>
          </div>

          {/* Event log */}
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.3 }}>
            <Card>
              <CardHeader
                title="Live Event Log"
                right={<span className="text-[10px] text-slate-500 font-mono">{formatTime(elapsed)}</span>}
              />
              <div ref={logRef} className="max-h-44 overflow-y-auto space-y-1.5">
                {log.map((e, i) => (
                  <Alert key={i} type={e.type} className="animate-slide-right">{e.msg}</Alert>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

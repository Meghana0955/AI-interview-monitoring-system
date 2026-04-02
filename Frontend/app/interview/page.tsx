"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge, RiskBadge } from "@/components/ui/Badge";
import { Alert } from "@/components/ui/Alert";
import { WebcamFeed } from "@/components/monitoring/WebcamFeed";
import { Button } from "@/components/ui/Button";
import { getRiskLevel, formatTime } from "@/lib/utils";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import { startSession, stopSession, processFrame, getLiveData, checkHealth } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

function getRiskBarColor(score: number) {
  if (score < 30) return "linear-gradient(90deg,#10b981,#34d399)";
  if (score < 60) return "linear-gradient(90deg,#10b981,#f59e0b)";
  return "linear-gradient(90deg,#f59e0b,#ef4444)";
}

function normalizeScore(score: number): number {
  return Math.min(100, Math.round(score * 10));
}

/* ── Page State Machine ──────────────────────────── */
type PagePhase = "instructions" | "connecting" | "monitoring";

export default function InterviewPage() {
  const router = useRouter();
  const { user } = useAuth();

  // Phase: instructions → connecting → monitoring
  const [phase, setPhase] = useState<PagePhase>("instructions");
  const [backendConnected, setBackendConnected] = useState(false);
  const [voiceAvailable, setVoiceAvailable] = useState(false);
  const [sessionActive, setSessionActive] = useState(false);

  // Live monitoring state
  const [riskScore, setRiskScore] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [eyeStatus, setEyeStatus] = useState("Waiting...");
  const [faceStatus, setFaceStatus] = useState("Waiting...");
  const [voiceStatus, setVoiceStatus] = useState("Waiting...");
  const [eyeViolations, setEyeViolations] = useState(0);
  const [faceViolations, setFaceViolations] = useState(0);
  const [voiceViolations, setVoiceViolations] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [log, setLog] = useState<{ type: "ok" | "warn" | "err"; msg: string }[]>([]);
  const processingRef = useRef(false);

  const level = getRiskLevel(riskScore);

  /* ── Start Monitoring (user clicks button) ─────── */
  const handleStartMonitoring = useCallback(async () => {
    setPhase("connecting");

    // Check backend health
    const health = await checkHealth();
    const connected = !!health;
    setBackendConnected(connected);

    if (connected) {
      // Start session on backend (calibrates mic, starts voice thread)
      const res = await startSession(user?.id);
      if (res.status === "started") {
        setSessionActive(true);
        setVoiceAvailable(res.voice_available);
        toast.success("🟢 AI monitoring activated");
        if (!res.voice_available) {
          toast("Microphone not available — voice analysis disabled", { icon: "🎤" });
        }
      } else {
        toast.error("Failed to start backend session. Using demo mode.");
      }
    } else {
      toast("Backend not running — using demo mode", { icon: "⚠️" });
    }

    setPhase("monitoring");
  }, []);

  /* ── Handle webcam frame → send to backend ────── */
  const handleFrame = useCallback(async (base64Frame: string) => {
    if (!backendConnected || !sessionActive || processingRef.current) return;
    processingRef.current = true;

    try {
      const result = await processFrame(base64Frame);
      if (result) {
        const dir = result.eye.direction;
        setEyeStatus(
          dir === "normal" || dir === "center"
            ? "Forward — Stable"
            : `Looking ${dir.charAt(0).toUpperCase() + dir.slice(1)}`
        );
        setFaceStatus(result.face.status);
        setVoiceStatus(result.voice.status);
        setEyeViolations(result.eye.violations);
        setFaceViolations(result.face.violations);
        setVoiceViolations(result.voice.violations);
        setRiskScore(normalizeScore(result.risk.score));
        setElapsed(result.elapsed);
        if (result.voice.audio_level !== undefined) {
          setAudioLevel(result.voice.audio_level);
        }
      }
    } catch {
      // Silently handle network errors
    }

    processingRef.current = false;
  }, [backendConnected, sessionActive]);

  /* ── Poll alerts from /api/live-data ───────────── */
  useEffect(() => {
    if (phase !== "monitoring" || !backendConnected) return;
    const id = setInterval(async () => {
      try {
        const data = await getLiveData();
        if (data.running && data.alerts) {
          setLog(data.alerts.slice(0, 8));
        }
      } catch { /* ignore */ }
    }, 2500);
    return () => clearInterval(id);
  }, [phase, backendConnected]);

  /* ── Simulated fallback (no backend) ──────────── */
  useEffect(() => {
    if (phase !== "monitoring" || backendConnected) return;

    const dirs = ["Forward — Stable", "Forward — Stable", "Looking Left", "Looking Right", "Forward — Stable"];
    const voices = ["Normal", "Normal", "Background voice detected", "Normal"];
    const simAlerts: { type: "ok" | "warn" | "err"; msg: string }[] = [
      { type: "warn", msg: "🎤 Background noise detected — volume 4.2" },
      { type: "ok", msg: "✅ Face verification successful" },
      { type: "warn", msg: "👁 Gaze deviation — right side (2.3s)" },
      { type: "ok", msg: "✅ Session stable — low risk" },
      { type: "err", msg: "🧑 Multiple gaze deviations — streak of 3" },
    ];

    const timer = setInterval(() => {
      const score = 25 + Math.floor(Math.random() * 50);
      setRiskScore(score);
      setEyeStatus(dirs[Math.floor(Math.random() * dirs.length)]);
      setVoiceStatus(voices[Math.floor(Math.random() * voices.length)]);
      setFaceStatus("Normal");
      setAudioLevel(+(Math.random() * 5).toFixed(1));
      setElapsed((e) => e + 3);
      setLog((prev) => [simAlerts[Math.floor(Math.random() * simAlerts.length)], ...prev].slice(0, 8));
    }, 3000);

    const clock = setInterval(() => setElapsed((e) => e + 1), 1000);

    return () => { clearInterval(timer); clearInterval(clock); };
  }, [phase, backendConnected]);

  /* ── End Session ──────────────────────────────── */
  const endSession = async () => {
    if (backendConnected && sessionActive) {
      toast("Stopping session...", { icon: "⏹" });
      const res = await stopSession(user?.id);
      if (res.status === "stopped") {
        toast.success(`Session ended. ${res.summary.total_records} data points recorded.`);
      }
    } else {
      toast.success("Session ended. Generating report…");
    }
    setTimeout(() => router.push("/feedback"), 1200);
  };

  /* ────────────────────── RENDER ──────────────────── */
  return (
    <ProtectedRoute>
    <div className="min-h-screen bg-[#080c14] pt-16">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">

        <AnimatePresence mode="wait">
          {/* ══════════ PHASE 1: Instructions ══════════ */}
          {phase === "instructions" && (
            <motion.div
              key="instructions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto"
            >
              <div className="text-center mb-8">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center text-3xl mx-auto mb-5 shadow-[0_0_40px_rgba(6,182,212,0.2)]">
                  🔬
                </div>
                <h2 className="text-2xl font-bold tracking-tight mb-2">AI Interview Monitoring</h2>
                <p className="text-slate-400 text-sm">Complete the pre-session checklist below, then click Start to begin.</p>
              </div>

              <Card className="mb-5">
                <CardHeader title="📋 Pre-Session Checklist" />
                <div className="space-y-3">
                  {[
                    { icon: "📷", title: "Camera Access", desc: "Your browser will ask for webcam permission. Make sure your face is clearly visible and well-lit." },
                    { icon: "🎤", title: "Microphone Access", desc: "Audio will be monitored for background noise. Use a quiet environment with no background voices." },
                    { icon: "👁", title: "Eye Tracking", desc: "Our AI model tracks your gaze direction. Look directly at the screen during the session." },
                    { icon: "🧑", title: "Face Detection", desc: "Stay in frame throughout the session. Don't leave your seat or allow others into the frame." },
                    { icon: "⏱", title: "Session Timer", desc: "The monitoring runs in real-time. You can end the session anytime to get your performance report." },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                      <div className="text-xl flex-shrink-0 mt-0.5">{item.icon}</div>
                      <div>
                        <div className="text-sm font-semibold text-slate-200">{item.title}</div>
                        <div className="text-xs text-slate-400 leading-relaxed mt-0.5">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="mb-6">
                <CardHeader title="⚙ How It Works" />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { step: "1", title: "Capture", desc: "Camera & mic activate in your browser" },
                    { step: "2", title: "Analyze", desc: "AI models process eye, face & voice in real-time" },
                    { step: "3", title: "Report", desc: "Get a detailed performance report with AI feedback" },
                  ].map((s, i) => (
                    <div key={i} className="text-center p-4 rounded-lg bg-gradient-to-b from-white/[0.03] to-transparent border border-white/[0.05]">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center text-sm font-bold mx-auto mb-2">{s.step}</div>
                      <div className="text-sm font-semibold text-slate-200">{s.title}</div>
                      <div className="text-[11px] text-slate-500 mt-1">{s.desc}</div>
                    </div>
                  ))}
                </div>
              </Card>

              <div className="text-center">
                <button
                  onClick={handleStartMonitoring}
                  className="px-8 py-3.5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-bold text-sm shadow-[0_4px_24px_rgba(6,182,212,0.3)] hover:shadow-[0_6px_32px_rgba(6,182,212,0.5)] transition-all duration-300 active:scale-[.97]"
                >
                  🚀 Start Monitoring Session
                </button>
                <p className="text-[11px] text-slate-600 mt-3">
                  By clicking Start, you allow camera & microphone access for AI analysis.
                </p>
              </div>
            </motion.div>
          )}

          {/* ══════════ PHASE 2: Connecting ══════════ */}
          {phase === "connecting" && (
            <motion.div
              key="connecting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-32"
            >
              <div className="relative w-16 h-16 mb-5">
                <div className="absolute inset-0 rounded-full border-2 border-[#1e2d47]" />
                <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-cyan-400 animate-spin" />
              </div>
              <div className="text-lg font-semibold mb-1">Initializing AI Systems</div>
              <div className="text-sm text-slate-400">Connecting to backend, calibrating microphone...</div>
            </motion.div>
          )}

          {/* ══════════ PHASE 3: Live Monitoring ════ */}
          {phase === "monitoring" && (
            <motion.div
              key="monitoring"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <div>
                  <h2 className="text-xl font-bold tracking-tight">Live Interview Session</h2>
                  <div className="text-[11px] text-slate-500 font-mono mt-1">
                    Duration: {formatTime(elapsed)}
                    {backendConnected ? (
                      <span className="ml-2 text-emerald-400">● AI Connected</span>
                    ) : (
                      <span className="ml-2 text-amber-400">● Demo Mode</span>
                    )}
                    {voiceAvailable && (
                      <span className="ml-2 text-purple-400">● Mic Active</span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 items-center flex-wrap">
                  <Badge variant="red">● RECORDING</Badge>
                  <Button variant="outline" size="sm" onClick={endSession}>⏹ End Session</Button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                {/* Camera + mic */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
                  <Card className="p-0 overflow-hidden">
                    <WebcamFeed
                      label="SESSION CAM · HD"
                      aspectRatio="aspect-[4/3]"
                      className="rounded-none border-0"
                      active={true}
                      onFrame={handleFrame}
                      captureInterval={1500}
                    />
                  </Card>
                </motion.div>

                {/* Right panel */}
                <div className="flex flex-col gap-4">
                  {/* Risk meter */}
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
                    <Card>
                      <CardHeader title="Real-Time Risk Monitor" />
                      <div className="text-center py-4">
                        <div
                          className="text-6xl font-bold font-mono tracking-tighter"
                          style={{ color: level === "low" ? "#10b981" : level === "medium" ? "#f59e0b" : "#ef4444" }}
                        >
                          {riskScore}
                        </div>
                        <div className="text-xs text-slate-400 mt-1 mb-4">Risk Score (0–100)</div>
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
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                    <Card>
                      <CardHeader title="AI Detection Panels" />
                      <div className="space-y-2.5">
                        {/* Eye */}
                        {(() => {
                          const isNormal = eyeStatus.includes("Forward") || eyeStatus.includes("Stable") || eyeStatus === "Waiting...";
                          return (
                            <div className={`flex items-center justify-between p-3 rounded-lg border ${isNormal ? "bg-emerald-500/5 border-emerald-500/20" : "bg-amber-500/5 border-amber-500/20"}`}>
                              <div>
                                <div className="text-[10px] text-slate-500 uppercase tracking-wide mb-0.5">👁 Eye Tracking <span className="text-cyan-500/70">(gaze_model.pkl)</span></div>
                                <div className={`text-sm font-semibold ${isNormal ? "text-emerald-300" : "text-amber-300"}`}>
                                  {eyeStatus}
                                </div>
                                <div className="text-[10px] text-slate-500 mt-0.5">{eyeViolations} violations detected</div>
                              </div>
                              <Badge variant={isNormal ? "green" : "amber"}>
                                {isNormal ? "Normal" : "Warning"}
                              </Badge>
                            </div>
                          );
                        })()}
                        {/* Face */}
                        {(() => {
                          const isNormal = faceStatus === "Normal" || faceStatus === "Waiting...";
                          return (
                            <div className={`flex items-center justify-between p-3 rounded-lg border ${isNormal ? "bg-emerald-500/5 border-emerald-500/20" : "bg-red-500/5 border-red-500/20"}`}>
                              <div>
                                <div className="text-[10px] text-slate-500 uppercase tracking-wide mb-0.5">🧑 Face Detection <span className="text-blue-500/70">(MediaPipe)</span></div>
                                <div className={`text-sm font-semibold ${isNormal ? "text-emerald-300" : "text-red-300"}`}>
                                  {faceStatus === "Normal" ? "1 Person · Verified" : faceStatus}
                                </div>
                                <div className="text-[10px] text-slate-500 mt-0.5">{faceViolations} violations detected</div>
                              </div>
                              <Badge variant={isNormal ? "green" : "red"}>
                                {isNormal ? "Verified" : "Alert"}
                              </Badge>
                            </div>
                          );
                        })()}
                        {/* Voice */}
                        {(() => {
                          const isNormal = voiceStatus === "Normal" || voiceStatus === "Waiting...";
                          return (
                            <div className={`flex items-center justify-between p-3 rounded-lg border ${isNormal ? "bg-emerald-500/5 border-emerald-500/20" : "bg-amber-500/5 border-amber-500/20"}`}>
                              <div>
                                <div className="text-[10px] text-slate-500 uppercase tracking-wide mb-0.5">🎤 Voice Analysis <span className="text-purple-500/70">(sounddevice)</span></div>
                                <div className={`text-sm font-semibold ${isNormal ? "text-emerald-300" : "text-amber-300"}`}>
                                  {voiceStatus}
                                </div>
                                <div className="text-[10px] text-slate-500 mt-0.5">
                                  {voiceViolations} violations · Level: {audioLevel.toFixed(1)}
                                </div>
                              </div>
                              <Badge variant={isNormal ? "green" : "amber"}>
                                {isNormal ? "Clear" : "Noise"}
                              </Badge>
                            </div>
                          );
                        })()}
                      </div>
                    </Card>
                  </motion.div>
                </div>
              </div>

              {/* Event log */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                <Card>
                  <CardHeader
                    title="Live Event Log"
                    right={<span className="text-[10px] text-slate-500 font-mono">{formatTime(elapsed)}</span>}
                  />
                  <div className="max-h-44 overflow-y-auto space-y-1.5">
                    {log.length === 0 ? (
                      <div className="text-sm text-slate-500 text-center py-6">Waiting for AI analysis results...</div>
                    ) : (
                      log.map((e, i) => (
                        <Alert key={i} type={e.type} className="animate-slide-right">{e.msg}</Alert>
                      ))
                    )}
                  </div>
                </Card>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
    </ProtectedRoute>
  );
}

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
import { PageHeader } from "@/components/ui/PageHeader";
import { getRiskLevel, formatTime } from "@/lib/utils";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import { startSession, stopSession, processFrame, getLiveData, checkHealth } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useAudioMonitor } from "@/hooks/useAudioMonitor";
import {
  Camera, Mic, Eye, User, Clock, Play, Square, Settings,
  ClipboardCheck, Zap, Monitor, Volume2
} from "lucide-react";

function getRiskBarColor(score: number) {
  if (score < 30) return "linear-gradient(90deg,#10b981,#34d399)";
  if (score < 60) return "linear-gradient(90deg,#10b981,#f59e0b)";
  return "linear-gradient(90deg,#f59e0b,#ef4444)";
}

function normalizeScore(score: number): number {
  return Math.min(100, Math.round(score * 10));
}

type PagePhase = "instructions" | "connecting" | "monitoring";

export default function InterviewPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [phase, setPhase] = useState<PagePhase>("instructions");
  const [backendConnected, setBackendConnected] = useState(false);
  const [voiceAvailable, setVoiceAvailable] = useState(false);
  const [sessionActive, setSessionActive] = useState(false);

  const [riskScore, setRiskScore] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [eyeStatus, setEyeStatus] = useState("Waiting...");
  const [faceStatus, setFaceStatus] = useState("Waiting...");
  const [voiceStatus, setVoiceStatus] = useState("Waiting...");
  const [eyeViolations, setEyeViolations] = useState(0);
  const [faceViolations, setFaceViolations] = useState(0);
  const [voiceViolations, setVoiceViolations] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [browserAudioLevel, setBrowserAudioLevel] = useState(0);
  const [log, setLog] = useState<{ type: "ok" | "warn" | "err"; msg: string }[]>([]);
  const processingRef = useRef(false);
  const browserVoiceViolationsRef = useRef(0);

  const level = getRiskLevel(riskScore);

  // Browser-side audio monitoring via Web Audio API
  const audioMonitor = useAudioMonitor({
    threshold: 18,
    interval: 250,
    onLevel: (lvl) => setBrowserAudioLevel(lvl),
    onNoiseDetected: (lvl) => {
      browserVoiceViolationsRef.current += 1;
      // If backend voice isn't detecting, use browser detection
      if (voiceStatus === "Normal" || voiceStatus === "Waiting...") {
        setVoiceStatus("Background voice detected");
        setAudioLevel(lvl);
        setVoiceViolations((v) => v + 1);
      }
    },
  });

  const handleStartMonitoring = useCallback(async () => {
    setPhase("connecting");

    const health = await checkHealth();
    const connected = !!health;
    setBackendConnected(connected);

    if (connected) {
      const res = await startSession(user?.id);
      if (res.status === "started") {
        setSessionActive(true);
        setVoiceAvailable(res.voice_available);
        toast.success("AI monitoring activated");
      } else {
        toast.error("Failed to start backend session. Using demo mode.");
      }
    } else {
      toast("Backend not running — using demo mode");
    }

    // Start browser-side audio monitoring
    audioMonitor.start();

    setPhase("monitoring");
  }, [user?.id, audioMonitor]);

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
        // Use backend voice status if it detected something, otherwise keep browser detection
        if (result.voice.status !== "Normal" || voiceStatus === "Waiting...") {
          setVoiceStatus(result.voice.status);
        }
        setEyeViolations(result.eye.violations);
        setFaceViolations(result.face.violations);
        // Use the higher violation count between backend and browser
        setVoiceViolations(Math.max(result.voice.violations, browserVoiceViolationsRef.current));
        setRiskScore(normalizeScore(result.risk.score));
        setElapsed(result.elapsed);
        if (result.voice.audio_level !== undefined && result.voice.audio_level > 0) {
          setAudioLevel(result.voice.audio_level);
        }
      }
    } catch {
      // Silently handle network errors
    }

    processingRef.current = false;
  }, [backendConnected, sessionActive]);

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

  useEffect(() => {
    if (phase !== "monitoring" || backendConnected) return;

    const dirs = ["Forward — Stable", "Forward — Stable", "Looking Left", "Looking Right", "Forward — Stable"];
    const voices = ["Normal", "Normal", "Background voice detected", "Normal"];
    const simAlerts: { type: "ok" | "warn" | "err"; msg: string }[] = [
      { type: "warn", msg: "Background noise detected — volume 4.2" },
      { type: "ok", msg: "Face verification successful" },
      { type: "warn", msg: "Gaze deviation — right side (2.3s)" },
      { type: "ok", msg: "Session stable — low risk" },
      { type: "err", msg: "Multiple gaze deviations — streak of 3" },
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

  const endSession = async () => {
    // Stop browser audio monitoring
    audioMonitor.stop();

    if (backendConnected && sessionActive) {
      toast("Stopping session...");
      const res = await stopSession(user?.id);
      if (res.status === "stopped") {
        toast.success(`Session ended. ${res.summary.total_records} data points recorded.`);
      }
    } else {
      toast.success("Session ended. Generating report...");
    }
    setTimeout(() => router.push("/feedback"), 1200);
  };

  // Reset browser voice status after 1.5s of no noise
  useEffect(() => {
    if (!audioMonitor.noiseDetected && voiceStatus === "Background voice detected") {
      const timer = setTimeout(() => {
        setVoiceStatus("Normal");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [audioMonitor.noiseDetected, voiceStatus]);

  return (
    <ProtectedRoute>
    <div className="min-h-screen bg-[#080c14] pt-24">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">

        <AnimatePresence mode="wait">
          {/* Instructions Phase */}
          {phase === "instructions" && (
            <motion.div
              key="instructions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto"
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#3b82f6] to-[#06b6d4] flex items-center justify-center mx-auto mb-5 shadow-[0_0_40px_rgba(59,130,246,0.2)]">
                  <Monitor className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-2xl font-bold tracking-[-0.02em] mb-2 text-white">AI Interview Monitoring</h2>
                <p className="text-[#64748b] text-sm">Complete the pre-session checklist below, then click Start to begin.</p>
              </div>

              <Card className="mb-5">
                <CardHeader title="Pre-Session Checklist" right={<ClipboardCheck className="w-4 h-4 text-[#64748b]" />} />
                <div className="space-y-3">
                  {[
                    { icon: <Camera className="w-4 h-4" />, title: "Camera Access", desc: "Your browser will ask for webcam permission. Make sure your face is clearly visible and well-lit." },
                    { icon: <Mic className="w-4 h-4" />, title: "Microphone Access", desc: "Audio will be monitored for background noise. Use a quiet environment with no background voices." },
                    { icon: <Eye className="w-4 h-4" />, title: "Eye Tracking", desc: "Our AI model tracks your gaze direction. Look directly at the screen during the session." },
                    { icon: <User className="w-4 h-4" />, title: "Face Detection", desc: "Stay in frame throughout the session. Don't leave your seat or allow others into the frame." },
                    { icon: <Clock className="w-4 h-4" />, title: "Session Timer", desc: "The monitoring runs in real-time. You can end the session anytime to get your performance report." },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-[#243655] transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-[#3b82f6]/10 border border-[#3b82f6]/20 flex items-center justify-center text-[#06b6d4] flex-shrink-0 mt-0.5">
                        {item.icon}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white">{item.title}</div>
                        <div className="text-xs text-[#64748b] leading-relaxed mt-0.5">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="mb-6">
                <CardHeader title="How It Works" right={<Settings className="w-4 h-4 text-[#64748b]" />} />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { step: "1", icon: <Camera className="w-4 h-4" />, title: "Capture", desc: "Camera & mic activate in your browser" },
                    { step: "2", icon: <Zap className="w-4 h-4" />, title: "Analyze", desc: "AI models process eye, face & voice in real-time" },
                    { step: "3", icon: <ClipboardCheck className="w-4 h-4" />, title: "Report", desc: "Get a detailed performance report with AI feedback" },
                  ].map((s, i) => (
                    <div key={i} className="text-center p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#3b82f6] to-[#06b6d4] flex items-center justify-center mx-auto mb-2 text-white">
                        {s.icon}
                      </div>
                      <div className="text-sm font-semibold text-white">{s.title}</div>
                      <div className="text-[11px] text-[#64748b] mt-1">{s.desc}</div>
                    </div>
                  ))}
                </div>
              </Card>

              <div className="text-center">
                <Button size="lg" onClick={handleStartMonitoring}>
                  <Play className="w-4 h-4" /> Start Monitoring Session
                </Button>
                <p className="text-[11px] text-[#64748b] mt-3">
                  By clicking Start, you allow camera & microphone access for AI analysis.
                </p>
              </div>
            </motion.div>
          )}

          {/* Connecting Phase */}
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
                <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#3b82f6] animate-spin" />
              </div>
              <div className="text-lg font-semibold mb-1 text-white">Initializing AI Systems</div>
              <div className="text-sm text-[#64748b]">Connecting to backend, calibrating microphone...</div>
            </motion.div>
          )}

          {/* Monitoring Phase */}
          {phase === "monitoring" && (
            <motion.div
              key="monitoring"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <PageHeader
                title="Live Interview Session"
                subtitle={`Duration: ${formatTime(elapsed)}${backendConnected ? " · AI Connected" : " · Demo Mode"}${voiceAvailable ? " · Mic Active" : ""}`}
                badge={<Badge variant="red"><span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" /> RECORDING</Badge>}
                actions={
                  <Button variant="outline" size="sm" onClick={endSession}>
                    <Square className="w-3.5 h-3.5" /> End Session
                  </Button>
                }
              />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                {/* Camera */}
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
                        <div className="text-xs text-[#64748b] mt-1 mb-4">Risk Score (0-100)</div>
                        <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{ width: `${riskScore}%`, background: getRiskBarColor(riskScore) }}
                          />
                        </div>
                        <div className="flex justify-between text-[10px] text-[#64748b] mt-1.5 font-mono">
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
                            <div className={`flex items-center justify-between p-3 rounded-xl border ${isNormal ? "bg-emerald-500/[0.04] border-emerald-500/15" : "bg-amber-500/[0.04] border-amber-500/15"}`}>
                              <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isNormal ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"}`}>
                                  <Eye className="w-4 h-4" />
                                </div>
                                <div>
                                  <div className="text-[10px] text-[#64748b] uppercase tracking-wide mb-0.5">Eye Tracking</div>
                                  <div className={`text-sm font-semibold ${isNormal ? "text-emerald-300" : "text-amber-300"}`}>
                                    {eyeStatus}
                                  </div>
                                  <div className="text-[10px] text-[#64748b] mt-0.5">{eyeViolations} violations detected</div>
                                </div>
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
                            <div className={`flex items-center justify-between p-3 rounded-xl border ${isNormal ? "bg-emerald-500/[0.04] border-emerald-500/15" : "bg-red-500/[0.04] border-red-500/15"}`}>
                              <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isNormal ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
                                  <User className="w-4 h-4" />
                                </div>
                                <div>
                                  <div className="text-[10px] text-[#64748b] uppercase tracking-wide mb-0.5">Face Detection</div>
                                  <div className={`text-sm font-semibold ${isNormal ? "text-emerald-300" : "text-red-300"}`}>
                                    {faceStatus === "Normal" ? "1 Person · Verified" : faceStatus}
                                  </div>
                                  <div className="text-[10px] text-[#64748b] mt-0.5">{faceViolations} violations detected</div>
                                </div>
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
                          const displayLevel = browserAudioLevel > 0 ? browserAudioLevel : audioLevel;
                          return (
                            <div className={`flex items-center justify-between p-3 rounded-xl border ${isNormal ? "bg-emerald-500/[0.04] border-emerald-500/15" : "bg-amber-500/[0.04] border-amber-500/15"}`}>
                              <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isNormal ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"}`}>
                                  <Mic className="w-4 h-4" />
                                </div>
                                <div className="flex-1">
                                  <div className="text-[10px] text-[#64748b] uppercase tracking-wide mb-0.5">Voice Analysis</div>
                                  <div className={`text-sm font-semibold ${isNormal ? "text-emerald-300" : "text-amber-300"}`}>
                                    {voiceStatus}
                                  </div>
                                  <div className="text-[10px] text-[#64748b] mt-0.5">
                                    {voiceViolations} violations · Level: {displayLevel.toFixed(1)}
                                  </div>
                                  {/* Live audio level bar */}
                                  {audioMonitor.active && (
                                    <div className="mt-2 flex items-center gap-2">
                                      <Volume2 className="w-3 h-3 text-[#64748b] flex-shrink-0" />
                                      <div className="flex-1 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                                        <div
                                          className="h-full rounded-full transition-all duration-150"
                                          style={{
                                            width: `${Math.min(100, browserAudioLevel)}%`,
                                            background: browserAudioLevel > 18
                                              ? "linear-gradient(90deg, #f59e0b, #ef4444)"
                                              : "linear-gradient(90deg, #10b981, #34d399)",
                                          }}
                                        />
                                      </div>
                                      <span className="text-[9px] font-mono text-[#64748b] w-6 text-right flex-shrink-0">
                                        {browserAudioLevel}
                                      </span>
                                    </div>
                                  )}
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
                    right={<span className="text-[10px] text-[#64748b] font-mono">{formatTime(elapsed)}</span>}
                  />
                  <div className="max-h-44 overflow-y-auto space-y-1.5">
                    {log.length === 0 ? (
                      <div className="text-sm text-[#64748b] text-center py-6">Waiting for AI analysis results...</div>
                    ) : (
                      log.map((e, i) => (
                        <Alert key={i} type={e.type} className={i === 0 ? "animate-slide-right" : ""}>{e.msg}</Alert>
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

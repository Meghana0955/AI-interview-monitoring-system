"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  AlertTriangle,
  Brain,
  Camera,
  Clock,
  Database,
  Eye,
  FileCheck,
  Lightbulb,
  Mic,
  MonitorPlay,
  Play,
  Shield,
  TrendingUp,
  User,
  UserPlus,
  Zap,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const features = [
  {
    icon: <Eye className="h-5 w-5" />,
    title: "Eye Tracking Monitor",
    bold: "Real-time gaze analysis.",
    desc: " Detects off-screen behavior, multiple monitor usage, and suspicious visual patterns using ML-based pupil tracking.",
    visual: "eye",
    color: "#06b6d4", // cyan — eye tracking
  },
  {
    icon: <User className="h-5 w-5" />,
    title: "Face Detection & Identity",
    bold: "Continuous facial verification.",
    desc: " Identity consistency checks and multi-person detection using deep learning facial recognition models.",
    visual: "face",
    color: "#3b82f6", // blue — face detection
  },
  {
    icon: <Mic className="h-5 w-5" />,
    title: "Voice Analysis Engine",
    bold: "Background noise detection.",
    desc: " Multiple speaker identification and speech pattern analysis to ensure a controlled environment.",
    visual: "voice",
    color: "#8b5cf6", // purple — voice/audio
  },
  {
    icon: <AlertTriangle className="h-5 w-5" />,
    title: "Risk Scoring Engine",
    bold: "Dynamic composite risk calculation.",
    desc: " Aggregates all violation signals into a real-time score with trend analysis and threshold alerting.",
    visual: "risk",
    color: "#f59e0b", // amber — risk scores
  },
  {
    icon: <Brain className="h-5 w-5" />,
    title: "Behavioral Intelligence",
    bold: "Advanced pattern recognition.",
    desc: " Analyzes behavioral sequences over time to identify anomalies and suspicious activity clusters.",
    visual: "brain",
    color: "#3b82f6", // blue — active module
  },
  {
    icon: <Lightbulb className="h-5 w-5" />,
    title: "Smart Feedback System",
    bold: "AI-generated recommendations.",
    desc: " Personalized improvement suggestions based on session performance with trend comparisons.",
    visual: "feedback",
    color: "#10b981", // green — success/verified
  },
];

const stats = [
  { value: "98.7%", label: "Detection Accuracy" },
  { value: "12ms", label: "Response Latency" },
  { value: "6", label: "AI Modules" },
  { value: "24/7", label: "Real-time Monitoring" },
];

const howItWorks = [
  {
    step: "01",
    icon: <UserPlus className="h-6 w-6" />,
    title: "Sign Up & Login",
    desc: "Create your account in seconds and access the monitoring platform with role-based permissions.",
  },
  {
    step: "02",
    icon: <MonitorPlay className="h-6 w-6" />,
    title: "Start AI Session",
    desc: "Launch a monitored interview session with real-time webcam, audio, and behavioral tracking powered by 6 AI modules.",
  },
  {
    step: "03",
    icon: <FileCheck className="h-6 w-6" />,
    title: "Get AI Feedback",
    desc: "Receive comprehensive reports with risk analysis, violation breakdowns, and personalized improvement suggestions.",
  },
];

const whyChoose = [
  {
    icon: <Shield className="h-5 w-5" />,
    title: "Exam Integrity Guaranteed",
    desc: "Multi-layered AI detection ensures every interview is fair, secure, and tamper-proof.",
  },
  {
    icon: <TrendingUp className="h-5 w-5" />,
    title: "Data-Driven Insights",
    desc: "Transform raw behavioral data into actionable performance metrics with trend analysis.",
  },
  {
    icon: <Clock className="h-5 w-5" />,
    title: "Real-Time Processing",
    desc: "12ms response latency ensures instant detection and alerting with zero delay.",
  },
];

const archSteps = [
  { icon: <Camera className="h-4 w-4" />, label: "Webcam Input", sub: "Video + Audio" },
  { icon: <Brain className="h-4 w-4" />, label: "AI Modules", sub: "Eye · Face · Voice" },
  { icon: <Zap className="h-4 w-4" />, label: "Risk Engine", sub: "Composite Scoring" },
  { icon: <Database className="h-4 w-4" />, label: "Behavioral DB", sub: "Session Storage" },
  { icon: <Lightbulb className="h-4 w-4" />, label: "Feedback API", sub: "Smart Reports" },
];

function CardVisual({ type }: { type: string }) {
  if (type === "eye") {
    return (
      <div className="mt-4 flex h-28 items-center justify-center rounded-xl border border-[#1e2d47] bg-[#0d1524] p-4">
        <div className="relative flex items-center justify-center">
          <div className="absolute h-24 w-24 rounded-full border border-[#06b6d4]/25" />
          <div className="absolute h-16 w-16 rounded-full border border-[#06b6d4]/40" />
          <div className="h-8 w-8 rounded-full bg-[#06b6d4]/80 shadow-[0_0_24px_rgba(6,182,212,0.7)]" />
          <div className="absolute h-3 w-3 rounded-full bg-white/80 -translate-x-2 -translate-y-2" />
        </div>
      </div>
    );
  }

  if (type === "face") {
    return (
      <div className="mt-4 flex h-28 items-center justify-center rounded-xl border border-[#1e2d47] bg-[#0d1524] p-4">
        <div className="relative">
          <div className="flex h-20 w-16 items-center justify-center rounded-2xl border border-[#1e2d47] bg-gradient-to-b from-[#101828] to-[#0d1524]">
            <div className="h-10 w-10 rounded-full border border-[#3b82f6]/30 bg-gradient-to-br from-[#3b82f6]/40 to-[#06b6d4]/20" />
          </div>
          <div className="absolute -right-1 -top-1 rounded-full bg-[#3b82f6] px-2 py-0.5 text-[10px] font-semibold text-white">Verified</div>
        </div>
      </div>
    );
  }

  if (type === "voice") {
    return (
      <div className="mt-4 flex h-28 items-end justify-center gap-1.5 rounded-xl border border-[#1e2d47] bg-[#0d1524] p-4">
        {[3, 5, 8, 12, 9, 6, 10, 14, 7, 4, 9, 11, 6, 3].map((h, i) => (
          <div
            key={i}
            className="w-1.5 rounded-full bg-gradient-to-t from-[#8b5cf6] to-[#06b6d4]"
            style={{ height: `${h * 4}px`, opacity: 0.5 + (i % 3) * 0.2 }}
          />
        ))}
      </div>
    );
  }

  if (type === "risk") {
    return (
      <div className="mt-4 flex h-28 flex-col justify-between rounded-xl border border-[#1e2d47] bg-[#0d1524] p-4">
        <div className="flex justify-between font-mono text-[10px] text-[#64748b]">
          <span>RISK SCORE</span>
          <span>LIVE</span>
        </div>
        <div>
          <div className="h-1.5 overflow-hidden rounded-full bg-[#1e2d47]">
            <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-[#f59e0b] to-[#ef4444]" />
          </div>
          <div className="mt-1.5 flex justify-between text-[10px]">
            <span className="text-[#64748b]">0</span>
            <span className="font-mono font-bold text-[#f59e0b]">72 / 100</span>
          </div>
        </div>
        <div className="flex gap-2">
          {['Low', 'Med', 'High'].map((label, i) => (
            <span
              key={label}
              className={`flex-1 rounded-md border py-1 text-center text-[9px] ${
                i === 0 ? 'border-[#10b981]/50 bg-[#10b981]/10 text-[#10b981]' :
                i === 1 ? 'border-[#f59e0b]/60 bg-[#f59e0b]/10 text-[#f59e0b]' :
                'border-[#1e2d47] text-[#64748b]'
              }`}
            >
              {label}
            </span>
          ))}
        </div>
      </div>
    );
  }

  if (type === "brain") {
    return (
      <div className="mt-4 flex h-28 items-center justify-center rounded-xl border border-[#1e2d47] bg-[#0d1524] p-4">
        <div className="relative h-16 w-24">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="absolute h-2 w-2 rounded-full bg-[#3b82f6]"
              style={{
                left: `${[48, 20, 72, 28, 60][i]}px`,
                top: `${[8, 30, 28, 54, 52][i]}px`,
                boxShadow: '0 0 10px rgba(59,130,246,0.8)',
              }}
            />
          ))}
          {[[0, 1], [0, 2], [1, 3], [2, 4], [3, 4]].map(([a, b], i) => {
            const pts = [[52, 12], [24, 34], [76, 32], [32, 58], [64, 56]];
            return (
              <svg key={i} className="pointer-events-none absolute inset-0 h-16 w-24" style={{ left: 0, top: 0 }}>
                <line x1={pts[a][0]} y1={pts[a][1]} x2={pts[b][0]} y2={pts[b][1]} stroke="rgba(59,130,246,0.3)" strokeWidth="1" />
              </svg>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 flex h-28 flex-wrap content-start gap-1.5 rounded-xl border border-[#1e2d47] bg-[#0d1524] p-4">
      {['Accuracy', 'Risk', 'Speed', 'Pattern', 'Alert', 'Report', 'AI Score', 'Trend'].map((label) => (
        <span key={label} className="rounded-full border border-[#10b981]/25 bg-[#10b981]/10 px-2 py-1 text-[9px] text-[#10b981]">
          {label}
        </span>
      ))}
    </div>
  );
}

export default function LandingPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#080c14] text-[#e2e8f0] antialiased">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-10rem] h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-[#06b6d4]/[0.07] blur-[160px]" />
        <div className="absolute right-[-8rem] top-[22rem] h-[24rem] w-[24rem] rounded-full bg-[#3b82f6]/[0.07] blur-[140px]" />
        <div className="absolute bottom-[-10rem] left-[-8rem] h-[28rem] w-[28rem] rounded-full bg-[#8b5cf6]/[0.05] blur-[160px]" />
      </div>

      <nav className="fixed left-1/2 top-4 z-50 flex h-16 w-[calc(100%-1.5rem)] max-w-5xl -translate-x-1/2 items-center justify-between rounded-2xl border border-[#1e2d47] bg-[rgba(16,24,40,0.84)] px-4 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-2xl md:px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#06b6d4] via-[#3b82f6] to-[#3b82f6] text-[10px] font-bold text-white shadow-[0_0_20px_rgba(6,182,212,0.4)]">AI</div>
          <span className="hidden text-sm font-bold tracking-widest text-[#94a3b8] sm:inline">AISMS</span>
        </div>
        <div className="hidden items-center gap-1 md:flex">
          {['Features', 'Pipeline', 'About'].map((item) => (
            <button
              key={item}
              onClick={() => document.getElementById(item.toLowerCase())?.scrollIntoView({ behavior: 'smooth' })}
              className="rounded-full px-4 py-2 text-sm text-[#94a3b8] transition-colors duration-300 hover:bg-white/[0.04] hover:text-[#e2e8f0]"
            >
              {item}
            </button>
          ))}
        </div>
        <Link
          href={isAuthenticated ? '/interview' : '/login'}
          className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#3b82f6] via-[#06b6d4] to-[#3b82f6] px-5 py-2 text-sm font-semibold text-white shadow-[0_4px_20px_rgba(59,130,246,0.4)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_34px_rgba(6,182,212,0.45)]"
        >
          {isAuthenticated ? 'Dashboard' : 'Sign Up'}
        </Link>
      </nav>

      <section className="relative overflow-hidden px-6 pb-16 pt-36 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(6,182,212,0.12),transparent)]" />
        <div className="relative z-10 mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#1e2d47] bg-[#101828]/60 px-4 py-1.5 text-xs text-[#94a3b8] backdrop-blur-xl"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#06b6d4] shadow-[0_0_8px_rgba(6,182,212,0.9)]" />
            Welcome to the AI Platform
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-5 text-4xl font-bold leading-[1.05] tracking-[-0.03em] text-[#e2e8f0] sm:text-5xl lg:text-6xl"
          >
            Unlock Potential With<br />
            <span className="bg-gradient-to-r from-[#06b6d4] via-[#3b82f6] to-[#8b5cf6] bg-clip-text text-transparent">
              AI-Smart Monitoring System
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mx-auto mb-8 max-w-xl text-sm leading-relaxed text-[#64748b] sm:text-base"
          >
            Comprehensive interview monitoring, behavioral analysis, and real-world AI applications.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-3"
          >
            <Link
              href={isAuthenticated ? '/interview' : '/login'}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#3b82f6] via-[#06b6d4] to-[#3b82f6] px-7 py-3 text-sm font-semibold text-white shadow-[0_4px_24px_rgba(59,130,246,0.42)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_34px_rgba(6,182,212,0.52)]"
            >
              <Play className="h-4 w-4" /> Get Started
            </Link>
            <button
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className="flex items-center gap-2 rounded-xl border border-[#1e2d47] bg-[#101828]/60 px-7 py-3 text-sm font-medium text-[#94a3b8] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-[#243655] hover:text-[#e2e8f0]"
            >
              Explore Features <ArrowRight className="h-4 w-4" />
            </button>
          </motion.div>
        </div>
      </section>

      <div className="px-6 pb-4">
        <div className="mx-auto grid max-w-5xl grid-cols-2 overflow-hidden rounded-2xl border border-[#1e2d47] bg-[#101828]/60 backdrop-blur-xl md:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className={`border-b border-[#1e2d47] px-6 py-6 text-center md:border-b-0 ${i < 3 ? 'md:border-r md:border-[#1e2d47]' : ''}`}
            >
              <div className="text-2xl font-bold tracking-tight text-[#e2e8f0] sm:text-3xl" style={{ textShadow: '0 0 20px rgba(6,182,212,0.4)' }}>
                {s.value}
              </div>
              <div className="mt-1 text-[10px] uppercase tracking-[0.2em] text-[#64748b]">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      <section id="features" className="mx-auto max-w-5xl px-6 py-16">
        <div className="mb-10">
          <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#06b6d4]">Core Modules</div>
          <h2 className="text-2xl font-bold tracking-[-0.03em] text-[#e2e8f0] sm:text-3xl">Six AI Intelligence Layers</h2>
          <p className="mt-2 max-w-lg text-sm text-[#64748b]">Multi-modal behavioral analysis combining computer vision, audio processing, and predictive risk modeling.</p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.07 }}
              className="theme-panel theme-panel-hover theme-glow group relative overflow-hidden rounded-2xl p-5"
            >
              <div className="relative z-10">
                <div className="mb-3 flex items-start justify-between">
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-xl"
                    style={{
                      border: `1px solid ${f.color}30`,
                      background: `${f.color}15`,
                      color: f.color,
                      boxShadow: `0 0 18px ${f.color}15`,
                    }}
                  >
                    {f.icon}
                  </div>
                  <span className="text-[9px] font-mono tracking-widest text-[#64748b]">0{i + 1}</span>
                </div>
                <h3 className="mb-1.5 text-sm font-semibold text-[#e2e8f0]">{f.title}</h3>
                <p className="text-xs leading-relaxed text-[#64748b]">
                  <span className="font-medium text-[#94a3b8]">{f.bold}</span>{f.desc}
                </p>
                <CardVisual type={f.visual} />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="pipeline" className="mx-auto max-w-5xl px-6 pb-16">
        <div className="mb-8">
          <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#3b82f6]">System Architecture</div>
          <h2 className="text-2xl font-bold tracking-[-0.03em] text-[#e2e8f0] sm:text-3xl">Processing Pipeline</h2>
          <p className="mt-2 text-sm text-[#64748b]">From raw sensor inputs to intelligent behavioral reports, all in real time.</p>
        </div>

        <div className="theme-panel rounded-2xl p-6">
          <div className="mb-6 flex flex-wrap items-center justify-center gap-2">
            {archSteps.map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="flex min-w-[90px] flex-col items-center gap-1.5 rounded-xl border border-[#1e2d47] bg-[#0d1524] px-4 py-3 text-center transition-colors hover:border-[#243655]">
                  <span className="text-[#3b82f6]">{s.icon}</span>
                  <span className="text-[11px] font-semibold text-[#e2e8f0]">{s.label}</span>
                  <span className="text-[9px] text-[#64748b]">{s.sub}</span>
                </div>
                {i < archSteps.length - 1 && <ArrowRight className="hidden h-3 w-3 flex-shrink-0 text-[#1e2d47] sm:block" />}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              { label: 'Backend', value: 'Flask REST API · Python AI Stack' },
              { label: 'Frontend', value: 'Next.js · Tailwind CSS · WebSocket' },
              { label: 'AI Models', value: 'OpenCV · MediaPipe · TensorFlow' },
            ].map((t, i) => (
              <div key={i} className="rounded-xl border border-[#1e2d47] bg-[#0d1524] px-4 py-3">
                <div className="mb-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#64748b]">{t.label}</div>
                <div className="text-xs font-medium text-[#94a3b8]">{t.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[#1e2d47] bg-[#0a101a]">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <div className="mb-10 text-center">
            <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#06b6d4]">Getting Started</div>
            <h2 className="text-2xl font-bold tracking-[-0.03em] text-[#e2e8f0] sm:text-3xl">How It Works</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-[#64748b]">Get up and running in three simple steps.</p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {howItWorks.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.1 }}
                className="theme-panel theme-panel-hover theme-glow relative rounded-2xl p-5 text-center"
              >
                <div className="mb-3 text-[10px] font-mono font-bold tracking-widest text-[#3b82f6]">STEP {item.step}</div>
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-[#3b82f6]/25 bg-[#3b82f6]/10 text-[#3b82f6]">
                  {item.icon}
                </div>
                <h3 className="mb-2 text-sm font-semibold text-[#e2e8f0]">{item.title}</h3>
                <p className="text-xs leading-relaxed text-[#64748b]">{item.desc}</p>
                {i < howItWorks.length - 1 && (
                  <div className="absolute -right-2 top-1/2 z-10 hidden -translate-y-1/2 md:block">
                    <ArrowRight className="h-4 w-4 text-[#1e2d47]" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="mx-auto max-w-5xl px-6 py-16">
        <div className="mb-10 text-center">
          <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#10b981]">Why AISMS</div>
          <h2 className="text-2xl font-bold tracking-[-0.03em] text-[#e2e8f0] sm:text-3xl">Built for Integrity at Scale</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-[#64748b]">A purpose-built monitoring platform combining cutting-edge AI with seamless UX.</p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {whyChoose.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.08 }}
              className="theme-panel theme-panel-hover theme-glow rounded-2xl p-5"
            >
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl border border-[#10b981]/25 bg-[#10b981]/10 text-[#10b981]">
                {item.icon}
              </div>
              <h3 className="mb-1.5 text-sm font-semibold text-[#e2e8f0]">{item.title}</h3>
              <p className="text-xs leading-relaxed text-[#64748b]">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <div className="border-t border-[#1e2d47] bg-[#0a101a]">
        <div className="relative overflow-hidden py-14 text-center">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_50%_50%,rgba(59,130,246,0.08),transparent)]" />
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative z-10">
            <p className="mb-5 text-sm text-[#64748b]">Ready to monitor your next interview session?</p>
            <Link
              href={isAuthenticated ? '/interview' : '/login'}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#3b82f6] via-[#06b6d4] to-[#3b82f6] px-8 py-3 text-sm font-semibold text-white shadow-[0_4px_24px_rgba(59,130,246,0.4)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_34px_rgba(6,182,212,0.52)]"
            >
              {isAuthenticated ? 'Launch Monitoring System' : 'Get Started Free'} <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>

        <div className="border-t border-[#1e2d47] py-6 text-center">
          <div className="mb-1 flex items-center justify-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded-md bg-gradient-to-br from-[#06b6d4] to-[#3b82f6] text-[8px] font-bold text-white">AI</div>
            <span className="text-[10px] font-bold tracking-[0.2em] text-[#64748b]">AISMS</span>
          </div>
          <p className="text-[10px] text-[#64748b]/60">AI-Powered Interview Monitoring & Behavioral Analysis System</p>
        </div>
      </div>
    </div>
  );
}

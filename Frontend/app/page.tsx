"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Eye, User, Mic, AlertTriangle, Brain, Lightbulb,
  Camera, Zap, Database, Play, BarChart, UserPlus,
  MonitorPlay, FileCheck, Shield, TrendingUp, Clock,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

/* ─── Data ────────────────────────────────────────────── */
const features = [
  {
    icon: <Eye className="w-5 h-5" />,
    title: "Eye Tracking Monitor",
    bold: "Real-time gaze analysis.",
    desc: " Detects off-screen behavior, multiple monitor usage, and suspicious visual patterns using ML-based pupil tracking.",
    accent: "#7c3aed",
    visual: "eye",
  },
  {
    icon: <User className="w-5 h-5" />,
    title: "Face Detection & Identity",
    bold: "Continuous facial verification.",
    desc: " Identity consistency checks and multi-person detection using deep learning facial recognition models.",
    accent: "#7c3aed",
    visual: "face",
  },
  {
    icon: <Mic className="w-5 h-5" />,
    title: "Voice Analysis Engine",
    bold: "Background noise detection.",
    desc: " Multiple speaker identification and speech pattern analysis to ensure a controlled environment.",
    accent: "#7c3aed",
    visual: "voice",
  },
  {
    icon: <AlertTriangle className="w-5 h-5" />,
    title: "Risk Scoring Engine",
    bold: "Dynamic composite risk calculation.",
    desc: " Aggregates all violation signals into a real-time score with trend analysis and threshold alerting.",
    accent: "#7c3aed",
    visual: "risk",
  },
  {
    icon: <Brain className="w-5 h-5" />,
    title: "Behavioral Intelligence",
    bold: "Advanced pattern recognition.",
    desc: " Analyzes behavioral sequences over time to identify anomalies and suspicious activity clusters.",
    accent: "#7c3aed",
    visual: "brain",
  },
  {
    icon: <Lightbulb className="w-5 h-5" />,
    title: "Smart Feedback System",
    bold: "AI-generated recommendations.",
    desc: " Personalized improvement suggestions based on session performance with trend comparisons.",
    accent: "#7c3aed",
    visual: "feedback",
  },
];

const stats = [
  { value: "98.7%", label: "Detection Accuracy" },
  { value: "12ms",  label: "Response Latency"   },
  { value: "6",     label: "AI Modules"          },
  { value: "24/7",  label: "Real-time Monitoring"},
];

const howItWorks = [
  {
    step: "01",
    icon: <UserPlus className="w-6 h-6" />,
    title: "Sign Up & Login",
    desc: "Create your account in seconds and access the monitoring platform with role-based permissions.",
  },
  {
    step: "02",
    icon: <MonitorPlay className="w-6 h-6" />,
    title: "Start AI Session",
    desc: "Launch a monitored interview session with real-time webcam, audio, and behavioral tracking powered by 6 AI modules.",
  },
  {
    step: "03",
    icon: <FileCheck className="w-6 h-6" />,
    title: "Get AI Feedback",
    desc: "Receive comprehensive reports with risk analysis, violation breakdowns, and personalized improvement suggestions.",
  },
];

const whyChoose = [
  {
    icon: <Shield className="w-5 h-5" />,
    title: "Exam Integrity Guaranteed",
    desc: "Multi-layered AI detection ensures every interview is fair, secure, and tamper-proof.",
  },
  {
    icon: <TrendingUp className="w-5 h-5" />,
    title: "Data-Driven Insights",
    desc: "Transform raw behavioral data into actionable performance metrics with trend analysis.",
  },
  {
    icon: <Clock className="w-5 h-5" />,
    title: "Real-Time Processing",
    desc: "12ms response latency ensures instant detection and alerting with zero delay.",
  },
];

const archSteps = [
  { icon: <Camera className="w-4 h-4" />,   label: "Webcam Input",  sub: "Video + Audio"      },
  { icon: <Brain className="w-4 h-4" />,    label: "AI Modules",    sub: "Eye · Face · Voice" },
  { icon: <Zap className="w-4 h-4" />,      label: "Risk Engine",   sub: "Composite Scoring"  },
  { icon: <Database className="w-4 h-4" />, label: "Behavioral DB", sub: "Session Storage"    },
  { icon: <Lightbulb className="w-4 h-4" />,label: "Feedback API",  sub: "Smart Reports"      },
];

/* ─── Card visual accents (inline mini-graphics) ──────── */
function CardVisual({ type }: { type: string }) {
  if (type === "eye") return (
    <div className="mt-4 rounded-xl bg-[#0d0d14] border border-white/5 p-4 flex items-center justify-center h-28">
      <div className="relative flex items-center justify-center">
        <div className="absolute w-24 h-24 rounded-full border border-[#7c3aed]/20" />
        <div className="absolute w-16 h-16 rounded-full border border-[#7c3aed]/30" />
        <div className="w-8 h-8 rounded-full bg-[#7c3aed]/80 shadow-[0_0_24px_rgba(124,58,237,0.7)]" />
        <div className="absolute w-3 h-3 rounded-full bg-white/80 -translate-x-2 -translate-y-2" />
      </div>
    </div>
  );

  if (type === "face") return (
    <div className="mt-4 rounded-xl bg-[#0d0d14] border border-white/5 p-4 flex items-center justify-center h-28">
      <div className="relative">
        <div className="w-16 h-20 rounded-2xl bg-gradient-to-b from-[#1c1c2e] to-[#0d0d14] border border-white/10 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7c3aed]/40 to-[#3b0764]/40 border border-[#7c3aed]/30" />
        </div>
        <div className="absolute -top-1 -right-1 text-[10px] bg-[#7c3aed] text-white px-2 py-0.5 rounded-full font-semibold">✓ Verified</div>
      </div>
    </div>
  );

  if (type === "voice") return (
    <div className="mt-4 rounded-xl bg-[#0d0d14] border border-white/5 p-4 flex items-end justify-center gap-1.5 h-28">
      {[3, 5, 8, 12, 9, 6, 10, 14, 7, 4, 9, 11, 6, 3].map((h, i) => (
        <div key={i} className="w-1.5 rounded-full bg-gradient-to-t from-[#7c3aed] to-[#a78bfa]" style={{ height: `${h * 4}px`, opacity: 0.5 + (i % 3) * 0.2 }} />
      ))}
    </div>
  );

  if (type === "risk") return (
    <div className="mt-4 rounded-xl bg-[#0d0d14] border border-white/5 p-4 h-28 flex flex-col justify-between">
      <div className="flex justify-between text-[10px] text-white/30 font-mono">
        <span>RISK SCORE</span><span>LIVE</span>
      </div>
      <div>
        <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
          <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-[#7c3aed] to-[#a78bfa]" />
        </div>
        <div className="flex justify-between mt-1.5 text-[10px]">
          <span className="text-white/30">0</span>
          <span className="text-[#a78bfa] font-mono font-bold">72 / 100</span>
        </div>
      </div>
      <div className="flex gap-2">
        {["Low", "Med", "High"].map((l, i) => (
          <span key={l} className={`flex-1 text-center text-[9px] py-1 rounded-md border ${i === 1 ? "border-[#7c3aed]/60 text-[#a78bfa] bg-[#7c3aed]/10" : "border-white/5 text-white/20"}`}>{l}</span>
        ))}
      </div>
    </div>
  );

  if (type === "brain") return (
    <div className="mt-4 rounded-xl bg-[#0d0d14] border border-white/5 p-4 flex items-center justify-center h-28">
      <div className="relative">
        {[0,1,2,3,4].map(i => (
          <div key={i} className="absolute w-2 h-2 rounded-full bg-[#7c3aed]"
            style={{
              left: `${[48,20,72,28,60][i]}px`,
              top: `${[8,30,28,54,52][i]}px`,
              boxShadow: "0 0 10px rgba(124,58,237,0.8)"
            }} />
        ))}
        {[[0,1],[0,2],[1,3],[2,4],[3,4]].map(([a,b],i) => {
          const pts = [[52,12],[24,34],[76,32],[32,58],[64,56]];
          return <svg key={i} className="absolute inset-0 w-24 h-16 pointer-events-none" style={{left:0,top:0}}>
            <line x1={pts[a][0]} y1={pts[a][1]} x2={pts[b][0]} y2={pts[b][1]} stroke="rgba(124,58,237,0.3)" strokeWidth="1" />
          </svg>;
        })}
        <div className="w-24 h-16" />
      </div>
    </div>
  );

  return (
    <div className="mt-4 rounded-xl bg-[#0d0d14] border border-white/5 p-4 h-28 flex flex-wrap gap-1.5 content-start">
      {["Accuracy", "Risk", "Speed", "Pattern", "Alert", "Report", "AI Score", "Trend"].map(c => (
        <span key={c} className="text-[9px] px-2 py-1 rounded-full bg-[#7c3aed]/10 border border-[#7c3aed]/20 text-[#a78bfa]">{c}</span>
      ))}
    </div>
  );
}

/* ─── Component ──────────────────────────────────────── */
export default function LandingPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-[#08080f] text-white font-sans antialiased">

      {/* ── NAV ──────────────────────────────────────────── */}
      <nav className="fixed left-1/2 top-4 z-50 flex h-16 w-[calc(100%-1.5rem)] max-w-5xl -translate-x-1/2 items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 shadow-[0_20px_60px_rgba(0,0,0,0.4)] backdrop-blur-2xl md:px-6">
        <div className="flex items-center gap-2">
          
          <span className="hidden text-sm font-bold tracking-widest text-white/80 sm:inline">AISMS</span>
        </div>
        <div className="hidden md:flex items-center gap-1">
          {["Features", "Pipeline", "About"].map(item => (
            <button key={item} onClick={() => document.getElementById(item.toLowerCase())?.scrollIntoView({ behavior: "smooth" })}
              className="flex items-center gap-1 rounded-full px-4 py-2 text-sm text-white/55 transition-colors hover:bg-white/5 hover:text-white">
              {item}
            </button>
          ))}
        </div>
        <Link href={isAuthenticated ? "/interview" : "/login"}
          className="flex items-center gap-2 rounded-full bg-[#7c3aed] px-5 py-2 text-sm font-semibold text-white shadow-[0_4px_20px_rgba(124,58,237,0.4)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#6d28d9] hover:shadow-[0_4px_28px_rgba(124,58,237,0.6)]">
          {isAuthenticated ? "Dashboard" : "Sign Up"}
        </Link>
      </nav>

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-6 pb-16 pt-36 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(124,58,237,0.15),transparent)]" />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-1/2 top-0 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#7c3aed]/8 blur-[120px]" />
        </div>
        <div className="relative z-10 mx-auto max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs text-white/60 backdrop-blur-xl">
            <span className="h-1.5 w-1.5 rounded-full bg-[#7c3aed] shadow-[0_0_8px_rgba(124,58,237,0.9)]" />
            Welcome to the AI Platform
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-5 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-[-0.03em] leading-[1.05] text-white">
            Unlock Potential With<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a78bfa] via-[#7c3aed] to-[#6d28d9]">AI-Smart Monitoring System</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}
            className="mb-8 text-sm sm:text-base text-white/40 max-w-xl mx-auto leading-relaxed">
            Comprehensive interview monitoring, behavioral analysis, and real-world AI applications.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-3">
            <Link href={isAuthenticated ? "/interview" : "/login"}
              className="flex items-center gap-2 bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-sm font-semibold px-7 py-3 rounded-xl transition-all duration-200 shadow-[0_4px_24px_rgba(124,58,237,0.45)] hover:shadow-[0_6px_32px_rgba(124,58,237,0.6)] hover:-translate-y-0.5">
              <Play className="w-4 h-4" /> Get Started
            </Link>
            <button onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
              className="flex items-center gap-2 border border-white/10 bg-white/5 hover:bg-white/8 text-white/60 hover:text-white text-sm font-medium px-7 py-3 rounded-xl transition-all duration-200 backdrop-blur-xl">
              Explore Features <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────── */}
      <div className="px-6 pb-4">
        <div className="mx-auto max-w-5xl grid grid-cols-2 md:grid-cols-4 rounded-2xl border border-white/[0.07] bg-white/[0.03] overflow-hidden">
          {stats.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className={`px-6 py-6 text-center ${i < 3 ? "border-r border-white/[0.07]" : ""}`}>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-white tracking-tight" style={{ textShadow: "0 0 20px rgba(124,58,237,0.5)" }}>{s.value}</div>
              <div className="mt-1 text-[10px] uppercase tracking-[0.2em] text-white/30">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── FEATURES BENTO ───────────────────────────────── */}
      <section id="features" className="mx-auto max-w-5xl px-6 py-16">
        <div className="mb-10">
          <div className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#7c3aed] mb-2">Core Modules</div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-[-0.03em] text-white">Six AI Intelligence Layers</h2>
          <p className="mt-2 text-sm text-white/35 max-w-lg">Multi-modal behavioral analysis combining computer vision, audio processing, and predictive risk modeling.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.35, delay: i * 0.07 }}
              className="group relative rounded-2xl border border-white/[0.07] bg-[#0e0e1a] p-5 hover:border-[#7c3aed]/30 transition-all duration-300 hover:bg-[#0f0f1e] overflow-hidden">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_top_right,rgba(124,58,237,0.06),transparent_60%)]" />
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#7c3aed]/10 border border-[#7c3aed]/20 text-[#a78bfa]">
                    {f.icon}
                  </div>
                  <span className="text-[9px] font-mono text-white/20 tracking-widest">0{i+1}</span>
                </div>
                <h3 className="text-sm font-semibold text-white mb-1.5">{f.title}</h3>
                <p className="text-xs text-white/35 leading-relaxed">
                  <span className="text-white/60 font-medium">{f.bold}</span>{f.desc}
                </p>
                <CardVisual type={f.visual} />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── PROCESSING PIPELINE ──────────────────────────── */}
      <section id="pipeline" className="mx-auto max-w-5xl px-6 pb-16">
        <div className="mb-8">
          <div className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#7c3aed] mb-2">System Architecture</div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-[-0.03em] text-white">Processing Pipeline</h2>
          <p className="mt-2 text-sm text-white/35">From raw sensor inputs to intelligent behavioral reports — all in real time.</p>
        </div>
        <div className="rounded-2xl border border-white/[0.07] bg-[#0e0e1a] p-6">
          <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
            {archSteps.map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="flex flex-col items-center gap-1.5 min-w-[90px] rounded-xl border border-white/[0.07] bg-[#0d0d14] px-4 py-3 text-center hover:border-[#7c3aed]/30 transition-colors">
                  <span className="text-[#7c3aed]">{s.icon}</span>
                  <span className="text-[11px] font-semibold text-white">{s.label}</span>
                  <span className="text-[9px] text-white/30">{s.sub}</span>
                </div>
                {i < archSteps.length - 1 && <ArrowRight className="w-3 h-3 text-white/15 hidden sm:block flex-shrink-0" />}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: "Backend",   value: "Flask REST API · Python AI Stack" },
              { label: "Frontend",  value: "Next.js · Tailwind CSS · WebSocket" },
              { label: "AI Models", value: "OpenCV · MediaPipe · TensorFlow" },
            ].map((t, i) => (
              <div key={i} className="rounded-xl border border-white/[0.06] bg-[#0d0d14] px-4 py-3">
                <div className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/25 mb-1">{t.label}</div>
                <div className="text-xs font-medium text-white/60">{t.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────── */}
      <section className="border-t border-white/[0.06] bg-[#0a0a12]">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <div className="mb-10 text-center">
            <div className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#7c3aed] mb-2">Getting Started</div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-[-0.03em] text-white">How It Works</h2>
            <p className="mt-2 text-sm text-white/35 max-w-md mx-auto">Get up and running in three simple steps.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {howItWorks.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.35, delay: i * 0.1 }}
                className="relative rounded-2xl border border-white/[0.07] bg-[#0e0e1a] p-5 text-center hover:border-[#7c3aed]/25 transition-all duration-300">
                <div className="text-[10px] font-mono font-bold text-[#7c3aed] tracking-widest mb-3">STEP {item.step}</div>
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#7c3aed]/10 border border-[#7c3aed]/20 text-[#a78bfa]">
                  {item.icon}
                </div>
                <h3 className="text-sm font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-xs text-white/35 leading-relaxed">{item.desc}</p>
                {i < howItWorks.length - 1 && (
                  <div className="absolute -right-2 top-1/2 z-10 hidden md:block -translate-y-1/2">
                    <ArrowRight className="w-4 h-4 text-white/15" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE ───────────────────────────────────── */}
      <section id="about" className="mx-auto max-w-5xl px-6 py-16">
        <div className="mb-10 text-center">
          <div className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#7c3aed] mb-2">Why AISMS</div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-[-0.03em] text-white">Built for Integrity at Scale</h2>
          <p className="mt-2 text-sm text-white/35 max-w-md mx-auto">A purpose-built monitoring platform combining cutting-edge AI with seamless UX.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {whyChoose.map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.35, delay: i * 0.08 }}
              className="rounded-2xl border border-white/[0.07] bg-[#0e0e1a] p-5 hover:border-[#7c3aed]/25 transition-all duration-300 hover:-translate-y-0.5">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#7c3aed]/10 border border-[#7c3aed]/20 text-[#a78bfa] mb-3">
                {item.icon}
              </div>
              <h3 className="text-sm font-semibold text-white mb-1.5">{item.title}</h3>
              <p className="text-xs text-white/35 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FOOTER CTA ───────────────────────────────────── */}
      <div className="border-t border-white/[0.06] bg-[#0a0a12]">
        <div className="relative overflow-hidden py-14 text-center">
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_50%_60%_at_50%_50%,rgba(124,58,237,0.1),transparent)]" />
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative z-10">
            <p className="mb-5 text-sm text-white/35">Ready to monitor your next interview session?</p>
            <Link href={isAuthenticated ? "/interview" : "/login"}
              className="inline-flex items-center gap-2 bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-sm font-semibold px-8 py-3 rounded-xl transition-all duration-200 shadow-[0_4px_24px_rgba(124,58,237,0.4)] hover:shadow-[0_6px_32px_rgba(124,58,237,0.6)] hover:-translate-y-0.5">
              {isAuthenticated ? "Launch Monitoring System" : "Get Started Free"} <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
        <div className="border-t border-white/[0.04] py-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <div className="flex h-5 w-5 items-center justify-center rounded-md bg-gradient-to-br from-[#7c3aed] to-[#4c1d95] text-[8px] font-bold text-white">AI</div>
            <span className="text-[10px] font-bold tracking-[0.2em] text-white/20">AISMS</span>
          </div>
          <p className="text-[10px] text-white/15">AI-Powered Interview Monitoring & Behavioral Analysis System</p>
        </div>
      </div>
    </div>
  );
}
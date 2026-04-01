"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, User, Mic, AlertTriangle, Brain, Lightbulb, Camera, Zap, Database, Play, BarChart } from "lucide-react";

const features = [
  {
    icon: <Eye className="w-6 h-6" />,
    title: "Eye Tracking Monitor",
    desc: "Real-time gaze direction analysis detecting off-screen behavior, multiple monitor usage, and suspicious visual patterns using ML-based pupil tracking.",
    accent: "#06b6d4",
  },
  {
    icon: <User className="w-6 h-6" />,
    title: "Face Detection & Identity",
    desc: "Continuous facial presence verification, identity consistency checks, and multi-person detection using deep learning facial recognition models.",
    accent: "#3b82f6",
  },
  {
    icon: <Mic className="w-6 h-6" />,
    title: "Voice Analysis Engine",
    desc: "Background noise detection, multiple speaker identification, and speech pattern analysis to ensure a controlled interview environment.",
    accent: "#8b5cf6",
  },
  {
    icon: <AlertTriangle className="w-6 h-6" />,
    title: "Risk Scoring Engine",
    desc: "Dynamic composite risk calculation aggregating all violation signals into a real-time risk score with trend analysis and threshold alerting.",
    accent: "#f59e0b",
  },
  {
    icon: <Brain className="w-6 h-6" />,
    title: "Behavioral Intelligence",
    desc: "Advanced pattern recognition analyzing behavioral sequences over time to identify anomalies, stress indicators, and suspicious activity clusters.",
    accent: "#10b981",
  },
  {
    icon: <Lightbulb className="w-6 h-6" />,
    title: "Smart Feedback System",
    desc: "AI-generated personalized improvement recommendations based on session performance data with prioritized action items and trend comparisons.",
    accent: "#ef4444",
  },
];

const stats = [
  { value: "98.7%", label: "Detection Accuracy",  color: "#06b6d4" },
  { value: "12ms",  label: "Response Latency",     color: "#3b82f6" },
  { value: "6",     label: "AI Modules",           color: "#8b5cf6" },
  { value: "24/7",  label: "Real-time Monitoring", color: "#10b981" },
];

const archSteps = [
  { icon: <Camera className="w-5 h-5" />, label: "Webcam Input",   sub: "Video + Audio",       color: "#06b6d4" },
  { icon: <Brain className="w-5 h-5" />, label: "AI Modules",     sub: "Eye · Face · Voice",  color: "#3b82f6" },
  { icon: <Zap className="w-5 h-5" />, label: "Risk Engine",    sub: "Composite Scoring",   color: "#f59e0b" },
  { icon: <Database className="w-5 h-5" />, label: "Behavioral DB",  sub: "Session Storage",     color: "#8b5cf6" },
  { icon: <Lightbulb className="w-5 h-5" />, label: "Feedback API",   sub: "Smart Reports",       color: "#10b981" },
];

const techStack = [
  { label: "Backend",   value: "Flask REST API · Python AI Stack" },
  { label: "Frontend",  value: "Next.js · Tailwind CSS · WebSocket" },
  { label: "AI Models", value: "OpenCV · MediaPipe · TensorFlow" },
];

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay },
});

export default function LandingPage() {
  return (
    <div className="bg-[#080c14] min-h-screen">

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex items-center justify-center text-center px-6 pt-14 overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 bg-grid" />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute w-[500px] h-[500px] -top-20 -left-20 bg-blue-500/10 rounded-full blur-[80px] animate-float" />
          <div className="absolute w-[400px] h-[400px] -bottom-16 -right-12 bg-cyan-500/8  rounded-full blur-[80px] animate-float" style={{ animationDelay: "3s" }} />
          <div className="absolute w-[300px] h-[300px] top-1/2 left-1/2 -translate-x-1/2 bg-purple-500/6 rounded-full blur-[80px] animate-float" style={{ animationDelay: "5s" }} />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Badge */}
          <motion.div {...fade(0.1)} className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/25 rounded-full px-4 py-1.5 text-xs text-cyan-400 font-medium mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#06b6d4] animate-pulse-dot" />
            Powered by Behavioral AI Engine v2.0
          </motion.div>

          {/* Title */}
          <motion.h1 {...fade(0.2)} className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-5">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              AI-Powered
            </span>{" "}
            Interview Monitoring<br />
            &amp; Behavioral Analysis System
          </motion.h1>

          {/* Tagline */}
          <motion.p {...fade(0.3)} className="text-lg text-slate-400 mb-10 font-light">
            Ensuring Integrity, Enhancing Performance
          </motion.p>

          {/* CTA */}
          <motion.div {...fade(0.4)} className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/interview"
              className="inline-flex items-center gap-2 px-7 py-3 bg-gradient-to-r from-blue-700 to-blue-500 text-white rounded-lg font-semibold text-sm tracking-wide hover:shadow-[0_8px_24px_rgba(59,130,246,.4)] hover:-translate-y-0.5 transition-all duration-200"
            >
              <Play className="w-4 h-4" />
              Start Interview
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-7 py-3 bg-transparent text-slate-200 border border-[#243655] rounded-lg font-semibold text-sm tracking-wide hover:border-cyan-500/60 hover:text-cyan-300 hover:bg-cyan-500/5 transition-all duration-200"
            >
              <BarChart className="w-4 h-4" />
              View Dashboard
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── STATS BANNER ──────────────────────────────────── */}
      <div className="border-y border-[#1e2d47] bg-[#0f1724]">
        <div className="max-w-5xl mx-auto px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((s, i) => (
            <motion.div key={i} {...fade(0.1 * i)}>
              <div className="text-3xl font-bold font-mono tracking-tight" style={{ color: s.color }}>{s.value}</div>
              <div className="text-xs text-slate-400 mt-1">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── FEATURES ──────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-[11px] font-semibold tracking-widest uppercase text-cyan-400 mb-2">Core Modules</div>
        <h2 className="text-3xl font-bold tracking-tight mb-2">Six AI-Driven Intelligence Layers</h2>
        <p className="text-slate-400 text-sm mb-12">
          Multi-modal behavioral analysis combining computer vision, audio processing, and predictive risk modeling.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="group relative bg-[#0f1724] border border-[#1e2d47] rounded-xl p-6 overflow-hidden hover:border-[#243655] hover:-translate-y-0.5 transition-all duration-250"
            >
              <div
                className="absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-250"
                style={{ background: `linear-gradient(90deg, transparent, ${f.accent}, transparent)` }}
              />
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-xl mb-4"
                style={{ background: `${f.accent}18` }}
              >
                {f.icon}
              </div>
              <h3 className="text-[15px] font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── ARCHITECTURE ─────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="text-[11px] font-semibold tracking-widest uppercase text-cyan-400 mb-2">System Architecture</div>
        <h2 className="text-3xl font-bold tracking-tight mb-2">Processing Pipeline</h2>
        <p className="text-slate-400 text-sm mb-8">
          From raw sensor inputs to intelligent behavioral reports — all in real time.
        </p>
        <div className="bg-[#0f1724] border border-[#1e2d47] rounded-2xl p-8">
          {/* Flow */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            {archSteps.map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <div
                  className="bg-[#131e2e] border rounded-lg px-4 py-3 text-center min-w-[110px]"
                  style={{ borderColor: `${s.color}40` }}
                >
                  <div className="text-base mb-0.5">{s.icon}</div>
                  <div className="text-xs font-semibold" style={{ color: s.color }}>{s.label}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{s.sub}</div>
                </div>
                {i < archSteps.length - 1 && (
                  <span className="text-slate-600 text-lg font-light">→</span>
                )}
              </div>
            ))}
          </div>
          {/* Tech stack */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {techStack.map((t, i) => (
              <div key={i} className="bg-[#080c14] border border-[#1e2d47] rounded-lg px-4 py-3">
                <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mb-1">{t.label}</div>
                <div className="text-[13px] font-medium text-slate-200">{t.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER CTA ───────────────────────────────────── */}
      <div className="border-t border-[#1e2d47] py-10 text-center">
        <p className="text-slate-500 text-sm mb-4">Ready to monitor your next interview session?</p>
        <Link
          href="/interview"
          className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-700 to-cyan-500 text-white rounded-lg font-semibold text-sm hover:shadow-[0_8px_28px_rgba(59,130,246,.4)] hover:-translate-y-0.5 transition-all duration-200"
        >
          Launch Monitoring System
          <span className="text-lg">→</span>
        </Link>
      </div>
    </div>
  );
}

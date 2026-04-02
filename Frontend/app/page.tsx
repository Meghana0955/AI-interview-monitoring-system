"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, User, Mic, AlertTriangle, Brain, Lightbulb, Camera, Zap, Database, Play, BarChart, UserPlus, MonitorPlay, FileCheck, Shield, TrendingUp, Clock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

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

const howItWorks = [
  {
    step: "01",
    icon: <UserPlus className="w-7 h-7" />,
    title: "Sign Up & Login",
    desc: "Create your account in seconds and access the monitoring platform with role-based permissions.",
    color: "#06b6d4",
  },
  {
    step: "02",
    icon: <MonitorPlay className="w-7 h-7" />,
    title: "Start AI Session",
    desc: "Launch a monitored interview session with real-time webcam, audio, and behavioral tracking powered by 6 AI modules.",
    color: "#3b82f6",
  },
  {
    step: "03",
    icon: <FileCheck className="w-7 h-7" />,
    title: "Get AI Feedback",
    desc: "Receive comprehensive reports with risk analysis, violation breakdowns, and personalized improvement suggestions.",
    color: "#10b981",
  },
];

const whyChoose = [
  {
    icon: <Shield className="w-5 h-5" />,
    title: "Exam Integrity Guaranteed",
    desc: "Multi-layered AI detection ensures every interview is fair, secure, and tamper-proof.",
    color: "#06b6d4",
  },
  {
    icon: <TrendingUp className="w-5 h-5" />,
    title: "Data-Driven Insights",
    desc: "Transform raw behavioral data into actionable performance metrics with trend analysis.",
    color: "#3b82f6",
  },
  {
    icon: <Clock className="w-5 h-5" />,
    title: "Real-Time Processing",
    desc: "12ms response latency ensures instant detection and alerting with zero delay.",
    color: "#10b981",
  },
];

/* ── Animation variants ──────────────────────────────── */
const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
};

const staggerContainer = {
  whileInView: { transition: { staggerChildren: 0.08 } },
  viewport: { once: true },
};

const staggerItem = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
};

export default function LandingPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="bg-[#080c14] min-h-screen">

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex items-center justify-center text-center px-6 pt-16 overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 bg-grid opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#080c14]" />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute w-[600px] h-[600px] -top-32 -left-32 bg-blue-500/10 rounded-full blur-[100px] animate-float" />
          <div className="absolute w-[500px] h-[500px] -bottom-20 -right-16 bg-cyan-500/8  rounded-full blur-[100px] animate-float" style={{ animationDelay: "3s" }} />
          <div className="absolute w-[400px] h-[400px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-purple-500/6 rounded-full blur-[100px] animate-float" style={{ animationDelay: "5s" }} />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 glass-card rounded-full px-5 py-2 text-xs text-cyan-400 font-medium mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#06b6d4] animate-pulse-dot" />
            Powered by Behavioral AI Engine v2.0
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-5"
          >
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              AI-Powered
            </span>{" "}
            Interview Monitoring<br />
            &amp; Behavioral Analysis System
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="text-lg text-slate-400 mb-10 font-light max-w-2xl mx-auto"
          >
            Ensuring Integrity, Enhancing Performance
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="flex flex-wrap gap-3 justify-center"
          >
            {isAuthenticated ? (
              <>
                <Link
                  href="/interview"
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-semibold text-sm tracking-wide shadow-[0_4px_20px_rgba(59,130,246,0.3)] hover:shadow-[0_8px_32px_rgba(59,130,246,0.5)] hover:-translate-y-0.5 transition-all duration-300"
                >
                  <Play className="w-4 h-4" />
                  Start Interview
                </Link>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 px-8 py-3.5 glass-card text-slate-200 rounded-xl font-semibold text-sm tracking-wide hover:border-cyan-500/40 hover:text-cyan-300 transition-all duration-300"
                >
                  <BarChart className="w-4 h-4" />
                  View Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-semibold text-sm tracking-wide shadow-[0_4px_20px_rgba(59,130,246,0.3)] hover:shadow-[0_8px_32px_rgba(59,130,246,0.5)] hover:-translate-y-0.5 transition-all duration-300"
                >
                  <Play className="w-4 h-4" />
                  Get Started
                </Link>
                <button
                  onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
                  className="inline-flex items-center gap-2 px-8 py-3.5 glass-card text-slate-200 rounded-xl font-semibold text-sm tracking-wide hover:border-cyan-500/40 hover:text-cyan-300 transition-all duration-300"
                >
                  Explore Features ↓
                </button>
              </>
            )}
          </motion.div>
        </div>
      </section>

      {/* ── STATS BANNER ──────────────────────────────────── */}
      <div className="relative">
        <div className="section-divider" />
        <div className="glass" style={{ background: "rgba(15, 23, 36, 0.5)" }}>
          <div className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((s, i) => (
              <motion.div
                key={i}
                {...fadeUp}
                transition={{ duration: 0.4, delay: 0.1 * i }}
              >
                <div className="text-3xl sm:text-4xl font-bold font-mono tracking-tight" style={{ color: s.color }}>{s.value}</div>
                <div className="text-xs text-slate-400 mt-1.5">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
        <div className="section-divider" />
      </div>

      {/* ── FEATURES ──────────────────────────────────────── */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-20 md:py-28">
        <motion.div {...fadeUp} transition={{ duration: 0.5 }}>
          <div className="text-[11px] font-semibold tracking-widest uppercase text-cyan-400 mb-2">Core Modules</div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">Six AI-Driven Intelligence Layers</h2>
          <p className="text-slate-400 text-sm mb-14 max-w-2xl">
            Multi-modal behavioral analysis combining computer vision, audio processing, and predictive risk modeling.
          </p>
        </motion.div>

        <motion.div
          {...staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {features.map((f, i) => (
            <motion.div
              key={i}
              variants={staggerItem}
              transition={{ duration: 0.4 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="group relative glass-card glass-card-hover rounded-xl p-6 overflow-hidden"
            >
              {/* Top accent line */}
              <div
                className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: `linear-gradient(90deg, transparent, ${f.accent}, transparent)` }}
              />
              {/* Hover glow */}
              <div
                className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-[60px]"
                style={{ background: f.accent + "15" }}
              />

              <div
                className="relative w-11 h-11 rounded-lg flex items-center justify-center mb-4"
                style={{ background: `${f.accent}15`, color: f.accent }}
              >
                {f.icon}
              </div>
              <h3 className="relative text-[15px] font-semibold mb-2">{f.title}</h3>
              <p className="relative text-sm text-slate-400 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── PROCESSING PIPELINE ───────────────────────────── */}
      <section id="pipeline" className="max-w-6xl mx-auto px-6 pb-20 md:pb-28">
        <motion.div {...fadeUp} transition={{ duration: 0.5 }}>
          <div className="text-[11px] font-semibold tracking-widest uppercase text-cyan-400 mb-2">System Architecture</div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">Processing Pipeline</h2>
          <p className="text-slate-400 text-sm mb-10 max-w-2xl">
            From raw sensor inputs to intelligent behavioral reports — all in real time.
          </p>
        </motion.div>

        <motion.div
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass-card rounded-2xl p-6 sm:p-8"
        >
          {/* Flow */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
            {archSteps.map((s, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-3"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
              >
                <div
                  className="glass-card rounded-xl px-5 py-4 text-center min-w-[120px] hover:border-opacity-60 transition-all duration-300"
                  style={{ borderColor: `${s.color}30` }}
                >
                  <div className="flex justify-center mb-1" style={{ color: s.color }}>{s.icon}</div>
                  <div className="text-xs font-semibold" style={{ color: s.color }}>{s.label}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{s.sub}</div>
                </div>
                {i < archSteps.length - 1 && (
                  <span className="text-slate-600 text-lg font-light hidden sm:inline">→</span>
                )}
              </motion.div>
            ))}
          </div>

          {/* Tech stack */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {techStack.map((t, i) => (
              <div key={i} className="bg-[#080c14]/60 border border-white/[0.06] rounded-lg px-4 py-3">
                <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mb-1">{t.label}</div>
                <div className="text-[13px] font-medium text-slate-200">{t.value}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────── */}
      <section className="relative py-20 md:py-28">
        <div className="section-divider" />
        <div className="glass" style={{ background: "rgba(15, 23, 36, 0.3)" }}>
          <div className="max-w-5xl mx-auto px-6 py-20">
            <motion.div {...fadeUp} transition={{ duration: 0.5 }} className="text-center mb-14">
              <div className="text-[11px] font-semibold tracking-widest uppercase text-cyan-400 mb-2">Getting Started</div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">How It Works</h2>
              <p className="text-slate-400 text-sm max-w-lg mx-auto">
                Get up and running in three simple steps — from sign-up to AI-powered feedback.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {howItWorks.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.12 }}
                  className="relative glass-card glass-card-hover rounded-xl p-6 text-center"
                >
                  {/* Step number */}
                  <div className="text-[11px] font-bold font-mono tracking-widest mb-4" style={{ color: item.color }}>
                    STEP {item.step}
                  </div>
                  {/* Icon */}
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                    style={{ background: `${item.color}12`, color: item.color }}
                  >
                    {item.icon}
                  </div>
                  <h3 className="text-base font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>

                  {/* Connector arrow (between cards on desktop) */}
                  {i < howItWorks.length - 1 && (
                    <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 text-slate-600 text-lg z-10">→</div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        <div className="section-divider" />
      </section>

      {/* ── ABOUT / WHY CHOOSE US ─────────────────────────── */}
      <section id="about" className="max-w-6xl mx-auto px-6 py-20 md:py-28">
        <motion.div {...fadeUp} transition={{ duration: 0.5 }} className="text-center mb-14">
          <div className="text-[11px] font-semibold tracking-widest uppercase text-cyan-400 mb-2">Why AISMS</div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">Built for Integrity at Scale</h2>
          <p className="text-slate-400 text-sm max-w-lg mx-auto">
            A purpose-built monitoring platform that combines cutting-edge AI with seamless user experience.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {whyChoose.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className="glass-card glass-card-hover rounded-xl p-6"
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                style={{ background: `${item.color}12`, color: item.color }}
              >
                {item.icon}
              </div>
              <h3 className="text-[15px] font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FOOTER CTA ───────────────────────────────────── */}
      <div className="relative">
        <div className="section-divider" />
        <div className="relative py-16 text-center overflow-hidden">
          {/* Background glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute w-[500px] h-[300px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-500/8 rounded-full blur-[80px]" />
          </div>

          <motion.div {...fadeUp} transition={{ duration: 0.5 }} className="relative z-10">
            <p className="text-slate-400 text-base mb-6 font-light">Ready to monitor your next interview session?</p>
            <Link
              href={isAuthenticated ? "/interview" : "/login"}
              className="inline-flex items-center gap-2 px-10 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-semibold text-sm shadow-[0_4px_24px_rgba(59,130,246,0.3)] hover:shadow-[0_8px_36px_rgba(59,130,246,0.5)] hover:-translate-y-0.5 transition-all duration-300"
            >
              {isAuthenticated ? "Launch Monitoring System" : "Get Started Free"}
              <span className="text-lg">→</span>
            </Link>
          </motion.div>
        </div>

        {/* Footer branding */}
        <div className="section-divider" />
        <div className="py-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-400 flex items-center justify-center text-[9px] font-bold text-white">AI</div>
            <span className="text-xs font-bold text-slate-500">AISMS</span>
          </div>
          <p className="text-[11px] text-slate-600">AI-Powered Interview Monitoring & Behavioral Analysis System</p>
        </div>
      </div>
    </div>
  );
}

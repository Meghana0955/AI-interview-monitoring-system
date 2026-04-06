"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Eye, EyeOff, Shield, Zap, Brain } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const highlights = [
  { icon: <Shield className="w-4 h-4" />, text: "Exam integrity guaranteed" },
  { icon: <Zap className="w-4 h-4" />, text: "12ms real-time analysis" },
  { icon: <Brain className="w-4 h-4" />, text: "6 AI modules active" },
];

const inputCls =
  "w-full rounded-xl border border-[#1e2d47] bg-[#0d1524] px-4 py-2.5 text-sm text-[#e2e8f0] placeholder:text-[#64748b] outline-none transition-all duration-200 focus:border-[#3b82f6]/60 focus:bg-[#101828] focus:ring-2 focus:ring-[#3b82f6]/15 hover:border-[#243655]";

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Enter both email and password");
      return;
    }
    setIsLoading(true);
    try {
      const user = await login(email, password);
      toast.success(`Welcome back, ${user.name}`);
      router.push(user.role === "admin" ? "/admin" : "/dashboard");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#080c14] text-[#e2e8f0] flex items-center justify-center px-4 py-10 overflow-hidden">

      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/2 top-0 w-[700px] h-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#3b82f6]/[0.07] blur-[120px]" />
        <div className="absolute right-0 bottom-0 w-[400px] h-[400px] rounded-full bg-[#06b6d4]/[0.05] blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 w-full max-w-4xl"
      >
        {/* Nav row */}
        <div className="flex items-center justify-between mb-6 px-1">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#06b6d4] to-[#3b82f6] text-[10px] font-bold text-white shadow-[0_0_14px_rgba(6,182,212,0.4)]">AI</div>
            <span className="text-sm font-bold tracking-widest text-[#94a3b8]">AISMS</span>
          </Link>
          <Link href="/" className="flex items-center gap-1.5 text-xs text-[#64748b] hover:text-[#94a3b8] transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to home
          </Link>
        </div>

        {/* Main card */}
        <div className="grid lg:grid-cols-[1fr_1.4fr] rounded-2xl border border-[#1e2d47] bg-[#101828] overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.6)]">

          {/* ── LEFT PANEL ── */}
          <div className="relative hidden lg:flex flex-col justify-between p-8 bg-[#0a101a] border-r border-[#1e2d47] overflow-hidden">
            <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-[#06b6d4]/[0.12] blur-[80px]" />
            <div className="absolute bottom-10 right-0 w-48 h-48 rounded-full bg-[#3b82f6]/[0.08] blur-[60px]" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#1e2d47] bg-[#101828]/60 px-3 py-1.5 text-[10px] text-[#94a3b8] mb-8">
                <span className="h-1.5 w-1.5 rounded-full bg-[#06b6d4] shadow-[0_0_8px_rgba(6,182,212,0.9)]" />
                Secure Login
              </div>
              <h2 className="text-3xl font-bold tracking-[-0.03em] text-[#e2e8f0] leading-tight mb-3">
                Monitor Better Together
              </h2>
              <p className="text-sm text-[#64748b] leading-relaxed max-w-[200px]">
                Real-time integrity and behavioral intelligence at scale.
              </p>
              <br />
            </div>

            {/* Highlight pills */}
            <div className="relative z-10 space-y-2.5">
              {highlights.map((h, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, delay: 0.2 + i * 0.1 }}
                  className="flex items-center gap-3 rounded-xl border border-[#1e2d47] bg-[#101828] px-4 py-3">
                  <span className="text-[#3b82f6]">{h.icon}</span>
                  <span className="text-xs text-[#94a3b8]">{h.text}</span>
                </motion.div>
              ))}
            </div>

            {/* Mini visual */}
            
          </div>

          {/* ── RIGHT PANEL (form) ── */}
          <div className="p-7 sm:p-10 flex flex-col justify-center">
            <h1 className="text-2xl font-bold tracking-[-0.03em] text-[#e2e8f0] mb-1">Welcome back</h1>
            <p className="text-sm text-[#64748b] mb-7">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-[#06b6d4] hover:text-[#e2e8f0] transition-colors">
                Sign up
              </Link>
            </p>

            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#64748b]">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@college.edu"
                  className={inputCls}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#64748b]">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className={inputCls + " pr-10"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors"
                  >
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#3b82f6] via-[#06b6d4] to-[#3b82f6] hover:opacity-90 py-3 text-sm font-semibold text-white shadow-[0_4px_24px_rgba(59,130,246,0.38)] hover:shadow-[0_6px_32px_rgba(6,182,212,0.5)] transition-all duration-200 hover:-translate-y-0.5 active:scale-[.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Signing in…
                </>
              ) : (
                <>Sign in <ArrowRight className="w-4 h-4" /></>
              )}
            </button>

            <p className="mt-4 text-center text-[11px] text-[#64748b]">
              By signing in you agree to our{" "}
              <span className="text-[#94a3b8] hover:text-[#e2e8f0] cursor-pointer transition-colors">Terms of Service</span>
              {" & "}
              <span className="text-[#94a3b8] hover:text-[#e2e8f0] cursor-pointer transition-colors">Privacy Policy</span>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
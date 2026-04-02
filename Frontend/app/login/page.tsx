"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already logged in
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
    <div className="min-h-screen bg-[#080c14] flex items-center justify-center px-4 py-8">
      {/* Back to home */}
      <Link
        href="/"
        className="fixed top-5 left-5 z-50 flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium text-slate-400 glass-card hover:text-cyan-300 hover:border-cyan-500/30 transition-all duration-200"
      >
        <ArrowLeft className="w-4 h-4" />
        Home
      </Link>

      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-[500px] h-[500px] top-1/4 left-1/2 -translate-x-1/2 bg-blue-500/6 rounded-full blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="relative z-10 w-full max-w-sm"
      >
        <div className="glass-card rounded-2xl p-8">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-7">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-400 flex items-center justify-center text-sm font-bold text-white shadow-[0_0_20px_rgba(6,182,212,0.2)]">AI</div>
            <div>
              <div className="text-sm font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">AISMS</div>
              <div className="text-[10px] text-slate-500">Interview Monitoring System</div>
            </div>
          </div>

          <h2 className="text-xl font-bold mb-1 tracking-tight">Welcome Back</h2>
          <p className="text-sm text-slate-400 mb-6">Sign in to your monitoring account</p>

          {/* Fields */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#0d1421]/80 border border-white/[0.06] rounded-lg text-sm text-slate-200 outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/15 focus:bg-[#0d1421] transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#0d1421]/80 border border-white/[0.06] rounded-lg text-sm text-slate-200 outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/15 focus:bg-[#0d1421] transition-all duration-200"
              />
            </div>
          </div>

          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg font-semibold text-sm shadow-[0_4px_20px_rgba(59,130,246,0.25)] hover:shadow-[0_6px_28px_rgba(59,130,246,0.4)] transition-all duration-300 active:scale-[.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In →"
            )}
          </button>

          <div className="flex items-center gap-3 my-5 text-[11px] text-slate-600">
            <div className="flex-1 h-px bg-white/[0.06]" />or<div className="flex-1 h-px bg-white/[0.06]" />
          </div>

          <p className="text-center text-sm text-slate-400">
            No account?{" "}
            <Link href="/signup" className="text-blue-400 hover:text-blue-300 underline transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

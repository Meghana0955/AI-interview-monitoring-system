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
    <div className="relative min-h-screen overflow-hidden bg-[#08080f] px-4 py-8 text-white sm:px-6">
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_65%_45%_at_50%_-12%,rgba(124,58,237,0.2),transparent)]" />

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 mx-auto grid w-full max-w-6xl overflow-hidden rounded-[28px] border border-white/10 bg-[#2a2638] shadow-[0_30px_90px_rgba(0,0,0,0.45)] lg:grid-cols-[1.05fr_1fr]"
      >
        <div className="relative hidden min-h-[680px] border-r border-white/10 bg-gradient-to-b from-[#6f5ad5] via-[#4b3b8f] to-[#1a1630] p-7 lg:block">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_20%_0%,rgba(255,255,255,0.15),transparent)]" />
          <div className="relative z-10 flex items-center justify-between">
            <span className="text-3xl font-semibold tracking-[0.18em] text-white/90">AISMS</span>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-4 py-1.5 text-sm text-white/90 backdrop-blur-xl transition hover:bg-white/25"
            >
              Back to website
              <ArrowLeft className="h-3.5 w-3.5 rotate-180" />
            </Link>
          </div>

          <div className="pointer-events-none absolute bottom-16 left-8 right-8">
            <div className="mb-4 max-w-xs text-5xl font-light leading-[1.05] text-white/90">Monitor Better</div>
            <p className="mb-8 max-w-xs text-sm leading-6 text-white/70">Real-time interview integrity, behavioral intelligence, and performance insights.</p>
            <div className="flex items-center gap-3">
              <span className="h-1.5 w-8 rounded-full bg-white/25" />
              <span className="h-1.5 w-8 rounded-full bg-white/25" />
              <span className="h-1.5 w-8 rounded-full bg-white" />
            </div>
          </div>
        </div>

        <div className="relative bg-[#2a2638] p-7 sm:p-10 lg:min-h-[680px] lg:p-14">
          <Link
            href="/"
            className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 backdrop-blur-2xl transition-all duration-200 hover:border-white/20 hover:bg-white/[0.08] hover:text-white lg:hidden"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to website
          </Link>

          <h1 className="mb-2 text-4xl font-semibold tracking-[-0.03em] text-white">Welcome back</h1>
          <p className="mb-10 text-base text-slate-300/90">Don&apos;t have an account? <Link href="/signup" className="text-[#c4b5fd] underline underline-offset-2 hover:text-white">Sign up</Link></p>

          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm text-slate-300">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/8 px-4 py-3 text-sm text-white placeholder:text-slate-300/50 outline-none transition focus:border-[#b9a7ff] focus:ring-2 focus:ring-[#8b5cf6]/25"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/8 px-4 py-3 text-sm text-white placeholder:text-slate-300/50 outline-none transition focus:border-[#b9a7ff] focus:ring-2 focus:ring-[#8b5cf6]/25"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#8b5cf6] via-[#7c3aed] to-[#3b82f6] py-3 text-sm font-semibold text-white shadow-[0_10px_28px_rgba(124,58,237,0.45)] transition-all duration-300 hover:shadow-[0_14px_36px_rgba(124,58,237,0.55)] active:scale-[.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

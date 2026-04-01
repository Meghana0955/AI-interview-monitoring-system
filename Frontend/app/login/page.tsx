"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<"student" | "admin">("student");
  const [email, setEmail] = useState("student@college.edu");
  const [password, setPassword] = useState("password123");

  const handleLogin = () => {
    toast.success(`Signed in as ${role === "admin" ? "Admin" : "Student"}`);
    router.push(role === "admin" ? "/admin" : "/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#080c14] flex items-center justify-center px-4 pt-14">
      <div className="absolute inset-0 bg-grid opacity-50" />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-96 h-96 top-1/4 left-1/2 -translate-x-1/2 bg-blue-500/8 rounded-full blur-[80px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="relative z-10 w-full max-w-sm"
      >
        <div className="bg-[#0f1724]/90 backdrop-blur-md border border-[#1e2d47] rounded-2xl p-8">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-7">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-700 to-cyan-500 flex items-center justify-center text-sm font-bold text-white">AI</div>
            <div>
              <div className="text-sm font-bold text-cyan-400">AISMS</div>
              <div className="text-[10px] text-slate-500">Interview Monitoring System</div>
            </div>
          </div>

          <h2 className="text-xl font-bold mb-1 tracking-tight">Welcome Back</h2>
          <p className="text-sm text-slate-400 mb-6">Sign in to your monitoring account</p>

          {/* Role selector */}
          <div className="grid grid-cols-2 gap-2 mb-6">
            {(["student", "admin"] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`py-3 rounded-lg text-sm font-medium border transition-all duration-200 ${
                  role === r
                    ? "border-blue-500 bg-blue-500/10 text-blue-300"
                    : "border-[#1e2d47] text-slate-400 hover:border-[#243655]"
                }`}
              >
                {r === "student" ? "🎓 Student" : "🧑‍💼 Admin"}
              </button>
            ))}
          </div>

          {/* Fields */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#0d1421] border border-[#1e2d47] rounded-lg text-sm text-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#0d1421] border border-[#1e2d47] rounded-lg text-sm text-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 transition-all duration-200"
              />
            </div>
          </div>

          <button
            onClick={handleLogin}
            className="w-full py-2.5 bg-gradient-to-r from-blue-700 to-blue-500 text-white rounded-lg font-semibold text-sm hover:shadow-[0_6px_20px_rgba(59,130,246,.4)] transition-all duration-200 active:scale-[.98]"
          >
            Sign In →
          </button>

          <div className="flex items-center gap-3 my-5 text-[11px] text-slate-600">
            <div className="flex-1 h-px bg-[#1e2d47]" />or<div className="flex-1 h-px bg-[#1e2d47]" />
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

"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { apiRegister } from "@/lib/api";

const COURSES = ["B.Tech", "M.Tech", "B.Sc", "M.Sc", "BCA", "MCA", "MBA", "B.E", "M.E"];
const YEARS   = ["1st Year", "2nd Year", "3rd Year", "4th Year", "PG 1st Year", "PG 2nd Year"];

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">{label}</label>
      {children}
    </div>
  );
}

const inputCls = "w-full px-3.5 py-2.5 bg-[#0d1421]/80 border border-white/[0.06] rounded-lg text-sm text-slate-200 outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/15 focus:bg-[#0d1421] transition-all duration-200";
const selectCls = inputCls + " cursor-pointer";

export default function SignupPage() {
  const router = useRouter();
  const { loginWithToken } = useAuth();

  const [form, setForm] = useState({
    name: "", email: "", password: "", confirmPassword: "",
    college: "", branch: "", course: "B.Tech", year: "1st Year",
  });
  const [isLoading, setIsLoading] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [k]: e.target.value }));

  const handleSignup = async () => {
    const { name, email, password, confirmPassword, college, branch, course, year } = form;
    if (!name || !email || !password || !college || !branch) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    try {
      const { user, token } = await apiRegister({ name, email, password, college, branch, course, year });
      loginWithToken(user, token);
      toast.success(`Welcome, ${user.name}! 🎉`);
      router.push("/dashboard");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Registration failed. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080c14] flex items-center justify-center px-4 py-8">
      {/* Back to home */}
      <Link href="/" className="fixed top-5 left-5 z-50 flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium text-slate-400 glass-card hover:text-cyan-300 hover:border-cyan-500/30 transition-all duration-200">
        <ArrowLeft className="w-4 h-4" /> Home
      </Link>

      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute w-[500px] h-[500px] top-1/4 left-1/2 -translate-x-1/2 bg-purple-500/6 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="glass-card rounded-2xl p-8">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center text-sm font-bold text-white shadow-[0_0_20px_rgba(139,92,246,0.2)]">AI</div>
            <div>
              <div className="text-sm font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">AISMS</div>
              <div className="text-[10px] text-slate-500">Interview Monitoring System</div>
            </div>
          </div>

          <h2 className="text-xl font-bold mb-1 tracking-tight">Create Account</h2>
          <p className="text-sm text-slate-400 mb-6">Register as a new candidate</p>

          <div className="space-y-4 mb-6">
            {/* Personal Info */}
            <div className="text-[10px] font-semibold text-cyan-500/70 uppercase tracking-widest mb-1">Personal Info</div>
            <Field label="Full Name *">
              <input type="text" value={form.name} onChange={set("name")} placeholder="e.g. Adithya Kumar" className={inputCls} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Email *">
                <input type="email" value={form.email} onChange={set("email")} placeholder="you@college.edu" className={inputCls} />
              </Field>
              <Field label="Password *">
                <input type="password" value={form.password} onChange={set("password")} placeholder="Min 6 chars" className={inputCls} />
              </Field>
            </div>
            <Field label="Confirm Password *">
              <input type="password" value={form.confirmPassword} onChange={set("confirmPassword")} placeholder="Re-enter password" className={inputCls} />
            </Field>

            {/* Academic Info */}
            <div className="text-[10px] font-semibold text-cyan-500/70 uppercase tracking-widest mt-2 mb-1">Academic Details</div>
            <Field label="College / University *">
              <input type="text" value={form.college} onChange={set("college")} placeholder="e.g. Anna University" className={inputCls} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Branch / Department *">
                <input type="text" value={form.branch} onChange={set("branch")} placeholder="e.g. Computer Science" className={inputCls} />
              </Field>
              <Field label="Course">
                <select value={form.course} onChange={set("course")} className={selectCls}>
                  {COURSES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
            </div>
            <Field label="Year of Study">
              <select value={form.year} onChange={set("year")} className={selectCls}>
                {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </Field>
          </div>

          <button
            onClick={handleSignup}
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-lg font-semibold text-sm shadow-[0_4px_20px_rgba(139,92,246,0.25)] hover:shadow-[0_6px_28px_rgba(139,92,246,0.4)] transition-all duration-300 active:scale-[.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Creating account...</>
            ) : "Create Account →"}
          </button>

          <div className="flex items-center gap-3 my-5 text-[11px] text-slate-600">
            <div className="flex-1 h-px bg-white/[0.06]" />or<div className="flex-1 h-px bg-white/[0.06]" />
          </div>

          <p className="text-center text-sm text-slate-400">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-400 hover:text-blue-300 underline transition-colors">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

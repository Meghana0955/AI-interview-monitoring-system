"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Eye, EyeOff, Shield, Zap, Brain } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { apiRegister } from "@/lib/api";

const COURSES = ["B.Tech", "M.Tech", "B.Sc", "M.Sc", "BCA", "MCA", "MBA", "B.E", "M.E"];
const YEARS   = ["1st Year", "2nd Year", "3rd Year", "4th Year", "PG 1st Year", "PG 2nd Year"];

const highlights = [
  { icon: <Shield className="w-4 h-4" />, text: "Exam integrity guaranteed" },
  { icon: <Zap className="w-4 h-4" />,    text: "12ms real-time analysis"   },
  { icon: <Brain className="w-4 h-4" />,  text: "6 AI modules active"       },
];

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.18em] text-white/35">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border border-white/[0.07] bg-[#0d0d14] px-4 py-2.5 text-sm text-white placeholder:text-white/20 outline-none transition-all duration-200 focus:border-[#7c3aed]/60 focus:bg-[#0f0f1a] focus:ring-2 focus:ring-[#7c3aed]/15 hover:border-white/10";

export default function SignupPage() {
  const router = useRouter();
  const { loginWithToken } = useAuth();

  const [form, setForm] = useState({
    name: "", email: "", password: "", confirmPassword: "",
    college: "", branch: "", course: "B.Tech", year: "1st Year",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPw, setShowPw]       = useState(false);
  const [showCpw, setShowCpw]     = useState(false);

  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm(prev => ({ ...prev, [k]: e.target.value }));

  const handleSignup = async () => {
    const { name, email, password, confirmPassword, college, branch, course, year } = form;
    if (!name || !email || !password || !college || !branch) {
      toast.error("Please fill in all required fields"); return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match"); return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters"); return;
    }
    setIsLoading(true);
    try {
      const { user, token } = await apiRegister({ name, email, password, college, branch, course, year });
      loginWithToken(user, token);
      toast.success(`Welcome, ${user.name}!`);
      router.push("/dashboard");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Registration failed. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#08080f] text-white flex items-center justify-center px-4 py-10 overflow-hidden">

      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/2 top-0 w-[700px] h-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#7c3aed]/10 blur-[120px]" />
        <div className="absolute right-0 bottom-0 w-[400px] h-[400px] rounded-full bg-[#7c3aed]/5 blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 w-full max-w-5xl"
      >
        {/* Nav row */}
        <div className="flex items-center justify-between mb-6 px-1">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#7c3aed] to-[#4c1d95] text-[10px] font-bold text-white shadow-[0_0_14px_rgba(124,58,237,0.5)]">AI</div>
            <span className="text-sm font-bold tracking-widest text-white/50">AISMS</span>
          </Link>
          <Link href="/" className="flex items-center gap-1.5 text-xs text-white/35 hover:text-white/70 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to home
          </Link>
        </div>

        {/* Main card */}
        <div className="grid lg:grid-cols-[1fr_1.6fr] rounded-2xl border border-white/[0.07] bg-[#0e0e1a] overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.5)]">

          {/* ── LEFT PANEL ── */}
          <div className="relative hidden lg:flex flex-col justify-between p-8 bg-[#0a0a14] border-r border-white/[0.06] overflow-hidden">
            {/* Purple glow orb */}
            <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-[#7c3aed]/20 blur-[80px]" />
            <div className="absolute bottom-10 right-0 w-48 h-48 rounded-full bg-[#7c3aed]/10 blur-[60px]" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] text-white/50 mb-8">
                <span className="h-1.5 w-1.5 rounded-full bg-[#7c3aed] shadow-[0_0_8px_rgba(124,58,237,0.9)]" />
                Secure Registration
              </div>
              <h2 className="text-3xl font-bold tracking-[-0.03em] text-white leading-tight mb-3">
                Join the AI<br />Monitoring<br />Platform
              </h2>
              <p className="text-sm text-white/35 leading-relaxed max-w-[200px]">
                Built for fairness, integrity, and performance at scale.
              </p>
            </div>

            {/* Highlight pills */}
            <div className="relative z-10 space-y-2.5">
              {highlights.map((h, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, delay: 0.2 + i * 0.1 }}
                  className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-[#0e0e1a] px-4 py-3">
                  <span className="text-[#7c3aed]">{h.icon}</span>
                  <span className="text-xs text-white/50">{h.text}</span>
                </motion.div>
              ))}
            </div>

            {/* Mini visual */}
            <div className="relative z-10 mt-6 rounded-xl border border-white/[0.06] bg-[#0d0d14] p-4">
              <div className="text-[9px] uppercase tracking-widest text-white/20 mb-3 font-mono">Live Session</div>
              <div className="flex items-end gap-1 h-10">
                {[4,7,5,9,6,8,4,10,7,5,8,6].map((h, i) => (
                  <div key={i} className="flex-1 rounded-sm bg-gradient-to-t from-[#7c3aed] to-[#a78bfa]"
                    style={{ height: `${h * 9}%`, opacity: 0.4 + (i % 4) * 0.15 }} />
                ))}
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-[9px] text-white/20 font-mono">0s</span>
                <span className="text-[9px] text-[#a78bfa] font-mono font-bold">● ACTIVE</span>
              </div>
            </div>
          </div>

          {/* ── RIGHT PANEL (form) ── */}
          <div className="p-7 sm:p-10">
            <h1 className="text-2xl font-bold tracking-[-0.03em] text-white mb-1">Create an account</h1>
            <p className="text-sm text-white/30 mb-7">
              Already have an account?{" "}
              <Link href="/login" className="text-[#a78bfa] hover:text-white transition-colors">
                Log in
              </Link>
            </p>

            <div className="space-y-4">
              {/* Row 1 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Full Name *">
                  <input type="text" value={form.name} onChange={set("name")}
                    placeholder="Adithya Kumar" className={inputCls} />
                </Field>
                <Field label="Branch / Department *">
                  <input type="text" value={form.branch} onChange={set("branch")}
                    placeholder="Computer Science" className={inputCls} />
                </Field>
              </div>

              {/* Email */}
              <Field label="Email *">
                <input type="email" value={form.email} onChange={set("email")}
                  placeholder="you@college.edu" className={inputCls} />
              </Field>

              {/* Passwords */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Password *">
                  <div className="relative">
                    <input type={showPw ? "text" : "password"} value={form.password} onChange={set("password")}
                      placeholder="Min. 6 characters" className={inputCls + " pr-10"} />
                    <button type="button" onClick={() => setShowPw(p => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors">
                      {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </Field>
                <Field label="Confirm Password *">
                  <div className="relative">
                    <input type={showCpw ? "text" : "password"} value={form.confirmPassword} onChange={set("confirmPassword")}
                      placeholder="Re-enter password" className={inputCls + " pr-10"} />
                    <button type="button" onClick={() => setShowCpw(p => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors">
                      {showCpw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </Field>
              </div>

              {/* College */}
              <Field label="College / University *">
                <input type="text" value={form.college} onChange={set("college")}
                  placeholder="Anna University" className={inputCls} />
              </Field>

              {/* Course + Year */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Course">
                  <select value={form.course} onChange={set("course")}
                    className={inputCls + " cursor-pointer appearance-none"}>
                    {COURSES.map(c => <option key={c} value={c} className="bg-[#0d0d14]">{c}</option>)}
                  </select>
                </Field>
                <Field label="Year of Study">
                  <select value={form.year} onChange={set("year")}
                    className={inputCls + " cursor-pointer appearance-none"}>
                    {YEARS.map(y => <option key={y} value={y} className="bg-[#0d0d14]">{y}</option>)}
                  </select>
                </Field>
              </div>
            </div>

            {/* Submit */}
            <button onClick={handleSignup} disabled={isLoading}
              className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-[#7c3aed] hover:bg-[#6d28d9] py-3 text-sm font-semibold text-white shadow-[0_4px_24px_rgba(124,58,237,0.4)] hover:shadow-[0_6px_32px_rgba(124,58,237,0.55)] transition-all duration-200 hover:-translate-y-0.5 active:scale-[.98] disabled:cursor-not-allowed disabled:opacity-50">
              {isLoading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Creating account…
                </>
              ) : (
                <>Create account <ArrowRight className="w-4 h-4" /></>
              )}
            </button>

            <p className="mt-4 text-center text-[11px] text-white/20">
              By signing up you agree to our{" "}
              <span className="text-white/35 hover:text-white/60 cursor-pointer transition-colors">Terms of Service</span>
              {" & "}
              <span className="text-white/35 hover:text-white/60 cursor-pointer transition-colors">Privacy Policy</span>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
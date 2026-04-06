"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { apiRegister } from "@/lib/api";

const COURSES = ["B.Tech", "M.Tech", "B.Sc", "M.Sc", "BCA", "MCA", "MBA", "B.E", "M.E"];
const YEARS   = ["1st Year", "2nd Year", "3rd Year", "4th Year", "PG 1st Year", "PG 2nd Year"];
const SEMESTERS = ["1", "2", "3", "4", "5", "6", "7", "8"];

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#64748b]">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border border-[#1e2d47] bg-[#0d1524] px-4 py-2.5 text-sm text-white placeholder:text-[#64748b] outline-none transition-all duration-200 focus:border-[#3b82f6]/60 focus:bg-[#101828] focus:ring-2 focus:ring-[#3b82f6]/15 hover:border-white/10";

export default function SignupPage() {
  const router = useRouter();
  const { loginWithToken } = useAuth();

  const [form, setForm] = useState({
    name: "", email: "", password: "", confirmPassword: "",
    college: "", branch: "", course: "B.Tech", year: "1st Year", semester: "1",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPw, setShowPw]       = useState(false);
  const [showCpw, setShowCpw]     = useState(false);

  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm(prev => ({ ...prev, [k]: e.target.value }));

  const handleSignup = async () => {
    const { name, email, password, confirmPassword, college, branch, course, year, semester } = form;
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
      const { user, token } = await apiRegister({ name, email, password, college, branch, course, year, semester });
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
    <div className="relative min-h-screen bg-[#080c14] text-white flex items-center justify-center px-4 py-10 overflow-hidden">

      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/2 top-0 w-[700px] h-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#3b82f6]/10 blur-[120px]" />
        <div className="absolute right-0 bottom-0 w-[400px] h-[400px] rounded-full bg-[#3b82f6]/5 blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 w-full max-w-2xl"
      >
        {/* Nav row */}
        <div className="flex items-center justify-between mb-6 px-1">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#3b82f6] to-[#06b6d4] text-[10px] font-bold text-white shadow-[0_0_14px_rgba(59,130,246,0.5)]">AI</div>
            <span className="text-sm font-bold tracking-widest text-[#94a3b8]">AISMS</span>
          </Link>
          <Link href="/" className="flex items-center gap-1.5 text-xs text-[#64748b] hover:text-white/70 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to home
          </Link>
        </div>

        {/* Main card */}
        <div className="rounded-2xl border border-[#1e2d47] bg-[#101828] overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.5)]">

          {/* Form Panel */}
          <div className="p-7 sm:p-10">
            <h1 className="text-2xl font-bold tracking-[-0.03em] text-white mb-1">Create an account</h1>
            <p className="text-sm text-[#64748b] mb-7">
              Already have an account?{" "}
              <Link href="/login" className="text-[#06b6d4] hover:text-white transition-colors">
                Log in
              </Link>
            </p>

            <div className="space-y-4">
              {/* Row 1 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Full Name *">
                  <input type="text" value={form.name} onChange={set("name")}
                    className={inputCls} />
                </Field>
                <Field label="Branch / Department *">
                  <input type="text" value={form.branch} onChange={set("branch")}
                    className={inputCls} />
                </Field>
              </div>

              {/* Email */}
              <Field label="Email *">
                <input type="email" value={form.email} onChange={set("email")}
                  className={inputCls} />
              </Field>

              {/* Passwords */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Password *">
                  <div className="relative">
                    <input type={showPw ? "text" : "password"} value={form.password} onChange={set("password")}
                      className={inputCls + " pr-10"} />
                    <button type="button" onClick={() => setShowPw(p => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748b] hover:text-white/60 transition-colors">
                      {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </Field>
                <Field label="Confirm Password *">
                  <div className="relative">
                    <input type={showCpw ? "text" : "password"} value={form.confirmPassword} onChange={set("confirmPassword")}
                      className={inputCls + " pr-10"} />
                    <button type="button" onClick={() => setShowCpw(p => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748b] hover:text-white/60 transition-colors">
                      {showCpw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </Field>
              </div>

              {/* College */}
              <Field label="College / University *">
                <input type="text" value={form.college} onChange={set("college")}
                  className={inputCls} />
              </Field>

              {/* Course + Year + Semester */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Field label="Course">
                  <select value={form.course} onChange={set("course")}
                    className={inputCls + " cursor-pointer appearance-none"}>
                    {COURSES.map(c => <option key={c} value={c} className="bg-[#0d1524]">{c}</option>)}
                  </select>
                </Field>
                <Field label="Year of Study">
                  <select value={form.year} onChange={set("year")}
                    className={inputCls + " cursor-pointer appearance-none"}>
                    {YEARS.map(y => <option key={y} value={y} className="bg-[#0d1524]">{y}</option>)}
                  </select>
                </Field>
                <Field label="Semester">
                  <select value={form.semester} onChange={set("semester")}
                    className={inputCls + " cursor-pointer appearance-none"}>
                    {SEMESTERS.map(s => <option key={s} value={s} className="bg-[#0d1524]">Semester {s}</option>)}
                  </select>
                </Field>
              </div>
            </div>

            {/* Submit */}
            <button onClick={handleSignup} disabled={isLoading}
              className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-[#3b82f6] hover:bg-[#3b82f6] py-3 text-sm font-semibold text-white shadow-[0_4px_24px_rgba(59,130,246,0.4)] hover:shadow-[0_6px_32px_rgba(59,130,246,0.55)] transition-all duration-200 hover:-translate-y-0.5 active:scale-[.98] disabled:cursor-not-allowed disabled:opacity-50">
              {isLoading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Creating account...
                </>
              ) : (
                <>Create account <ArrowRight className="w-4 h-4" /></>
              )}
            </button>

            <p className="mt-4 text-center text-[11px] text-[#64748b]">
              By signing up you agree to our{" "}
              <span className="text-[#64748b] hover:text-white/60 cursor-pointer transition-colors">Terms of Service</span>
              {" & "}
              <span className="text-[#64748b] hover:text-white/60 cursor-pointer transition-colors">Privacy Policy</span>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
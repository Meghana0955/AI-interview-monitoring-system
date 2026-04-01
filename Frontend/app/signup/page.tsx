"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

export default function SignupPage() {
  const router = useRouter();
  const [role, setRole] = useState<"student" | "admin">("student");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = () => {
    if (!name || !email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    toast.success("Account created successfully!");
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#080c14] flex items-center justify-center px-4 pt-14">
      <div className="absolute inset-0 bg-grid opacity-50" />
      <div className="absolute w-96 h-96 top-1/4 left-1/2 -translate-x-1/2 bg-purple-500/8 rounded-full blur-[80px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="relative z-10 w-full max-w-sm"
      >
        <div className="bg-[#0f1724]/90 backdrop-blur-md border border-[#1e2d47] rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-7">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-700 to-blue-500 flex items-center justify-center text-sm font-bold text-white">AI</div>
            <div>
              <div className="text-sm font-bold text-purple-400">AISMS</div>
              <div className="text-[10px] text-slate-500">Interview Monitoring System</div>
            </div>
          </div>

          <h2 className="text-xl font-bold mb-1 tracking-tight">Create Account</h2>
          <p className="text-sm text-slate-400 mb-6">Join the monitoring platform</p>

          <div className="grid grid-cols-2 gap-2 mb-5">
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

          <div className="space-y-4 mb-6">
            {[
              { label: "Full Name",  type: "text",     val: name,     set: setName },
              { label: "Email",      type: "email",    val: email,    set: setEmail },
              { label: "Password",   type: "password", val: password, set: setPassword },
            ].map(({ label, type, val, set }) => (
              <div key={label}>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">{label}</label>
                <input
                  type={type}
                  value={val}
                  placeholder={label}
                  onChange={(e) => set(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#0d1421] border border-[#1e2d47] rounded-lg text-sm text-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 transition-all duration-200"
                />
              </div>
            ))}
          </div>

          <button
            onClick={handleSignup}
            className="w-full py-2.5 bg-gradient-to-r from-purple-700 to-blue-500 text-white rounded-lg font-semibold text-sm hover:shadow-[0_6px_20px_rgba(139,92,246,.35)] transition-all duration-200 active:scale-[.98]"
          >
            Create Account →
          </button>

          <div className="flex items-center gap-3 my-5 text-[11px] text-slate-600">
            <div className="flex-1 h-px bg-[#1e2d47]" />or<div className="flex-1 h-px bg-[#1e2d47]" />
          </div>

          <p className="text-center text-sm text-slate-400">
            Have an account?{" "}
            <Link href="/login" className="text-blue-400 hover:text-blue-300 underline transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

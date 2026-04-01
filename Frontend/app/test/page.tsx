"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { WebcamFeed } from "@/components/monitoring/WebcamFeed";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { formatTime, INTERVIEW_QUESTIONS, FEEDBACK_MESSAGES } from "@/lib/utils";

const TOTAL_SECS = 15 * 60;

export default function TestPage() {
  const router = useRouter();
  const [running, setRunning]     = useState(false);
  const [remaining, setRemaining] = useState(TOTAL_SECS);
  const [currentQ, setCurrentQ]   = useState(0);
  const [feedbacks, setFeedbacks] = useState<typeof FEEDBACK_MESSAGES[0][]>([]);
  const [riskPreview, setRisk]    = useState(0);
  const fbIdx = useRef(0);

  // Countdown
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setRemaining(r => {
        if (r <= 1) { endTest(); return 0; }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  // Feedback stream
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      const fb = FEEDBACK_MESSAGES[fbIdx.current % FEEDBACK_MESSAGES.length];
      fbIdx.current++;
      setFeedbacks(prev => [fb, ...prev].slice(0, 6));
      setRisk(Math.floor(Math.random() * 80));
    }, 5000);
    return () => clearInterval(id);
  }, [running]);

  const startTest = () => {
    setRunning(true);
    setRemaining(TOTAL_SECS);
    setFeedbacks([]);
    fbIdx.current = 0;
    toast.success("Test session started — monitoring active");
  };

  const endTest = () => {
    setRunning(false);
    toast.success("Test complete! Generating feedback…");
    setTimeout(() => router.push("/feedback"), 1200);
  };

  const progress = ((TOTAL_SECS - remaining) / TOTAL_SECS) * 100;
  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;

  return (
    <div className="min-h-screen bg-[#080c14] pt-14">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <motion.div initial={{ opacity:0,y:12 }} animate={{ opacity:1,y:0 }}>
            <h2 className="text-xl font-bold tracking-tight">Mock Interview Practice</h2>
            <div className="text-xs text-slate-500 mt-1">Simulate a real session before your actual interview</div>
          </motion.div>
          <Badge variant={running ? "red" : "green"}>
            {running ? "● Running" : "Ready"}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left */}
          <div className="flex flex-col gap-4">
            {/* Timer */}
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.1 }}>
              <Card className="text-center">
                <CardHeader title="Session Timer" />
                <div
                  className="text-7xl font-bold font-mono tracking-tighter py-4"
                  style={{ color: remaining < 60 ? "#ef4444" : "#06b6d4" }}
                >
                  {String(mins).padStart(2,"0")}:{String(secs).padStart(2,"0")}
                </div>
                <ProgressBar value={progress} color={running ? "#06b6d4" : "#1e2d47"} className="mb-5" />
                <div className="flex gap-3 justify-center flex-wrap">
                  {!running ? (
                    <Button onClick={startTest}>▶ Start Test</Button>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => setCurrentQ(q => Math.min(q + 1, INTERVIEW_QUESTIONS.length - 1))}
                      >
                        → Next Question
                      </Button>
                      <Button variant="danger" onClick={endTest}>⏹ End Test</Button>
                    </>
                  )}
                </div>
              </Card>
            </motion.div>

            {/* AI Feedback stream */}
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.2 }}>
              <Card>
                <CardHeader title="Simulated AI Feedback" right={running ? <span className="text-[10px] text-emerald-400 font-mono animate-pulse-dot">● LIVE</span> : undefined} />
                {feedbacks.length === 0 ? (
                  <div className="text-center py-8 text-sm text-slate-500">
                    {running ? "Analyzing…" : "Start the test to see real-time AI feedback"}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {feedbacks.map((f, i) => (
                      <Alert key={i} type={f.type} className={i === 0 ? "animate-slide-right" : ""}>{f.msg}</Alert>
                    ))}
                  </div>
                )}
              </Card>
            </motion.div>

            {/* Live risk preview */}
            {running && (
              <motion.div initial={{ opacity:0,scale:.95 }} animate={{ opacity:1,scale:1 }}>
                <Card>
                  <CardHeader title="Live Risk Preview" />
                  <div className="flex items-center gap-4">
                    <div
                      className="text-4xl font-bold font-mono"
                      style={{ color: riskPreview < 40 ? "#10b981" : riskPreview < 70 ? "#f59e0b" : "#ef4444" }}
                    >
                      {riskPreview}
                    </div>
                    <ProgressBar
                      value={riskPreview}
                      color={riskPreview < 40 ? "#10b981" : riskPreview < 70 ? "#f59e0b" : "#ef4444"}
                      className="flex-1"
                    />
                  </div>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Right */}
          <div className="flex flex-col gap-4">
            {/* Questions */}
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.15 }}>
              <Card>
                <CardHeader
                  title="Interview Questions"
                  right={<span className="text-xs text-slate-500">{currentQ + 1} / {INTERVIEW_QUESTIONS.length}</span>}
                />
                <div className="space-y-3">
                  {INTERVIEW_QUESTIONS.map((q, i) => (
                    <div
                      key={q.id}
                      className={`p-4 rounded-lg border transition-all duration-200 cursor-pointer ${
                        i === currentQ
                          ? "border-blue-500/40 bg-blue-500/8"
                          : i < currentQ
                          ? "border-emerald-500/20 bg-emerald-500/4 opacity-60"
                          : "border-[#1e2d47] bg-[#131e2e] opacity-40"
                      }`}
                      onClick={() => setCurrentQ(i)}
                    >
                      <div className="text-[10px] text-slate-500 font-medium uppercase tracking-wide mb-1">
                        Question {q.id} of {INTERVIEW_QUESTIONS.length}
                        {i < currentQ && " ✓"}
                      </div>
                      <div className="text-sm leading-relaxed text-slate-200">{q.q}</div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Camera */}
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.25 }}>
              <Card>
                <CardHeader title="Live Monitoring Preview" />
                <WebcamFeed label="PRACTICE MODE" />
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

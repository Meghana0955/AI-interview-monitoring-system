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
import { PageHeader } from "@/components/ui/PageHeader";
import { formatTime, INTERVIEW_QUESTIONS, FEEDBACK_MESSAGES } from "@/lib/utils";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import { Play, Square, ArrowRight, Clock } from "lucide-react";

const TOTAL_SECS = 15 * 60;

export default function TestPage() {
  const router = useRouter();
  const [running, setRunning]     = useState(false);
  const [remaining, setRemaining] = useState(TOTAL_SECS);
  const [currentQ, setCurrentQ]   = useState(0);
  const [feedbacks, setFeedbacks] = useState<typeof FEEDBACK_MESSAGES[0][]>([]);
  const [riskPreview, setRisk]    = useState(0);
  const fbIdx = useRef(0);

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
    toast.success("Test complete! Generating feedback...");
    setTimeout(() => router.push("/feedback"), 1200);
  };

  const progress = ((TOTAL_SECS - remaining) / TOTAL_SECS) * 100;
  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;

  return (
    <ProtectedRoute>
    <div className="min-h-screen bg-[#08080f] pt-24">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">

        <PageHeader
          title="Mock Interview Practice"
          subtitle="Simulate a real session before your actual interview"
          badge={
            <Badge variant={running ? "red" : "green"}>
              {running ? <><span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" /> Running</> : "Ready"}
            </Badge>
          }
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left */}
          <div className="flex flex-col gap-4">
            {/* Timer */}
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.1 }}>
              <Card className="text-center">
                <CardHeader title="Session Timer" right={<Clock className="w-4 h-4 text-white/20" />} />
                <div
                  className="text-7xl font-bold font-mono tracking-tighter py-4"
                  style={{ color: remaining < 60 ? "#ef4444" : "#7c3aed" }}
                >
                  {String(mins).padStart(2,"0")}:{String(secs).padStart(2,"0")}
                </div>
                <ProgressBar value={progress} color={running ? "#7c3aed" : "rgba(255,255,255,0.06)"} className="mb-5" />
                <div className="flex gap-3 justify-center flex-wrap">
                  {!running ? (
                    <Button onClick={startTest}>
                      <Play className="w-4 h-4" /> Start Test
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => setCurrentQ(q => Math.min(q + 1, INTERVIEW_QUESTIONS.length - 1))}
                      >
                        <ArrowRight className="w-4 h-4" /> Next Question
                      </Button>
                      <Button variant="danger" onClick={endTest}>
                        <Square className="w-4 h-4" /> End Test
                      </Button>
                    </>
                  )}
                </div>
              </Card>
            </motion.div>

            {/* AI Feedback stream */}
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.2 }}>
              <Card>
                <CardHeader
                  title="Simulated AI Feedback"
                  right={running ? <span className="text-[10px] text-emerald-400 font-mono animate-pulse-dot flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> LIVE</span> : undefined}
                />
                {feedbacks.length === 0 ? (
                  <div className="text-center py-8 text-sm text-white/25">
                    {running ? "Analyzing..." : "Start the test to see real-time AI feedback"}
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
                  right={<span className="text-xs text-white/25">{currentQ + 1} / {INTERVIEW_QUESTIONS.length}</span>}
                />
                <div className="space-y-3">
                  {INTERVIEW_QUESTIONS.map((q, i) => (
                    <div
                      key={q.id}
                      className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                        i === currentQ
                          ? "border-[#7c3aed]/30 bg-[#7c3aed]/[0.06]"
                          : i < currentQ
                          ? "border-emerald-500/15 bg-emerald-500/[0.03] opacity-60"
                          : "border-white/[0.04] bg-white/[0.01] opacity-40"
                      }`}
                      onClick={() => setCurrentQ(i)}
                    >
                      <div className="text-[10px] text-white/25 font-medium uppercase tracking-wide mb-1">
                        Question {q.id} of {INTERVIEW_QUESTIONS.length}
                        {i < currentQ && " · Done"}
                      </div>
                      <div className="text-sm leading-relaxed text-white/60">{q.q}</div>
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
    </ProtectedRoute>
  );
}

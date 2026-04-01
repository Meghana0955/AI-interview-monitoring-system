import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type RiskLevel = "low" | "medium" | "high";

export function getRiskLevel(score: number): RiskLevel {
  if (score < 40) return "low";
  if (score < 70) return "medium";
  return "high";
}

export function getRiskColor(level: RiskLevel) {
  return {
    low: { text: "text-emerald-400", bg: "bg-emerald-500/15", border: "border-emerald-500/30", hex: "#10b981" },
    medium: { text: "text-amber-400", bg: "bg-amber-500/15", border: "border-amber-500/30", hex: "#f59e0b" },
    high: { text: "text-red-400", bg: "bg-red-500/15", border: "border-red-500/30", hex: "#ef4444" },
  }[level];
}

export function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
  return `${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
}

export const MOCK_CANDIDATES = [
  { id: 1, name: "Rahul Sharma",  dept: "CS",  eye: 7,  face: 3, voice: 5,  risk: 54, level: "medium" as RiskLevel },
  { id: 2, name: "Priya Patel",   dept: "ECE", eye: 2,  face: 1, voice: 1,  risk: 18, level: "low"    as RiskLevel },
  { id: 3, name: "Arjun Mehta",   dept: "ME",  eye: 14, face: 8, voice: 11, risk: 87, level: "high"   as RiskLevel },
  { id: 4, name: "Sneha Reddy",   dept: "CS",  eye: 3,  face: 0, voice: 2,  risk: 22, level: "low"    as RiskLevel },
  { id: 5, name: "Vikram Kumar",  dept: "IT",  eye: 9,  face: 5, voice: 7,  risk: 71, level: "high"   as RiskLevel },
  { id: 6, name: "Ananya Singh",  dept: "CS",  eye: 1,  face: 1, voice: 3,  risk: 15, level: "low"    as RiskLevel },
  { id: 7, name: "Rohan Das",     dept: "ECE", eye: 6,  face: 2, voice: 4,  risk: 48, level: "medium" as RiskLevel },
];

export const MOCK_RISK_HISTORY = [20, 35, 28, 45, 58, 42, 67, 54, 48, 61, 53, 44, 57, 62, 54];

export const INTERVIEW_QUESTIONS = [
  { id: 1, q: "Describe a challenging technical project you worked on. What was your approach to solving the core problem?" },
  { id: 2, q: "How do you handle conflicting priorities when managing multiple deadlines simultaneously?" },
  { id: 3, q: "Explain a situation where you had to quickly learn a new technology. How did you adapt?" },
  { id: 4, q: "Walk me through your understanding of system design and scalability principles." },
  { id: 5, q: "What is your approach to debugging complex issues in production systems?" },
];

export const FEEDBACK_MESSAGES = [
  { type: "ok" as const,   msg: "Good eye contact maintained for 45 seconds" },
  { type: "warn" as const, msg: "Slight gaze deviation detected — refocus on camera" },
  { type: "ok" as const,   msg: "Voice clarity excellent — no background noise" },
  { type: "warn" as const, msg: "Posture shift detected — sit upright" },
  { type: "ok" as const,   msg: "Facial expression positive and engaged" },
  { type: "err" as const,  msg: "Looking away — please maintain camera focus" },
];

// Flask backend API integration
// Base URL: set NEXT_PUBLIC_API_URL in .env.local
// e.g. NEXT_PUBLIC_API_URL=http://localhost:5000

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export interface LiveData {
  eye:   { direction: string; violations: number; status: "normal" | "warning" | "critical" };
  face:  { detected: boolean; persons: number;    violations: number };
  voice: { level: number;     noise: boolean;     violations: number };
  risk:  { score: number;     level: "low" | "medium" | "high" };
}

export interface SessionSummary {
  duration:      number;
  eyeViolations: number;
  faceViolations:number;
  voiceViolations:number;
  avgRisk:       number;
  riskHistory:   number[];
  evaluation:    "good" | "needs_improvement" | "high_risk";
}

export interface FeedbackResponse {
  suggestions: { category: string; message: string; compliance: number }[];
  score:       number;
}

// Fallback mock data so the app works without a running Flask server
const MOCK_LIVE: LiveData = {
  eye:   { direction: "Forward", violations: 7, status: "normal" },
  face:  { detected: true, persons: 1, violations: 3 },
  voice: { level: 42, noise: false, violations: 5 },
  risk:  { score: 54, level: "medium" },
};

async function safeFetch<T>(url: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(url, { next: { revalidate: 0 } });
    if (!res.ok) return fallback;
    return res.json();
  } catch {
    return fallback;
  }
}

export async function getLiveData(): Promise<LiveData> {
  return safeFetch<LiveData>(`${BASE}/live-data`, MOCK_LIVE);
}

export async function getSessionSummary(): Promise<SessionSummary> {
  return safeFetch<SessionSummary>(`${BASE}/session-summary`, {
    duration: 1427,
    eyeViolations: 7,
    faceViolations: 3,
    voiceViolations: 5,
    avgRisk: 54,
    riskHistory: [20, 35, 58, 42, 67, 54],
    evaluation: "needs_improvement",
  });
}

export async function getFeedback(): Promise<FeedbackResponse> {
  return safeFetch<FeedbackResponse>(`${BASE}/feedback`, {
    suggestions: [
      { category: "Eye Contact",   message: "Maintain consistent gaze toward the camera. Practice focusing on a fixed center point.",    compliance: 62 },
      { category: "Audio",         message: "Reduce background noise. Use noise-cancellation headphones or choose a quieter environment.", compliance: 78 },
      { category: "Face Presence", message: "Excellent single-person presence maintained throughout. No identity violations detected.",    compliance: 95 },
    ],
    score: 54,
  });
}

export async function startSession(): Promise<{ sessionId: string }> {
  try {
    const res = await fetch(`${BASE}/start-session`, { method: "POST" });
    return res.json();
  } catch {
    return { sessionId: `session-${Date.now()}` };
  }
}

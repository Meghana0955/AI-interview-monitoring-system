/**
 * AISMS API Client
 * ================
 * Connects to the Flask backend API for real-time AI monitoring data.
 * Falls back to mock data gracefully when the backend is not running.
 *
 * Backend: http://localhost:5000
 * Set NEXT_PUBLIC_API_URL in .env.local to override.
 */

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

// ── Types ─────────────────────────────────────────────────────

export interface LiveData {
  running: boolean;
  session_id?: string;
  elapsed?: number;
  eye: {
    direction: string;
    status: "normal" | "warning";
    violations: number;
  };
  face: {
    detected: boolean;
    count: number;
    status: string;
    violations: number;
  };
  voice: {
    status: string;
    noise_detected: boolean;
    violations: number;
  };
  risk: {
    score: number;
    level: "LOW" | "MEDIUM" | "HIGH";
    history: number[];
  };
  alerts: { id?: number; type: "ok" | "warn" | "err"; msg: string }[];
}

export interface SessionSummary {
  duration: number;
  eye_violations: number;
  face_violations: number;
  voice_violations: number;
  avg_risk: number;
  risk_history: number[];
  evaluation: "good" | "needs_improvement" | "high_risk";
  total_records?: number;
}

export interface FeedbackResponse {
  suggestions: { category: string; message: string; compliance: number }[];
  score: number;
  eye_issues?: number;
  face_issues?: number;
  voice_issues?: number;
}

export interface StartSessionResponse {
  status: string;
  session_id: string;
  voice_available: boolean;
}

export interface StopSessionResponse {
  status: string;
  summary: {
    session_id: string;
    duration: number;
    eye_violations: number;
    face_violations: number;
    voice_violations: number;
    avg_risk: number;
    risk_history: number[];
    total_records: number;
  };
}

export interface HealthResponse {
  status: string;
  voice_available: boolean;
  timestamp: string;
}

// ── Mock fallback data ────────────────────────────────────────

const MOCK_LIVE: LiveData = {
  running: false,
  eye: { direction: "center", status: "normal", violations: 0 },
  face: { detected: true, count: 1, status: "Normal", violations: 0 },
  voice: { status: "Normal", noise_detected: false, violations: 0 },
  risk: { score: 0, level: "LOW", history: [] },
  alerts: [],
};

// ── Helpers ───────────────────────────────────────────────────

async function safeFetch<T>(url: string, fallback: T, options?: RequestInit): Promise<T> {
  try {
    const res = await fetch(url, {
      ...options,
      signal: AbortSignal.timeout(5000), // 5s timeout
    });
    if (!res.ok) return fallback;
    return res.json();
  } catch {
    return fallback;
  }
}

async function safePost<T>(url: string, fallback: T): Promise<T> {
  return safeFetch<T>(url, fallback, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
}

// ── API Functions ─────────────────────────────────────────────

/** Check if the backend server is reachable */
export async function checkHealth(): Promise<HealthResponse | null> {
  try {
    const res = await fetch(`${BASE}/api/health`, {
      signal: AbortSignal.timeout(2000),
    });
    if (res.ok) return res.json();
    return null;
  } catch {
    return null;
  }
}

/** Start a new monitoring session (initializes webcam + mic on backend) */
export async function startSession(userId?: string): Promise<StartSessionResponse> {
  try {
    const res = await fetch(`${BASE}/api/session/start`, {
      method: "POST",
      headers: authHeaders() as HeadersInit,
      body: JSON.stringify(userId ? { user_id: userId } : {}),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error("Failed to start session");
    return res.json();
  } catch {
    return {
      status: "mock",
      session_id: `mock-${Date.now()}`,
      voice_available: false,
    };
  }
}

/** Stop the current monitoring session */
export async function stopSession(userId?: string): Promise<StopSessionResponse> {
  try {
    const res = await fetch(`${BASE}/api/session/stop`, {
      method: "POST",
      headers: authHeaders() as HeadersInit,
      body: JSON.stringify(userId ? { user_id: userId } : {}),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error("Failed to stop session");
    return res.json();
  } catch {
    return {
      status: "mock",
      summary: {
        session_id: "mock",
        duration: 0,
        eye_violations: 0,
        face_violations: 0,
        voice_violations: 0,
        avg_risk: 0,
        risk_history: [],
        total_records: 0,
      },
    };
  }
}

/** Get real-time monitoring data (poll this every 1-2 seconds) */
export async function getLiveData(): Promise<LiveData> {
  return safeFetch<LiveData>(`${BASE}/api/live-data`, MOCK_LIVE);
}

/** Result from processing a single webcam frame */
export interface FrameResult {
  eye: { direction: string; status: string; violations: number };
  face: { detected: boolean; count: number; status: string; violations: number };
  voice: { status: string; noise_detected: boolean; violations: number; audio_level?: number };
  risk: { score: number; level: string };
  elapsed: number;
}

/** Send a webcam frame (base64 JPEG) to the backend for AI processing */
export async function processFrame(base64Frame: string): Promise<FrameResult | null> {
  try {
    const res = await fetch(`${BASE}/api/process-frame`, {
      method: "POST",
      headers: authHeaders() as HeadersInit,
      body: JSON.stringify({ frame: base64Frame }),
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

/** Get session summary (after stopping a session) */
export async function getSessionSummary(): Promise<SessionSummary> {
  return safeFetch<SessionSummary>(`${BASE}/api/session-summary`, {
    duration: 0,
    eye_violations: 0,
    face_violations: 0,
    voice_violations: 0,
    avg_risk: 0,
    risk_history: [],
    evaluation: "good",
  });
}

/** Get AI-generated feedback from the last session */
export async function getFeedback(): Promise<FeedbackResponse> {
  return safeFetch<FeedbackResponse>(`${BASE}/api/feedback`, {
    suggestions: [
      {
        category: "No Data",
        message: "No session data available. Complete a monitoring session to receive AI feedback.",
        compliance: 0,
      },
    ],
    score: 0,
  });
}

// ── Auth Types ─────────────────────────────────────────────────

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  college: string;
  branch: string;
  course: string;
  year: string;
  role: "student" | "admin";
}

export interface SessionRecord {
  id: string;
  user_id: string;
  session_date: string;
  duration_sec: number;
  eye_violations: number;
  face_violations: number;
  voice_violations: number;
  avg_risk: number;
  max_risk: number;
  risk_level: string;
  evaluation: "good" | "needs_improvement" | "high_risk";
  integrity_score: number;
  total_records: number;
}

export interface SessionDataPoint {
  id: number;
  session_id: string;
  eye: string;
  face: string;
  voice: string;
  score: number;
  level: string;
  timestamp: number;
}

export interface SessionDetailResponse {
  session: SessionRecord;
  session_data: SessionDataPoint[];
  risk_history: number[];
  total_records: number;
}

export interface RegisterData {
  name: string; email: string; password: string;
  college: string; branch: string; course: string; year: string;
}

// ── Token helpers ──────────────────────────────────────────────

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("aisms_token");
}

function authHeaders() {
  const t = getToken();
  return t ? { "Authorization": `Bearer ${t}`, "Content-Type": "application/json" }
           : { "Content-Type": "application/json" };
}

// ── Auth API ───────────────────────────────────────────────────

export async function apiRegister(data: RegisterData): Promise<{ user: UserProfile; token: string }> {
  const res = await fetch(`${BASE}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    signal: AbortSignal.timeout(10000),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Registration failed");
  return json;
}

export async function apiLogin(email: string, password: string): Promise<{ user: UserProfile; token: string }> {
  const res = await fetch(`${BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    signal: AbortSignal.timeout(10000),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Login failed");
  return json;
}

export async function apiMe(): Promise<UserProfile | null> {
  try {
    const res = await fetch(`${BASE}/api/auth/me`, {
      headers: authHeaders() as HeadersInit,
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.user;
  } catch { return null; }
}

// ── User Sessions API ──────────────────────────────────────────

export async function getUserSessions(userId: string): Promise<{ sessions: SessionRecord[]; user: UserProfile } | null> {
  try {
    const res = await fetch(`${BASE}/api/users/${userId}/sessions`, {
      headers: authHeaders() as HeadersInit,
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

export async function getSessionRiskHistory(sessionId: string): Promise<number[]> {
  try {
    const res = await fetch(`${BASE}/api/users/sessions/${sessionId}/records`, {
      headers: authHeaders() as HeadersInit,
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.risk_history || [];
  } catch { return []; }
}

export async function getUserSessionDetail(userId: string, sessionId: string): Promise<SessionDetailResponse | null> {
  try {
    const res = await fetch(`${BASE}/api/users/${userId}/sessions/${sessionId}`, {
      headers: authHeaders() as HeadersInit,
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

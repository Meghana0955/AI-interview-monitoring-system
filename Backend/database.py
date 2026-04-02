"""
AISMS Database Layer
====================
SQLite database with:
    - users: student profiles with authentication
    - sessions: per-user session summaries
    - session_data: raw frame-by-frame data per session
"""

import os
import sqlite3
import uuid
from datetime import datetime

import bcrypt

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "aisms.db")


def get_conn():
    """Get a thread-local SQLite connection with row_factory."""
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA foreign_keys=ON")
    return conn


def init_db():
    """Create all tables if they don't exist."""
    conn = get_conn()
    c = conn.cursor()

    c.executescript("""
        CREATE TABLE IF NOT EXISTS users (
            id          TEXT PRIMARY KEY,
            name        TEXT NOT NULL,
            email       TEXT NOT NULL UNIQUE,
            password_hash TEXT NOT NULL,
            college     TEXT NOT NULL DEFAULT '',
            branch      TEXT NOT NULL DEFAULT '',
            course      TEXT NOT NULL DEFAULT 'B.Tech',
            year        TEXT NOT NULL DEFAULT '1st Year',
            role        TEXT NOT NULL DEFAULT 'student',
            created_at  TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS auth_tokens (
            token       TEXT PRIMARY KEY,
            user_id     TEXT NOT NULL,
            created_at  TEXT NOT NULL,
            FOREIGN KEY(user_id) REFERENCES users(id)
        );

        CREATE TABLE IF NOT EXISTS sessions (
            id               TEXT PRIMARY KEY,
            user_id          TEXT NOT NULL,
            session_date     TEXT NOT NULL,
            duration_sec     INTEGER NOT NULL DEFAULT 0,
            eye_violations   INTEGER NOT NULL DEFAULT 0,
            face_violations  INTEGER NOT NULL DEFAULT 0,
            voice_violations INTEGER NOT NULL DEFAULT 0,
            avg_risk         REAL NOT NULL DEFAULT 0,
            max_risk         REAL NOT NULL DEFAULT 0,
            risk_level       TEXT NOT NULL DEFAULT 'LOW',
            evaluation       TEXT NOT NULL DEFAULT 'needs_improvement',
            integrity_score  INTEGER NOT NULL DEFAULT 100,
            total_records    INTEGER NOT NULL DEFAULT 0,
            FOREIGN KEY(user_id) REFERENCES users(id)
        );

        CREATE TABLE IF NOT EXISTS session_data (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id  TEXT NOT NULL,
            eye         TEXT,
            face        TEXT,
            voice       TEXT,
            score       REAL,
            level       TEXT,
            timestamp   REAL,
            FOREIGN KEY(session_id) REFERENCES sessions(id)
        );
    """)

    conn.commit()
    conn.close()
    print("✅ Database initialised at", DB_PATH)


# ── User helpers ──────────────────────────────────────────────

def create_user(name: str, email: str, password: str, college: str,
                branch: str, course: str, year: str, role: str = "student") -> dict:
    """Hash password and insert user. Returns user dict or raises ValueError."""
    conn = get_conn()
    try:
        # Check duplicate email
        existing = conn.execute("SELECT id FROM users WHERE email=?", (email.lower(),)).fetchone()
        if existing:
            raise ValueError("An account with this email already exists.")

        uid = str(uuid.uuid4())
        pw_hash = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()
        now = datetime.now().isoformat()

        conn.execute("""
            INSERT INTO users (id, name, email, password_hash, college, branch, course, year, role, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (uid, name, email.lower(), pw_hash, college, branch, course, year, role, now))
        conn.commit()

        return {
            "id": uid, "name": name, "email": email.lower(),
            "college": college, "branch": branch, "course": course,
            "year": year, "role": role,
        }
    finally:
        conn.close()


def authenticate_user(email: str, password: str) -> dict | None:
    """Verify credentials. Returns user dict or None."""
    conn = get_conn()
    try:
        row = conn.execute("SELECT * FROM users WHERE email=?", (email.lower(),)).fetchone()
        if not row:
            return None
        if not bcrypt.checkpw(password.encode(), row["password_hash"].encode()):
            return None
        return {
            "id": row["id"], "name": row["name"], "email": row["email"],
            "college": row["college"], "branch": row["branch"],
            "course": row["course"], "year": row["year"], "role": row["role"],
        }
    finally:
        conn.close()


def create_token(user_id: str) -> str:
    """Create and store an auth token for a user."""
    conn = get_conn()
    try:
        token = str(uuid.uuid4())
        conn.execute(
            "INSERT INTO auth_tokens(token, user_id, created_at) VALUES (?,?,?)",
            (token, user_id, datetime.now().isoformat())
        )
        conn.commit()
        return token
    finally:
        conn.close()


def get_user_by_token(token: str) -> dict | None:
    """Return user dict from a valid token, or None."""
    if not token:
        return None
    conn = get_conn()
    try:
        row = conn.execute("""
            SELECT u.* FROM users u
            JOIN auth_tokens t ON t.user_id = u.id
            WHERE t.token = ?
        """, (token,)).fetchone()
        if not row:
            return None
        return {
            "id": row["id"], "name": row["name"], "email": row["email"],
            "college": row["college"], "branch": row["branch"],
            "course": row["course"], "year": row["year"], "role": row["role"],
        }
    finally:
        conn.close()


def get_user_by_id(user_id: str) -> dict | None:
    conn = get_conn()
    try:
        row = conn.execute("SELECT * FROM users WHERE id=?", (user_id,)).fetchone()
        if not row:
            return None
        return dict(row)
    finally:
        conn.close()


# ── Session helpers ───────────────────────────────────────────

def save_session(user_id: str, session_id: str, duration_sec: int,
                 eye_violations: int, face_violations: int, voice_violations: int,
                 avg_risk: float, max_risk: float, risk_level: str,
                 evaluation: str, total_records: int,
                 raw_records: list) -> dict:
    """Save a completed session + all raw frame records to the database."""
    conn = get_conn()
    try:
        total_violations = eye_violations + face_violations + voice_violations
        integrity_score = max(20, 100 - total_violations * 2)
        now = datetime.now().isoformat()

        conn.execute("""
            INSERT OR REPLACE INTO sessions
            (id, user_id, session_date, duration_sec,
             eye_violations, face_violations, voice_violations,
             avg_risk, max_risk, risk_level, evaluation,
             integrity_score, total_records)
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)
        """, (
            session_id, user_id, now, duration_sec,
            eye_violations, face_violations, voice_violations,
            round(avg_risk, 2), round(max_risk, 2), risk_level,
            evaluation, integrity_score, total_records,
        ))

        # Bulk insert raw records
        if raw_records:
            conn.executemany("""
                INSERT INTO session_data
                (session_id, eye, face, voice, score, level, timestamp)
                VALUES (?,?,?,?,?,?,?)
            """, [
                (session_id, r.get("eye"), r.get("face"), r.get("voice"),
                 r.get("score"), r.get("level"), r.get("time"))
                for r in raw_records
            ])

        conn.commit()
        return get_session(session_id)
    finally:
        conn.close()


def get_user_sessions(user_id: str) -> list:
    """Return all sessions for a user, newest first."""
    conn = get_conn()
    try:
        rows = conn.execute("""
            SELECT * FROM sessions
            WHERE user_id = ?
            ORDER BY session_date DESC
        """, (user_id,)).fetchall()
        return [dict(r) for r in rows]
    finally:
        conn.close()


def get_session(session_id: str) -> dict | None:
    conn = get_conn()
    try:
        row = conn.execute("SELECT * FROM sessions WHERE id=?", (session_id,)).fetchone()
        return dict(row) if row else None
    finally:
        conn.close()


def get_session_data(session_id: str) -> list:
    conn = get_conn()
    try:
        rows = conn.execute(
            "SELECT * FROM session_data WHERE session_id=? ORDER BY timestamp",
            (session_id,)
        ).fetchall()
        return [dict(r) for r in rows]
    finally:
        conn.close()


def get_session_records(session_id: str) -> list:
    """Backward-compatible alias for older callers."""
    return get_session_data(session_id)


# ── Bootstrap ─────────────────────────────────────────────────
if __name__ == "__main__":
    init_db()
    print("Database ready.")

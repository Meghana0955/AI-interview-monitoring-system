# AISMS — AI Interview Monitoring System

> AI-Powered Interview Monitoring & Behavioral Analysis System  
> Built with **Next.js 14 (App Router)** · **Tailwind CSS** · **Framer Motion** · **Recharts**

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy env file
cp .env.local.example .env.local

# 3. Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
aisms/
├── app/
│   ├── layout.tsx          ← Root layout + fonts + Toaster
│   ├── globals.css         ← Global styles + animations
│   ├── page.tsx            ← Landing page
│   ├── login/page.tsx      ← Login (Student / Admin)
│   ├── signup/page.tsx     ← Signup
│   ├── dashboard/page.tsx  ← Main dashboard (live charts)
│   ├── interview/page.tsx  ← Live session monitoring
│   ├── feedback/page.tsx   ← Performance & AI feedback
│   ├── test/page.tsx       ← Mock interview practice
│   └── admin/page.tsx      ← Admin panel (candidate table)
│
├── components/
│   ├── layout/
│   │   └── Navbar.tsx
│   ├── ui/
│   │   ├── Badge.tsx       ← Badge + RiskBadge
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── StatCard.tsx
│   │   ├── Alert.tsx
│   │   └── ProgressBar.tsx
│   ├── monitoring/
│   │   ├── WebcamFeed.tsx  ← Cam placeholder + face mesh overlay
│   │   └── LiveIndicators.tsx
│   └── charts/
│       ├── RiskLineChart.tsx
│       ├── ViolationsBarChart.tsx
│       ├── BehaviorPieChart.tsx
│       ├── ImprovementChart.tsx
│       └── AdminCharts.tsx
│
└── lib/
    ├── utils.ts            ← cn(), helpers, mock data
    └── api.ts              ← Flask API integration layer
```

---

## 🔗 Flask API Integration

Set `NEXT_PUBLIC_API_URL=http://localhost:5000` in `.env.local`.

The app works **without a Flask server** — all endpoints fall back to mock data automatically.

| Endpoint              | Method | Description                        |
|-----------------------|--------|------------------------------------|
| `/live-data`          | GET    | eye, face, voice, risk data        |
| `/session-summary`    | GET    | session stats + risk history       |
| `/feedback`           | GET    | AI-generated suggestions           |
| `/start-session`      | POST   | create a new session               |

All calls are in `lib/api.ts` — replace mock fallbacks with real data as you build the backend.

---

## 🎨 Design System

- **Theme**: Dark cybersecurity dashboard aesthetic
- **Colors**: Cyan (`#06b6d4`), Blue (`#3b82f6`), Purple (`#8b5cf6`), Amber (`#f59e0b`), Green (`#10b981`), Red (`#ef4444`)
- **Typography**: Space Grotesk (sans) + JetBrains Mono (monospace)
- **Animations**: Framer Motion page transitions + CSS keyframe scanning effects

---

## 📦 Build for Production

```bash
npm run build
npm start
```

---

## 🧪 Tech Stack

| Layer     | Technology                    |
|-----------|-------------------------------|
| Framework | Next.js 14 (App Router)       |
| Styling   | Tailwind CSS                  |
| Animation | Framer Motion                 |
| Charts    | Recharts                      |
| Fonts     | Google Fonts (next/font)      |
| Toasts    | react-hot-toast               |
| Icons     | Lucide React                  |
| Language  | TypeScript                    |

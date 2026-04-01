import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-space)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      colors: {
        bg: {
          DEFAULT: "#080c14",
          secondary: "#0d1421",
          tertiary: "#111827",
        },
        card: {
          DEFAULT: "#0f1724",
          secondary: "#131e2e",
        },
        border: {
          DEFAULT: "#1e2d47",
          secondary: "#243655",
        },
        neon: {
          cyan: "#06b6d4",
          blue: "#3b82f6",
          purple: "#8b5cf6",
          green: "#10b981",
          amber: "#f59e0b",
          red: "#ef4444",
        },
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        float: "float 8s ease-in-out infinite",
        "scan-ring": "scanRing 2s ease-out infinite",
        "audio-bar": "audioBar 1.2s ease-in-out infinite alternate",
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
        "slide-in-right": "slideInRight 0.3s ease-out",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        scanRing: {
          "0%": { width: "40px", height: "40px", opacity: "0.8" },
          "100%": { width: "120px", height: "120px", opacity: "0" },
        },
        audioBar: {
          to: { width: "75%" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideInRight: {
          from: { opacity: "0", transform: "translateX(100%)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(rgba(30,45,71,.35) 1px, transparent 1px), linear-gradient(90deg, rgba(30,45,71,.35) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "40px 40px",
      },
    },
  },
  plugins: [],
};
export default config;

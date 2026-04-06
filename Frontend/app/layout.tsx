import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/layout/Navbar";
import { AuthProvider } from "@/contexts/AuthContext";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "AISMS — AI Interview Monitoring System",
  description:
    "AI-Powered Interview Monitoring & Behavioral Analysis System. Ensuring Integrity, Enhancing Performance.",
  keywords: ["AI", "interview", "monitoring", "behavioral analysis", "eye tracking", "face detection"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSans.variable} dark`}>
      <body className="min-h-screen bg-[#080c14] text-[#e2e8f0] font-sans antialiased">
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute left-1/2 top-0 h-[42rem] w-[42rem] -translate-x-1/2 rounded-full bg-[#06b6d4]/[0.07] blur-[160px]" />
          <div className="absolute right-[-8rem] top-[14rem] h-[24rem] w-[24rem] rounded-full bg-[#3b82f6]/[0.07] blur-[140px]" />
          <div className="absolute bottom-[-10rem] left-[-6rem] h-[28rem] w-[28rem] rounded-full bg-[#8b5cf6]/[0.05] blur-[160px]" />
        </div>
        <AuthProvider>
          <Navbar />
          <main className="relative">{children}</main>
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "#101828",
                color: "#e2e8f0",
                border: "1px solid #1e2d47",
                borderRadius: "16px",
                fontSize: "13px",
                fontFamily: "var(--font-sans)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
                backdropFilter: "blur(20px)",
              },
              success: { iconTheme: { primary: "#10b981", secondary: "#101828" } },
              error:   { iconTheme: { primary: "#ef4444", secondary: "#101828" } },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}

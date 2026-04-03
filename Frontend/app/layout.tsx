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
      <body className="bg-[#08080f] text-white font-sans antialiased">
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "#0e0e1a",
                color: "#ffffff",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "12px",
                fontSize: "13px",
                fontFamily: "var(--font-sans)",
              },
              success: { iconTheme: { primary: "#10b981", secondary: "#0e0e1a" } },
              error:   { iconTheme: { primary: "#ef4444", secondary: "#0e0e1a" } },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}

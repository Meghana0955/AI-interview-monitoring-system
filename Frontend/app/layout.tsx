import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/layout/Navbar";
import { AuthProvider } from "@/contexts/AuthContext";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "AISMS — AI Interview Monitoring System",
  description:
    "AI-Powered Interview Monitoring & Behavioral Analysis System. Ensuring Integrity, Enhancing Performance.",
  keywords: ["AI", "interview", "monitoring", "behavioral analysis", "eye tracking", "face detection"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} dark`}>
      <body className="bg-[#080c14] text-slate-200 font-sans antialiased">
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "#131e2e",
                color: "#e2e8f0",
                border: "1px solid #243655",
                borderRadius: "8px",
                fontSize: "13px",
                fontFamily: "var(--font-space)",
              },
              success: { iconTheme: { primary: "#10b981", secondary: "#131e2e" } },
              error:   { iconTheme: { primary: "#ef4444", secondary: "#131e2e" } },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}

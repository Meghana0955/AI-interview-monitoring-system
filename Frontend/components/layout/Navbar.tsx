"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/",          label: "Home" },
  { href: "/login",     label: "Login" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/interview", label: "Session" },
  { href: "/feedback",  label: "Feedback" },
  { href: "/test",      label: "Test" },
  { href: "/admin",     label: "Admin" },
];

export default function Navbar() {
  const path = usePathname();
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center px-4 md:px-6 gap-2 bg-[#080c14]/90 backdrop-blur-md border-b border-[#1e2d47]">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 mr-4 flex-shrink-0">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-700 to-cyan-500 flex items-center justify-center text-xs font-bold text-white">
          AI
        </div>
        <span className="text-sm font-bold text-cyan-400 hidden sm:block">
          AISMS <span className="text-slate-500 font-normal">/ Monitoring</span>
        </span>
      </Link>

      {/* Nav links — scrollable on mobile */}
      <div className="flex gap-1.5 overflow-x-auto flex-1 scrollbar-none" style={{ scrollbarWidth: "none" }}>
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={cn(
              "px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all duration-200 border flex-shrink-0",
              path === l.href
                ? "bg-blue-700 text-white border-blue-700"
                : "bg-transparent text-slate-400 border-[#1e2d47] hover:border-blue-500/50 hover:text-blue-300 hover:bg-blue-500/5"
            )}
          >
            {l.label}
          </Link>
        ))}
      </div>

      {/* Live indicator */}
      <div className="flex items-center gap-2 flex-shrink-0 ml-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981] animate-pulse-dot" />
        <span className="text-[10px] text-slate-500 font-mono hidden sm:block">LIVE</span>
      </div>
    </nav>
  );
}

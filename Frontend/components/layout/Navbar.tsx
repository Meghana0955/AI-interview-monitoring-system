"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import { LogOut, Menu, X } from "lucide-react";

/* ─── Nav link definitions ───────────────────────────────────────────────── */
const publicLinks = [
  { href: "/",          label: "Home"     },
  { href: "/#features", label: "Features" },
  { href: "/#about",    label: "About"    },
];

const authLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/interview", label: "Session"   },
];

/* ─── Component ──────────────────────────────────────────────────────────── */
export default function Navbar() {
  const path              = usePathname();
  const router            = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/");
    setMobileOpen(false);
  };

  /* Resolve which links to render */
  const links = isAuthenticated ? authLinks : publicLinks;

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center px-4 md:px-6 gap-2 bg-[#080c14]/90 backdrop-blur-md border-b border-[#1e2d47]">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 mr-4 flex-shrink-0"
          onClick={() => setMobileOpen(false)}
        >
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-700 to-cyan-500 flex items-center justify-center text-xs font-bold text-white">
            AI
          </div>
          <span className="text-sm font-bold text-cyan-400 hidden sm:block">
            AISMS <span className="text-slate-500 font-normal">/ Monitoring</span>
          </span>
        </Link>

        {/* Desktop nav links — hidden on mobile */}
        <div
          className="hidden md:flex gap-1.5 flex-1 overflow-x-auto scrollbar-none"
          style={{ scrollbarWidth: "none" }}
        >
          {!isLoading &&
            links.map((l) => (
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

        {/* Right side */}
        <div className="flex items-center gap-2 flex-shrink-0 ml-auto">
          {/* Live pulse */}
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981] animate-pulse-dot" />
          <span className="text-[10px] text-slate-500 font-mono hidden sm:block">LIVE</span>

          {/* Authenticated: user chip + logout */}
          {!isLoading && isAuthenticated && (
            <>
              <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#131e2e] border border-[#243655] text-xs text-slate-300">
                <div className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-700 to-cyan-500 flex items-center justify-center text-[9px] font-bold text-white">
                  {user?.name.charAt(0).toUpperCase()}
                </div>
                <span className="max-w-[90px] truncate">{user?.name}</span>
              </div>
              <button
                onClick={handleLogout}
                title="Logout"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium border border-[#1e2d47] text-slate-400 hover:border-red-500/50 hover:text-red-400 hover:bg-red-500/5 transition-all duration-200"
              >
                <LogOut className="w-3 h-3" />
                <span className="hidden sm:block">Logout</span>
              </button>
            </>
          )}

          {/* Unauthenticated: Login button */}
          {!isLoading && !isAuthenticated && (
            <Link
              href="/login"
              className="px-4 py-1.5 rounded-md text-xs font-semibold bg-gradient-to-r from-blue-700 to-blue-500 text-white hover:shadow-[0_4px_14px_rgba(59,130,246,.4)] hover:-translate-y-px transition-all duration-200"
            >
              Login
            </Link>
          )}

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-1.5 rounded-md text-slate-400 hover:text-slate-200 transition-colors"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-x-0 top-14 z-40 bg-[#0a111f]/95 backdrop-blur-md border-b border-[#1e2d47] md:hidden">
          <div className="flex flex-col gap-1 p-4">
            {!isLoading &&
              links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                    path === l.href
                      ? "bg-blue-700 text-white"
                      : "text-slate-400 hover:bg-[#131e2e] hover:text-blue-300"
                  )}
                >
                  {l.label}
                </Link>
              ))}

            {!isLoading && isAuthenticated && (
              <button
                onClick={handleLogout}
                className="mt-2 flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-all duration-200"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            )}

            {!isLoading && !isAuthenticated && (
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="mt-2 text-center px-4 py-2.5 rounded-lg text-sm font-semibold bg-gradient-to-r from-blue-700 to-blue-500 text-white"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
}

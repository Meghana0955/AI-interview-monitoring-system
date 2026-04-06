"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu, X, LogOut, LayoutDashboard, MonitorPlay, GraduationCap,
  BarChart3, User, ChevronDown, Settings, ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

/* ── Scroll-to helper ─────────────────────────────────── */
function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ── Nav items ─────────────────────────────────────────── */
const publicLinks = [
  { label: "Home", href: "/" },
  { label: "Features", href: "#features", scroll: true },
  { label: "Pipeline", href: "#pipeline", scroll: true },
  { label: "About", href: "#about", scroll: true },
];

const authLinks = [
  { label: "Dashboard", href: "/dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
  { label: "Sessions",  href: "/interview",  icon: <MonitorPlay className="w-4 h-4" /> },
  { label: "Reports",   href: "/feedback",    icon: <BarChart3 className="w-4 h-4" /> },
];

export default function Navbar() {
  const path = usePathname();
  const router = useRouter();
  const { isAuthenticated, loading, user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [path]);

  // Close profile dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleNavClick = (item: { href: string; scroll?: boolean }) => {
    if (item.scroll) {
      if (path !== "/") {
        router.push("/" + item.href);
      } else {
        scrollToSection(item.href.replace("#", ""));
      }
    }
    setMobileOpen(false);
  };

  const links = isAuthenticated ? authLinks : publicLinks;

  // Hide navbar on auth pages
  const isAuthPage = path === "/login" || path === "/signup";
  if (isAuthPage) return null;

  // Don't render until auth state is resolved
  if (loading) {
    return (
      <nav className="fixed left-1/2 top-4 z-50 flex h-14 w-[calc(100%-1.5rem)] max-w-5xl -translate-x-1/2 items-center rounded-2xl border border-[#1e2d47] bg-[rgba(16,24,40,0.82)] px-4 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.35)] md:px-6" />
    );
  }

  const initials = user?.name
    ? user.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <>
      <nav
        className={cn(
          "fixed left-1/2 top-4 z-50 flex h-14 w-[calc(100%-1.5rem)] max-w-5xl -translate-x-1/2 items-center justify-between rounded-2xl px-4 transition-all duration-300 md:px-6",
          scrolled
            ? "border border-[#243655] bg-[rgba(8,12,20,0.92)] backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
            : "border border-[#1e2d47] bg-[rgba(16,24,40,0.72)] backdrop-blur-2xl shadow-[0_16px_48px_rgba(0,0,0,0.28)]"
        )}
      >
        {/* ── Logo ──────────────────────────────── */}
        <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#06b6d4] to-[#3b82f6] flex items-center justify-center text-[10px] font-bold text-white shadow-[0_0_14px_rgba(6,182,212,0.35)] group-hover:shadow-[0_0_22px_rgba(6,182,212,0.55)] transition-shadow duration-300">
            AI
          </div>
          <span className="hidden text-sm font-bold tracking-widest text-white/60 sm:block">
            AISMS
          </span>
        </Link>

        {/* ── Desktop nav links ─────────────────── */}
        <div className="hidden md:flex items-center gap-0.5">
          {links.map((item) => {
            const isActive = !("scroll" in item) && path === item.href;
            const isScrollLink = "scroll" in item && item.scroll;

            return isScrollLink ? (
              <button
                key={item.label}
                onClick={() => handleNavClick(item as { href: string; scroll?: boolean })}
                className="relative rounded-lg px-3 py-2 text-[13px] font-medium text-white/40 transition-colors duration-200 hover:text-white/75"
              >
                {item.label}
              </button>
            ) : (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "relative px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-200 flex items-center gap-1.5",
                  isActive
                    ? "text-[#06b6d4]"
                    : "text-[#94a3b8] hover:text-[#e2e8f0]"
                )}
              >
                {"icon" in item && <span className={isActive ? "text-[#3b82f6]" : ""}>{item.icon}</span>}
                {item.label}
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute bottom-0 left-3 right-3 h-[2px] bg-gradient-to-r from-[#3b82f6] to-[#06b6d4] rounded-full"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* ── Right side ────────────────────────── */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="relative" ref={profileRef}>
              {/* Profile button */}
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="hidden items-center gap-2 rounded-xl border border-[#1e2d47] px-3 py-1.5 text-[13px] font-medium text-[#94a3b8] transition-all duration-300 hover:border-[#243655] hover:bg-[#3b82f6]/5 hover:text-[#e2e8f0] md:flex"
              >
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#3b82f6] to-[#06b6d4] flex items-center justify-center text-[9px] font-bold text-white">
                  {initials}
                </div>
                <span className="max-w-[100px] truncate">{user?.name?.split(" ")[0]}</span>
                <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-200", profileOpen && "rotate-180")} />
              </button>

              {/* Profile Dropdown */}
              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-[#1e2d47] bg-[#101828]/95 p-2 shadow-[0_20px_60px_rgba(0,0,0,0.6)] backdrop-blur-2xl"
                  >
                    {/* User info */}
                    <div className="px-3 py-2.5 mb-1">
                      <div className="text-sm font-semibold text-[#e2e8f0] truncate">{user?.name}</div>
                      <div className="text-[11px] text-[#64748b] truncate">{user?.email}</div>
                    </div>
                    <div className="h-px bg-white/[0.06] mb-1" />

                    {/* Menu items */}
                    <Link
                      href="/profile"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] text-white/50 hover:text-white hover:bg-white/[0.04] transition-all duration-150"
                    >
                      <User className="w-4 h-4" />
                      Profile
                    </Link>
                    <Link
                      href="/profile"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] text-white/50 hover:text-white hover:bg-white/[0.04] transition-all duration-150"
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </Link>
                    <div className="h-px bg-white/[0.06] my-1" />
                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        logout();
                      }}
                      className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-[13px] text-red-400/70 hover:text-red-400 hover:bg-red-500/[0.06] transition-all duration-150"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              href="/login"
              className="hidden md:inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#3b82f6] via-[#06b6d4] to-[#3b82f6] px-5 py-2 text-[13px] font-semibold text-white shadow-[0_4px_20px_rgba(59,130,246,0.35)] transition-all duration-300 hover:-translate-y-[1px] hover:shadow-[0_4px_28px_rgba(6,182,212,0.5)]"
            >
              Get Started
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-xl p-2 text-white/40 transition-colors hover:bg-white/[0.05] hover:text-white/75 md:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* ── Mobile menu overlay ────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute right-0 top-0 bottom-0 w-72 border-l border-[#1e2d47] bg-[#080c14]/95 p-6 pt-20 backdrop-blur-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* User info in mobile */}
              {isAuthenticated && user && (
                <div className="mb-4 pb-4 border-b border-[#1e2d47]">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#3b82f6] to-[#06b6d4] flex items-center justify-center text-xs font-bold text-white">
                      {initials}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[#e2e8f0]">{user.name}</div>
                      <div className="text-[11px] text-[#64748b] truncate max-w-[160px]">{user.email}</div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-1">
                {links.map((item) => {
                  const isScrollLink = "scroll" in item && item.scroll;
                  const isActive = !isScrollLink && path === item.href;

                  return isScrollLink ? (
                    <button
                      key={item.label}
                      onClick={() => handleNavClick(item as { href: string; scroll?: boolean })}
                      className="flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-white/40 transition-all duration-200 hover:bg-white/[0.05] hover:text-white/75"
                    >
                      {item.label}
                    </button>
                  ) : (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                        isActive
                          ? "text-[#06b6d4] bg-[#3b82f6]/10 border border-[#3b82f6]/25"
                          : "text-[#94a3b8] hover:text-[#e2e8f0] hover:bg-white/[0.04]"
                      )}
                    >
                      {"icon" in item && item.icon}
                      {item.label}
                    </Link>
                  );
                })}

                {/* Mobile profile / logout */}
                <div className="mt-4 pt-4 border-t border-[#1e2d47]">
                  {isAuthenticated ? (
                    <>
                      <Link
                        href="/profile"
                        className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white/40 transition-all duration-200 hover:bg-white/[0.05] hover:text-white/75"
                      >
                        <User className="w-4 h-4" />
                        Profile
                      </Link>
                      <button
                        onClick={() => {
                          setMobileOpen(false);
                          logout();
                        }}
                          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-400/70 transition-all duration-200 hover:bg-red-500/[0.06] hover:text-red-400"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </>
                  ) : (
                    <Link
                      href="/login"
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#3b82f6] via-[#06b6d4] to-[#3b82f6] px-4 py-3 text-sm font-semibold text-white shadow-[0_4px_20px_rgba(59,130,246,0.3)] transition-all duration-300"
                    >
                      Get Started
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LogOut, LayoutDashboard, MonitorPlay, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

/* ── Scroll-to helper ─────────────────────────────────── */
function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
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
  { label: "Sessions", href: "/interview", icon: <MonitorPlay className="w-4 h-4" /> },
];

export default function Navbar() {
  const path = usePathname();
  const router = useRouter();
  const { isAuthenticated, loading, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Track scroll for navbar style change
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [path]);

  const handleNavClick = (item: { href: string; scroll?: boolean }) => {
    if (item.scroll) {
      // If we're not on the landing page, navigate there first
      if (path !== "/") {
        router.push("/" + item.href);
      } else {
        scrollToSection(item.href.replace("#", ""));
      }
    }
    setMobileOpen(false);
  };

  const links = isAuthenticated ? authLinks : publicLinks;

  // Hide navbar on auth pages (login/signup have their own back button)
  const isAuthPage = path === "/login" || path === "/signup";
  if (isAuthPage) return null;

  // Don't render until auth state is resolved to avoid flash
  if (loading) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center px-4 md:px-8 bg-[#080c14]/80 backdrop-blur-xl border-b border-white/[0.06]" />
    );
  }

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-4 md:px-8 transition-all duration-300",
          scrolled
            ? "bg-[#080c14]/85 backdrop-blur-xl border-b border-white/[0.08] shadow-[0_4px_30px_rgba(0,0,0,0.3)]"
            : "bg-[#080c14]/60 backdrop-blur-lg border-b border-transparent"
        )}
      >
        {/* ── Logo ──────────────────────────────── */}
        <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-400 flex items-center justify-center text-xs font-bold text-white shadow-[0_0_20px_rgba(6,182,212,0.25)] group-hover:shadow-[0_0_28px_rgba(6,182,212,0.4)] transition-shadow duration-300">
            AI
          </div>
          <span className="text-sm font-bold tracking-tight hidden sm:block">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">AISMS</span>
            <span className="text-slate-500 font-normal ml-1.5">/ Monitoring</span>
          </span>
        </Link>

        {/* ── Desktop nav links ─────────────────── */}
        <div className="hidden md:flex items-center gap-1">
          {links.map((item) => {
            const isActive = !("scroll" in item) && path === item.href;
            const isScrollLink = "scroll" in item && item.scroll;

            return isScrollLink ? (
              <button
                key={item.label}
                onClick={() => handleNavClick(item as { href: string; scroll?: boolean })}
                className="relative px-3.5 py-2 rounded-lg text-[13px] font-medium text-slate-400 hover:text-slate-200 transition-colors duration-200"
              >
                {item.label}
              </button>
            ) : (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "relative px-3.5 py-2 rounded-lg text-[13px] font-medium transition-all duration-200 flex items-center gap-1.5",
                  isActive
                    ? "text-cyan-300"
                    : "text-slate-400 hover:text-slate-200"
                )}
              >
                {"icon" in item && item.icon}
                {item.label}
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute bottom-0 left-3 right-3 h-[2px] bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
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
            <button
              onClick={logout}
              className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-medium text-slate-400 border border-[#1e2d47] hover:border-red-500/40 hover:text-red-300 hover:bg-red-500/5 transition-all duration-200"
            >
              <LogOut className="w-3.5 h-3.5" />
              Logout
            </button>
          ) : (
            <Link
              href="/login"
              className="hidden md:inline-flex items-center gap-1.5 px-5 py-2 rounded-lg text-[13px] font-semibold bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.2)] hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] hover:-translate-y-[1px] transition-all duration-200"
            >
              Get Started
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-colors"
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
              className="absolute right-0 top-0 bottom-0 w-72 bg-[#0d1421]/95 backdrop-blur-xl border-l border-white/[0.06] p-6 pt-20"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col gap-1">
                {links.map((item) => {
                  const isScrollLink = "scroll" in item && item.scroll;
                  const isActive = !isScrollLink && path === item.href;

                  return isScrollLink ? (
                    <button
                      key={item.label}
                      onClick={() => handleNavClick(item as { href: string; scroll?: boolean })}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-all duration-200 text-left"
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
                          ? "text-cyan-300 bg-cyan-500/10 border border-cyan-500/20"
                          : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                      )}
                    >
                      {"icon" in item && item.icon}
                      {item.label}
                    </Link>
                  );
                })}

                {/* Mobile CTA / Logout */}
                <div className="mt-4 pt-4 border-t border-white/[0.06]">
                  {isAuthenticated ? (
                    <button
                      onClick={() => {
                        setMobileOpen(false);
                        logout();
                      }}
                      className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all duration-200"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  ) : (
                    <Link
                      href="/login"
                      className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.2)] transition-all duration-200"
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

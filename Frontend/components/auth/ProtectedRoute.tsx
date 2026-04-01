"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

interface Props {
  children: React.ReactNode;
  /** Where to send unauthenticated users. Defaults to /login */
  redirectTo?: string;
}

/**
 * Wrap any page that requires authentication.
 * Redirects to /login if the user is not logged in.
 * Shows a loading skeleton while auth state is hydrating.
 */
export default function ProtectedRoute({ children, redirectTo = "/login" }: Props) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(redirectTo);
    }
  }, [isAuthenticated, isLoading, redirectTo, router]);

  // While hydrating auth state from localStorage — show a minimal loader
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#080c14] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-700 to-cyan-500 flex items-center justify-center text-sm font-bold text-white animate-pulse">
            AI
          </div>
          <div className="text-xs text-slate-500 font-mono animate-pulse">Verifying session…</div>
        </div>
      </div>
    );
  }

  // Not authenticated — render nothing (redirect in progress)
  if (!isAuthenticated) return null;

  return <>{children}</>;
}

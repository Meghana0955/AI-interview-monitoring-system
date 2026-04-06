"use client";

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = "Loading..." }: LoadingStateProps) {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-white/[0.05] bg-white/[0.02] px-6 py-8 backdrop-blur-xl">
        <div className="relative h-12 w-12">
          <div className="absolute inset-0 rounded-full border-2 border-white/[0.07]" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#7c3aed] border-r-[#a78bfa] animate-spin" />
        </div>
        <div className="text-sm text-white/40">{message}</div>
      </div>
    </div>
  );
}

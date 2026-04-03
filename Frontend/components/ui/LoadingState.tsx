"use client";

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = "Loading..." }: LoadingStateProps) {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-2 border-white/[0.07]" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#7c3aed] animate-spin" />
        </div>
        <div className="text-sm text-white/35">{message}</div>
      </div>
    </div>
  );
}

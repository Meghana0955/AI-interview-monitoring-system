"use client";
import { motion } from "framer-motion";
import { Button } from "./Button";

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

export function EmptyState({ icon, title, description, actionLabel, actionHref, onAction }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center rounded-2xl border border-white/[0.05] bg-white/[0.02] px-6 py-16 text-center backdrop-blur-xl"
    >
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#7c3aed]/20 bg-[#7c3aed]/10 text-[#a78bfa] shadow-[0_0_24px_rgba(124,58,237,0.12)]">
        {icon}
      </div>
      <h3 className="mb-1.5 text-sm font-semibold text-white">{title}</h3>
      <p className="mb-5 max-w-xs text-xs leading-relaxed text-white/35">{description}</p>
      {actionLabel && (
        actionHref ? (
          <a href={actionHref}>
            <Button size="sm">{actionLabel}</Button>
          </a>
        ) : (
          <Button size="sm" onClick={onAction}>{actionLabel}</Button>
        )
      )}
    </motion.div>
  );
}

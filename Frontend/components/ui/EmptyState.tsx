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
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <div className="w-16 h-16 rounded-2xl bg-[#7c3aed]/10 border border-[#7c3aed]/20 flex items-center justify-center text-[#a78bfa] mb-4">
        {icon}
      </div>
      <h3 className="text-sm font-semibold text-white mb-1.5">{title}</h3>
      <p className="text-xs text-white/35 max-w-xs leading-relaxed mb-5">{description}</p>
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

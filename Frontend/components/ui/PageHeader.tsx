"use client";
import { motion } from "framer-motion";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
}

export function PageHeader({ title, subtitle, badge, actions }: PageHeaderProps) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-1 flex items-center gap-3">
          <h1 className="text-xl font-bold tracking-[-0.02em] text-white sm:text-2xl">{title}</h1>
          {badge}
        </div>
        {subtitle && (
          <p className="font-mono text-[11px] tracking-wide text-white/35">{subtitle}</p>
        )}
      </motion.div>
      {actions && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="flex items-center gap-2 flex-wrap"
        >
          {actions}
        </motion.div>
      )}
    </div>
  );
}

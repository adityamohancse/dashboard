"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { ProgressRing } from "@/components/ui/progress-ring";

export function StatCard({
  title,
  value,
  suffix = "",
  ring,
  icon,
}: {
  title: string;
  value: number | string;
  suffix?: string;
  ring?: number;
  icon?: ReactNode;
}) {
  return (
    <motion.div whileHover={{ y: -2 }} className="group">
      <Card className="border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.04] backdrop-blur-2xl hover:border-cyan-500/30 transition-all p-3.5">
        <div className="flex items-start justify-between mb-2.5">
          <p className="text-xs font-semibold text-slate-400 group-hover:text-slate-300 transition">
            {title}
          </p>
          {icon && (
            <div className="text-slate-400 group-hover:text-cyan-400/60 transition">
              {icon}
            </div>
          )}
        </div>
        <div className="flex items-center justify-between">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-white"
          >
            {value}
            {suffix && <span className="text-sm ml-1">{suffix}</span>}
          </motion.p>
          {typeof ring === "number" ? (
            <ProgressRing value={ring} label={title} size={48} />
          ) : null}
        </div>
      </Card>
    </motion.div>
  );
}


"use client";

import { motion } from "framer-motion";
import { AppShell } from "@/components/layout/app-shell";
import { DailyLogTable } from "@/components/tracker/daily-log-table";

export default function DailyLogPage() {
  return (
    <AppShell title="Daily Study Log Tracker">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mb-5"
      >
        <p className="text-xs uppercase tracking-[0.16em] text-cyan-300/90">
          Study operations
        </p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight text-white md:text-3xl">
          Capture daily learning with clarity and momentum
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
          Log each study block, monitor consistency, track revision quality, and keep your
          Commerce preparation system clean and measurable.
        </p>
      </motion.div>
      <DailyLogTable />
    </AppShell>
  );
}


"use client";

import { motion } from "framer-motion";
import { useSyncExternalStore } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "@/components/ui/card";

export type WeeklyPoint = { day: string; hours: number };
export type FocusPoint = { name: string; value: number; color: string };
const subscribe = () => () => {};

function useIsMounted() {
  return useSyncExternalStore(subscribe, () => true, () => false);
}

function customTooltipFormatter(value: unknown): [string, string] {
  return [String(value), "Value"];
}

export function WeeklyConsistencyChart({
  data,
  average,
  bestDay,
}: {
  data?: WeeklyPoint[];
  average?: number;
  bestDay?: string;
} = {}) {
  const isMounted = useIsMounted();

  const defaultData = data || [
    { day: "Mon", hours: 2 },
    { day: "Tue", hours: 3 },
    { day: "Wed", hours: 2.5 },
    { day: "Thu", hours: 4 },
    { day: "Fri", hours: 3.5 },
    { day: "Sat", hours: 5 },
    { day: "Sun", hours: 1.5 },
  ];

  const defaultAvg = average ?? 3.2;
  const defaultBest = bestDay ?? "Saturday";
  return (
    <Card className="border-white/10 bg-white/[0.07] p-5">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.15em] text-cyan-300/90">Consistency</p>
          <h3 className="text-lg font-semibold text-white">Weekly Study Rhythm</h3>
        </div>
        <div className="text-right text-xs text-slate-400">
          <p>Avg {defaultAvg.toFixed(1)}h/day</p>
          <p>Best day: {defaultBest}</p>
        </div>
      </div>
      <div className="h-64 rounded-xl border border-white/10 bg-black/20 p-2">
        {isMounted ? (
          <ResponsiveContainer width="100%" height="100%" minWidth={280} minHeight={240}>
            <AreaChart data={defaultData}>
              <defs>
                <linearGradient id="dashWeeklyFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.75} />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.12} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148,163,184,0.2)" />
              <XAxis dataKey="day" tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <Tooltip formatter={customTooltipFormatter} />
              <Area
                type="monotone"
                dataKey="hours"
                stroke="#22d3ee"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#dashWeeklyFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full w-full" />
        )}
      </div>
    </Card>
  );
}

export function ProductivityMixChart({
  data,
  totalFocusHours,
  strongest,
  weakest,
}: {
  data?: FocusPoint[];
  totalFocusHours?: number;
  strongest?: string;
  weakest?: string;
} = {}) {
  const isMounted = useIsMounted();

  const defaultData = data || [
    { name: "Accountancy", value: 20, color: "#06b6d4" },
    { name: "Business Studies", value: 25, color: "#a855f7" },
    { name: "Economics", value: 20, color: "#10b981" },
    { name: "English", value: 18, color: "#f97316" },
    { name: "Computer Science", value: 17, color: "#eab308" },
  ];
  const defaultTotal = totalFocusHours ?? 24.5;
  const defaultStrongest = strongest ?? "Business Studies";
  const defaultWeakest = weakest ?? "Computer Science";

  // Calculate metrics
  const avgDailyFocus = (defaultTotal / 7).toFixed(1);
  const weeklyGrowth = "+12%";

  // Subject icons map
  const subjectIcons: Record<string, string> = {
    Accountancy: "📘",
    "Business Studies": "💼",
    Economics: "📊",
    English: "📖",
    "Computer Science": "💻",
  };

  return (
    <motion.div whileHover={{ y: -2 }}>
      <Card className="border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.04] backdrop-blur-2xl overflow-hidden">
        {/* Header */}
        <div className="border-b border-white/10 px-6 py-4">
          <p className="text-xs uppercase tracking-[0.15em] text-violet-300/80 mb-1">
            Focus Analytics
          </p>
          <h3 className="text-lg font-semibold text-white">Subject Focus Distribution</h3>
        </div>

        {/* Main Content - Responsive Grid */}
        <div className="p-5 grid gap-6 lg:grid-cols-2">
          {/* LEFT: Compact Donut Chart */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center justify-center"
          >
            <div className="relative w-52 h-52 flex items-center justify-center">
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-500/10 to-cyan-500/10 blur-2xl" />

              {/* Chart */}
              <div className="relative w-full h-full rounded-full border border-white/10 bg-black/30 p-2">
                {isMounted ? (
                  <ResponsiveContainer width="100%" height="100%" minWidth={200} minHeight={200}>
                    <PieChart>
                      <Pie
                        data={defaultData}
                        innerRadius={52}
                        outerRadius={82}
                        dataKey="value"
                        stroke="none"
                        paddingAngle={2}
                      >
                        {defaultData.map((entry) => (
                          <Cell key={entry.name} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={customTooltipFormatter} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full w-full" />
                )}

                {/* Center Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-xs text-slate-400">Focus</p>
                  <p className="text-2xl font-bold text-white">{defaultTotal}h</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* RIGHT: Compact Subject Breakdown */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col justify-between"
          >
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.15em] text-slate-400 mb-2">
                Focus by Subject
              </p>

              {/* Subject Rows */}
              {defaultData.map((subject, idx) => (
                <motion.div
                  key={subject.name}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 + idx * 0.05 }}
                  whileHover={{ x: 4 }}
                  className="group"
                >
                  <div className="p-3 rounded-lg border border-white/10 bg-white/[0.05] hover:bg-white/[0.08] transition hover:border-white/20">
                    {/* Subject Header */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{subjectIcons[subject.name]}</span>
                        <span className="font-medium text-white text-sm">{subject.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span style={{ color: subject.color }} className="font-bold">
                          {subject.value}%
                        </span>
                        <span className="text-xs text-green-400">+4%</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: subject.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${subject.value}%` }}
                        transition={{ duration: 1 + idx * 0.1, ease: "easeOut" }}
                      />
                    </div>

                    {/* Study Hours */}
                    <div className="flex justify-between items-center mt-2 text-xs text-slate-400">
                      <span>{(defaultTotal * (subject.value / 100)).toFixed(1)}h this week</span>
                      <span className="text-slate-500">Avg 3.2h/day</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Footer Insights */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-6 p-4 rounded-lg border border-white/10 bg-gradient-to-r from-violet-500/10 to-cyan-500/10"
            >
              <p className="text-xs uppercase tracking-[0.15em] text-slate-400 mb-2">
                📊 Smart Insight
              </p>
              <p className="text-sm text-slate-300">
                <span className="text-violet-400 font-semibold">Business Studies</span> is your strongest focus area. Consider reinforcing{" "}
                <span className="text-orange-400 font-semibold">English</span> to maintain balance.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
}

export function ProductivityHeatmap({
  matrix,
  consistencyScore,
  averageHours,
  bestStreak,
}: {
  matrix?: number[][];
  consistencyScore?: number;
  averageHours?: number;
  bestStreak?: number;
} = {}) {
  const defaultMatrix = matrix || [
    [0, 1, 2, 3, 2, 4, 3],
    [1, 2, 3, 4, 3, 2, 1],
    [2, 3, 4, 4, 3, 2, 0],
    [1, 2, 3, 2, 4, 3, 2],
  ];
  const defaultConsistency = consistencyScore ?? 78;
  const defaultAverage = averageHours ?? 3.5;
  const defaultStreak = bestStreak ?? 12;
  return (
    <Card className="border-white/10 bg-white/[0.07] p-5">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.15em] text-cyan-300/90">Heatmap</p>
          <h3 className="text-lg font-semibold text-white">Productivity Intensity</h3>
        </div>
        <div className="text-right text-xs text-slate-400">
          <p>Consistency {defaultConsistency}%</p>
          <p>Avg {defaultAverage.toFixed(1)}h/day</p>
        </div>
      </div>
      <div className="space-y-2">
        {defaultMatrix.map((week, row) => (
          <div key={row} className="grid grid-cols-7 gap-2">
            {week.map((cell, col) => (
              <div
                key={`${row}-${col}`}
                className="h-7 rounded-md transition hover:scale-110"
                style={{
                  background:
                    cell === 0
                      ? "rgba(71,85,105,0.35)"
                      : cell === 1
                        ? "rgba(34,211,238,0.25)"
                        : cell === 2
                          ? "rgba(59,130,246,0.35)"
                          : cell === 3
                            ? "rgba(139,92,246,0.46)"
                            : "rgba(168,85,247,0.65)",
                }}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
        <p>Best study streak: {defaultStreak} days</p>
        <p>Higher shade = higher intensity</p>
      </div>
    </Card>
  );
}

export function CompactFocusWidget({
  data,
}: {
  data?: FocusPoint[];
} = {}) {
  const defaultData = data || [
    { name: "Accountancy", value: 20, color: "#06b6d4" },
    { name: "Business Studies", value: 25, color: "#a855f7" },
    { name: "Economics", value: 20, color: "#10b981" },
    { name: "English", value: 18, color: "#f97316" },
    { name: "Computer Science", value: 17, color: "#eab308" },
  ];

  const subjectIcons: Record<string, string> = {
    Accountancy: "📘",
    "Business Studies": "💼",
    Economics: "📊",
    English: "📖",
    "Computer Science": "💻",
  };

  return (
    <motion.div whileHover={{ y: -1 }}>
      <Card className="border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.04] backdrop-blur-2xl p-4">
        {/* Header */}
        <div className="mb-3">
          <p className="text-xs uppercase tracking-[0.15em] text-violet-300/80 mb-1">
            Focus Distribution
          </p>
        </div>

        {/* Subject Grid - Compact */}
        <div className="space-y-2">
          {defaultData.map((subject, idx) => (
            <motion.div
              key={subject.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.03 }}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-sm">{subjectIcons[subject.name]}</span>
                <span className="text-xs text-slate-300 truncate">{subject.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-16 h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: subject.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${subject.value}%` }}
                    transition={{ duration: 0.6 + idx * 0.05 }}
                  />
                </div>
                <span style={{ color: subject.color }} className="text-xs font-semibold w-8 text-right">
                  {subject.value}%
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}

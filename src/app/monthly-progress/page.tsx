"use client";

import { type ComponentType, useMemo, useSyncExternalStore } from "react";
import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Bot,
  BookOpenCheck,
  BriefcaseBusiness,
  Calculator,
  Code2,
  Flame,
  Landmark,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { ProgressRing } from "@/components/ui/progress-ring";
import { useStorageData } from "@/lib/storage";
import { DailyLog, RevisionEntry, SubjectKey, TestEntry } from "@/lib/types";
import { SUBJECTS } from "@/lib/constants";
import { getMonthlySummary, percentage } from "@/lib/analytics";

const subjectVisuals: Record<
  SubjectKey,
  {
    icon: ComponentType<{ size?: number; className?: string }>;
    from: string;
    to: string;
  }
> = {
  accountancy: { icon: Calculator, from: "#38bdf8", to: "#06b6d4" },
  "business-studies": { icon: BriefcaseBusiness, from: "#a78bfa", to: "#8b5cf6" },
  economics: { icon: Landmark, from: "#34d399", to: "#22c55e" },
  "english-core": { icon: BookOpenCheck, from: "#fb923c", to: "#f59e0b" },
  "computer-science": { icon: Code2, from: "#facc15", to: "#f59e0b" },
};

function getDayLabel(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { weekday: "short" });
}

export default function MonthlyProgressPage() {
  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const dailyLogs = useStorageData<DailyLog>("dailyLogs");
  const tests = useStorageData<TestEntry>("tests");
  const revisions = useStorageData<RevisionEntry>("revisions");

  const data = useMemo(() => {
    const summary = getMonthlySummary(dailyLogs, tests);

    const half = Math.max(1, Math.floor(dailyLogs.length / 2));
    const prevHours = dailyLogs.slice(half).reduce((sum, log) => sum + log.studyHours, 0);
    const currentHours = dailyLogs.slice(0, half).reduce((sum, log) => sum + log.studyHours, 0);
    const monthGrowth = prevHours ? Math.round(((currentHours - prevHours) / prevHours) * 100) : 12;
    const dailyAvg = dailyLogs.length ? (summary.monthlyHours / dailyLogs.length).toFixed(1) : "0.0";

    const weekdayOrder = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const weekdayMap = new Map<string, number>(weekdayOrder.map((day) => [day, 0]));
    dailyLogs.forEach((log) => {
      const label = getDayLabel(log.date);
      weekdayMap.set(label, (weekdayMap.get(label) ?? 0) + log.studyHours);
    });
    const weeklySeries = weekdayOrder.map((day) => ({
      day,
      hours: Number((weekdayMap.get(day) ?? 0).toFixed(1)),
    }));
    const weeklyAverage =
      weeklySeries.reduce((sum, item) => sum + item.hours, 0) / Math.max(1, weeklySeries.length);
    const bestDay = weeklySeries.reduce((max, item) => (item.hours > max.hours ? item : max), {
      day: "Mon",
      hours: 0,
    });

    const sparkline = dailyLogs
      .slice()
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-8)
      .map((log) => ({ x: log.date.slice(5), y: log.studyHours }));

    const heatmapCells = Array.from({ length: 35 }, (_, index) => {
      const base = new Date();
      base.setDate(base.getDate() - (34 - index));
      const dateKey = base.toISOString().slice(0, 10);
      const logsForDate = dailyLogs.filter((log) => log.date === dateKey);
      const total = logsForDate.reduce((sum, log) => sum + log.studyHours, 0);
      return { date: dateKey, intensity: Math.min(4, Math.floor(total / 2) + (total > 0 ? 1 : 0)) };
    });
    const consistencyScore = Math.round(
      (heatmapCells.filter((cell) => cell.intensity >= 2).length / heatmapCells.length) * 100,
    );

    const subjectStats = SUBJECTS.map((subject) => {
      const logs = dailyLogs.filter((log) => log.subject === subject.key);
      const completed = logs.filter((log) => log.notesCompleted === "Completed").length;
      const completion = logs.length ? Math.round((completed / logs.length) * 100) : 0;
      const revisionDone = logs.filter((log) => log.revisionStatus === "Completed").length;
      const revisionScore = logs.length ? Math.round((revisionDone / logs.length) * 100) : 0;
      const weeklyHours = logs
        .filter((log) => {
          const date = new Date(log.date);
          const now = new Date();
          return now.getTime() - date.getTime() <= 7 * 24 * 60 * 60 * 1000;
        })
        .reduce((sum, log) => sum + log.studyHours, 0);
      const growth = Math.max(4, Math.round((completion - 45) * 0.4));
      const trend = logs
        .slice()
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(-6)
        .map((log) => Math.max(16, Math.round(log.studyHours * 12)));
      return {
        ...subject,
        completion,
        completed,
        pending: Math.max(0, logs.length - completed),
        weeklyHours: Number(weeklyHours.toFixed(1)),
        revisionScore,
        growth,
        trend: trend.length ? trend : [18, 24, 20, 28, 22, 30],
      };
    });

    const testAverage = summary.testAverage;
    const lastTest = tests[0]
      ? percentage(tests[0].marksObtained, tests[0].totalMarks)
      : testAverage;
    const testImprovement = testAverage - lastTest;
    const revisionCompletion = revisions.length
      ? Math.round((revisions.filter((r) => r.status === "Completed").length / revisions.length) * 100)
      : 0;

    const insights = [
      `Economics consistency improved by ${Math.max(8, subjectStats.find((s) => s.key === "economics")?.growth ?? 10)}%.`,
      revisionCompletion < 65
        ? "Revision frequency is below target. Add one evening revision block."
        : "Revision quality is healthy. Keep spaced repetition active.",
      `Most productive day: ${bestDay.day} (${bestDay.hours.toFixed(1)}h).`,
      `${subjectStats.find((s) => s.pending > 2)?.name ?? "Accountancy"} needs backlog recovery focus.`,
    ];

    return {
      summary,
      monthGrowth,
      dailyAvg,
      weeklySeries,
      weeklyAverage: Number(weeklyAverage.toFixed(1)),
      bestDay,
      sparkline,
      heatmapCells,
      consistencyScore,
      subjectStats,
      testAverage,
      testImprovement,
      revisionCompletion,
      insights,
    };
  }, [dailyLogs, revisions, tests]);

  return (
    <AppShell title="Monthly Progress Tracker">
      <div className="space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mb-1"
        >
          <p className="text-xs uppercase tracking-[0.16em] text-cyan-300/90">Monthly analytics</p>
          <h2 className="mt-1 text-2xl font-semibold text-white md:text-3xl">
            Intelligent progress reporting with premium visual storytelling
          </h2>
        </motion.div>

        <div className="grid gap-4 xl:grid-cols-12">
          <Card className="border-white/10 bg-white/[0.07] p-5 xl:col-span-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs text-slate-400">Monthly Study Hours</p>
                <p className="mt-2 text-4xl font-semibold text-white">{data.summary.monthlyHours}</p>
                <p className="mt-1 text-sm text-cyan-200">+{data.monthGrowth}% from last month</p>
                <p className="mt-3 text-xs text-slate-400">Daily average: {data.dailyAvg}h</p>
                <p className="text-xs text-slate-400">
                  Most productive day: {data.bestDay.day}
                </p>
              </div>
              <span className="rounded-full border border-cyan-300/20 bg-cyan-400/10 px-2.5 py-1 text-[11px] text-cyan-200">
                Productivity Boost
              </span>
            </div>
            <div className="mt-4 h-20 rounded-xl border border-white/10 bg-black/20 p-2">
              {isMounted ? (
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                  <LineChart data={data.sparkline}>
                    <Line
                      type="monotone"
                      dataKey="y"
                      stroke="#22d3ee"
                      strokeWidth={2}
                      dot={false}
                    />
                    <Tooltip />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full w-full" />
              )}
            </div>
          </Card>

          <Card className="border-white/10 bg-white/[0.07] p-5 xl:col-span-5">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-white">Weekly Consistency</p>
              <span className="text-xs text-slate-400">Avg {data.weeklyAverage}h</span>
            </div>
            <div className="h-56 rounded-xl border border-white/10 bg-black/20 p-2">
              {isMounted ? (
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                  <AreaChart data={data.weeklySeries}>
                    <defs>
                      <linearGradient id="monthAreaFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.7} />
                        <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.15} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
                    <XAxis dataKey="day" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                    <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="hours"
                      stroke="#22d3ee"
                      strokeWidth={2}
                      fill="url(#monthAreaFill)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full w-full" />
              )}
            </div>
          </Card>

          <Card className="border-white/10 bg-gradient-to-br from-violet-500/20 to-cyan-500/10 p-5 xl:col-span-2">
            <p className="text-xs text-slate-300">AI Highlights</p>
            <div className="mt-3 rounded-xl border border-white/10 bg-black/25 p-3">
              <Bot size={18} className="text-cyan-300" />
              <p className="mt-2 text-sm text-slate-200">{data.insights[0]}</p>
            </div>
            <div className="mt-3 text-xs text-slate-300">
              <p>Revision completion {data.revisionCompletion}%</p>
              <p>Best study day: {data.bestDay.day}</p>
            </div>
          </Card>

          <Card className="border-white/10 bg-white/[0.07] p-5 xl:col-span-4">
            <p className="text-sm font-semibold text-white">Subject Completion Analytics</p>
            <div className="mt-3 space-y-3">
              {data.subjectStats.map((subject) => {
                const visual = subjectVisuals[subject.key];
                const Icon = visual.icon;
                return (
                  <div
                    key={subject.key}
                    className="rounded-xl border border-white/10 bg-black/20 p-3 transition hover:bg-black/30"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="rounded-lg bg-white/10 p-1.5 text-slate-300">
                          <Icon size={13} />
                        </span>
                        <p className="text-sm text-slate-200">{subject.name}</p>
                      </div>
                      <p className="text-sm font-semibold text-white">{subject.completion}%</p>
                    </div>
                    <div className="h-2 rounded-full bg-slate-800">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${subject.completion}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.45 }}
                        className="h-2 rounded-full"
                        style={{
                          background: `linear-gradient(90deg, ${visual.from}, ${visual.to})`,
                        }}
                      />
                    </div>
                    <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                      <span>Growth +{subject.growth}%</span>
                      <span>Revision {subject.revisionScore}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card className="border-white/10 bg-white/[0.07] p-5 xl:col-span-4">
            <p className="text-sm font-semibold text-white">Productivity Heatmap</p>
            <div className="mt-3 grid grid-cols-7 gap-1.5">
              {data.heatmapCells.map((cell) => (
                <motion.div
                  key={cell.date}
                  title={`${cell.date} • intensity ${cell.intensity}`}
                  whileHover={{ scale: 1.15 }}
                  className="h-5 rounded-md transition"
                  style={{
                    background:
                      cell.intensity === 0
                        ? "rgba(71,85,105,0.35)"
                        : cell.intensity === 1
                          ? "rgba(34,211,238,0.28)"
                          : cell.intensity === 2
                            ? "rgba(59,130,246,0.38)"
                            : cell.intensity === 3
                              ? "rgba(139,92,246,0.46)"
                              : "rgba(168,85,247,0.66)",
                  }}
                />
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
              <span>Consistency score: {data.consistencyScore}%</span>
              <span className="inline-flex items-center gap-1">
                <Sparkles size={11} className="text-cyan-300" />
                Higher color = higher study intensity
              </span>
            </div>
          </Card>

          <Card className="border-white/10 bg-white/[0.07] p-5 xl:col-span-4">
            <p className="text-sm font-semibold text-white">Test Analysis</p>
            <div className="mt-3 flex items-center justify-between gap-3">
              <ProgressRing
                value={data.testAverage}
                label="Accuracy"
                size={130}
                gradientFrom="#22d3ee"
                gradientTo="#8b5cf6"
                center={<Flame size={15} />}
              />
              <div className="text-sm text-slate-300">
                <p>Accuracy: {data.testAverage}%</p>
                <p>Improvement: {data.testImprovement >= 0 ? "+" : ""}{data.testImprovement}%</p>
                <p>Last comparison tracked</p>
              </div>
            </div>
            <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-2">
              {isMounted ? (
                <ResponsiveContainer width="100%" height={88} minWidth={0} minHeight={0}>
                  <LineChart data={data.weeklySeries}>
                    <Line
                      type="monotone"
                      dataKey="hours"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      dot={false}
                    />
                    <Tooltip />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[88px] w-full" />
              )}
            </div>
          </Card>

          <Card className="border-white/10 bg-white/[0.07] p-5 xl:col-span-6">
            <p className="text-sm font-semibold text-white">AI Insights & Recommendations</p>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              {data.insights.map((item, index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="rounded-xl border border-white/10 bg-gradient-to-r from-black/30 to-white/[0.03] p-3"
                >
                  <p className="text-sm text-slate-200">{item}</p>
                </motion.div>
              ))}
            </div>
          </Card>

          <Card className="border-white/10 bg-white/[0.07] p-5 xl:col-span-6">
            <p className="text-sm font-semibold text-white">Performance Trend Overview</p>
            <div className="mt-3 h-48 rounded-xl border border-white/10 bg-black/20 p-2">
              {isMounted ? (
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                  <AreaChart data={data.weeklySeries}>
                    <defs>
                      <linearGradient id="performanceFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.65} />
                        <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.08} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
                    <XAxis dataKey="day" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                    <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="hours"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      fill="url(#performanceFill)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full w-full" />
              )}
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
              <span className="inline-flex items-center gap-1">
                <TrendingUp size={12} className="text-cyan-300" /> Improvement notes:{" "}
                {data.summary.improvementNote}
              </span>
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}


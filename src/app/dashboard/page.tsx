"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { AppShell } from "@/components/layout/app-shell";
import { StatCard } from "@/components/dashboard/stat-card";
import {
  ProductivityHeatmap,
  WeeklyConsistencyChart,
  CompactFocusWidget,
} from "@/components/dashboard/charts";
import { DashboardWidgets } from "@/components/dashboard/widgets";
import {
  getDashboardMetrics,
  getFocusDistribution,
  getProductivityHeatmap,
  getWeeklyChartData,
} from "@/lib/analytics";
import { useStorageData } from "@/lib/storage";
import { Card } from "@/components/ui/card";
import {
  AttendanceEntry,
  BacklogEntry,
  DailyLog,
  RevisionEntry,
  TestEntry,
} from "@/lib/types";
import { TrendingUp, Flame, BookOpen, AlertCircle, Zap, Target, BarChart3 } from "lucide-react";

export default function DashboardPage() {
  const dailyLogs = useStorageData<DailyLog>("dailyLogs");
  const tests = useStorageData<TestEntry>("tests");
  const backlogs = useStorageData<BacklogEntry>("backlogs");
  const attendance = useStorageData<AttendanceEntry>("attendance");
  const revisions = useStorageData<RevisionEntry>("revisions");

  const metrics = useMemo(
    () =>
      getDashboardMetrics({
        dailyLogs,
        tests,
        backlogs,
        revisions,
        attendance,
      }),
    [attendance, backlogs, dailyLogs, revisions, tests],
  );

  const weeklyData = useMemo(() => getWeeklyChartData(dailyLogs), [dailyLogs]);
  const focusData = useMemo(() => getFocusDistribution(dailyLogs), [dailyLogs]);
  const heatmapData = useMemo(() => getProductivityHeatmap(dailyLogs), [dailyLogs]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <AppShell title="Academic Dashboard">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        {/* ROW 1: TOP METRICS - 4-column compact */}
        <motion.div
          variants={itemVariants}
          className="grid gap-3 md:grid-cols-2 xl:grid-cols-4"
        >
          <StatCard
            title="Study Hours"
            value={metrics.totalStudyHours}
            icon={<BookOpen className="w-5 h-5" />}
          />
          <StatCard
            title="Streak"
            value={metrics.studyStreak}
            suffix=" days"
            icon={<Flame className="w-5 h-5 text-orange-400" />}
          />
          <StatCard
            title="Productivity"
            value={metrics.productivityScore}
            suffix="%"
            ring={metrics.productivityScore}
            icon={<Zap className="w-5 h-5 text-cyan-400" />}
          />
          <StatCard
            title="Attendance"
            value={metrics.attendancePercent}
            suffix="%"
            ring={metrics.attendancePercent}
          />
        </motion.div>

        {/* ROW 2: MAIN CHART + COMPACT STATS (70/30 split) */}
        <motion.div
          variants={itemVariants}
          className="grid gap-4 xl:grid-cols-4"
        >
          {/* Chart - 70% width (3 cols) */}
          <div className="xl:col-span-3">
            <WeeklyConsistencyChart
              data={weeklyData.data}
              average={weeklyData.average}
              bestDay={weeklyData.bestDay}
            />
          </div>

          {/* Right Stats - 30% width (1 col) - Compact and dense */}
          <div className="space-y-3">
            {/* Revision */}
            <motion.div whileHover={{ y: -1 }} className="group">
              <Card className="border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.04] p-3 backdrop-blur-2xl hover:border-violet-500/30 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-violet-300/80">Revisions</p>
                  <TrendingUp className="w-4 h-4 text-cyan-400/50" />
                </div>
                <p className="text-xl font-bold text-white">{metrics.revisionPercent}%</p>
                <div className="mt-2 h-0.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-cyan-400 to-blue-600"
                    initial={{ width: 0 }}
                    animate={{ width: `${metrics.revisionPercent}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>
              </Card>
            </motion.div>

            {/* Backlogs */}
            <motion.div whileHover={{ y: -1 }} className="group">
              <Card className="border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.04] p-3 backdrop-blur-2xl hover:border-red-500/30 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-red-300/80">Pending</p>
                  <AlertCircle className="w-4 h-4 text-red-400/50" />
                </div>
                <p className="text-xl font-bold text-white">{metrics.pendingBacklogs}</p>
                <p className="text-xs text-slate-500 mt-1">topics</p>
              </Card>
            </motion.div>

            {/* Tests */}
            <motion.div whileHover={{ y: -1 }} className="group">
              <Card className="border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.04] p-3 backdrop-blur-2xl hover:border-green-500/30 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-green-300/80">Tests</p>
                  <BarChart3 className="w-4 h-4 text-green-400/50" />
                </div>
                <p className="text-xl font-bold text-white">{metrics.testsAttempted}</p>
                <p className="text-xs text-slate-500 mt-1">attempted</p>
              </Card>
            </motion.div>

            {/* Chapters */}
            <motion.div whileHover={{ y: -1 }} className="group">
              <Card className="border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.04] p-3 backdrop-blur-2xl hover:border-purple-500/30 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-purple-300/80">Chapters</p>
                  <Target className="w-4 h-4 text-purple-400/50" />
                </div>
                <p className="text-xl font-bold text-white">{metrics.chaptersCompleted}</p>
                <p className="text-xs text-slate-500 mt-1">completed</p>
              </Card>
            </motion.div>
          </div>
        </motion.div>

        {/* ROW 3: FOCUS + HEATMAP (2 columns) */}
        <motion.div variants={itemVariants} className="grid gap-4 xl:grid-cols-2">
          {/* Focus Widget */}
          <CompactFocusWidget data={focusData} />

          {/* Heatmap */}
          <ProductivityHeatmap
            matrix={heatmapData.matrix}
            consistencyScore={heatmapData.consistencyScore}
            averageHours={heatmapData.averageHours}
            bestStreak={heatmapData.bestStreak}
          />
        </motion.div>

        {/* ROW 4: DASHBOARD WIDGETS */}
        <motion.div variants={itemVariants}>
          <DashboardWidgets />
        </motion.div>
      </motion.div>
    </AppShell>
  );
}


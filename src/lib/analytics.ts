import {
  AttendanceEntry,
  BacklogEntry,
  DailyLog,
  Goal,
  RevisionEntry,
  TestEntry,
} from "./types";
import { SUBJECTS } from "./constants";

export function percentage(value: number, total: number) {
  if (!total) return 0;
  return Math.round((value / total) * 100);
}

export function getDashboardMetrics({
  dailyLogs,
  tests,
  backlogs,
  revisions,
  attendance,
}: {
  dailyLogs: DailyLog[];
  tests: TestEntry[];
  backlogs: BacklogEntry[];
  revisions: RevisionEntry[];
  attendance: AttendanceEntry[];
}) {
  const totalStudyHours = dailyLogs.reduce((sum, log) => sum + log.studyHours, 0);
  const chaptersCompleted = dailyLogs.filter(
    (log) => log.notesCompleted === "Completed",
  ).length;
  const pendingBacklogs = backlogs.filter((b) => b.status !== "Completed").length;
  const attended = attendance.filter((a) => a.status === "Present").length;
  const attendancePercent = percentage(attended, attendance.length);
  const revisionComplete = revisions.filter((r) => r.status === "Completed").length;
  const revisionPercent = percentage(revisionComplete, revisions.length);
  const avgTestPercent =
    tests.length === 0
      ? 0
      : Math.round(
          tests.reduce((sum, t) => sum + percentage(t.marksObtained, t.totalMarks), 0) /
            tests.length,
        );
  const productivityScore = Math.min(
    100,
    Math.round(
      totalStudyHours * 2 + revisionPercent * 0.25 + attendancePercent * 0.35 + avgTestPercent * 0.4,
    ),
  );

  return {
    totalStudyHours: Number(totalStudyHours.toFixed(1)),
    chaptersCompleted,
    pendingBacklogs,
    attendancePercent,
    revisionPercent,
    testsAttempted: tests.length,
    productivityScore,
    studyStreak: Math.max(1, Math.round(totalStudyHours / 2)),
  };
}

export function getMonthlySummary(dailyLogs: DailyLog[], tests: TestEntry[]) {
  const monthlyHours = dailyLogs.reduce((sum, log) => sum + log.studyHours, 0);
  const completedNotes = dailyLogs.filter(
    (log) => log.notesCompleted === "Completed",
  ).length;
  const testAverage =
    tests.length === 0
      ? 0
      : Math.round(
          tests.reduce((s, t) => s + percentage(t.marksObtained, t.totalMarks), 0) /
            tests.length,
        );

  return {
    monthlyHours,
    completedNotes,
    testAverage,
    productivityInsight:
      testAverage < 65
        ? "Increase revision after each test and focus weak chapters."
        : "Consistency is strong. Push question practice volume for rank jump.",
    improvementNote:
      monthlyHours < 120
        ? "Target +1 hour daily to unlock better retention."
        : "Maintain the pace and deepen revision cycles.",
  };
}

export function getGoalCompletion(goals: Goal[]) {
  if (goals.length === 0) return 0;
  return Math.round(goals.reduce((sum, g) => sum + g.progress, 0) / goals.length);
}

export function getWeeklyChartData(dailyLogs: DailyLog[]) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
  const totals = new Map<string, number>(days.map((day) => [day, 0]));

  dailyLogs.forEach((log) => {
    const date = new Date(log.date);
    const dayLabel = Number.isNaN(date.getTime())
      ? log.day.slice(0, 3)
      : date.toLocaleDateString("en-US", { weekday: "short" });
    if (totals.has(dayLabel)) {
      totals.set(dayLabel, (totals.get(dayLabel) ?? 0) + log.studyHours);
    }
  });

  const data = days.map((day) => ({
    day,
    hours: Number((totals.get(day) ?? 0).toFixed(1)),
  }));

  const average = Number(
    (data.reduce((sum, item) => sum + item.hours, 0) / Math.max(1, data.length)).toFixed(1),
  );
  const bestDay = data.reduce((best, current) => (current.hours > best.hours ? current : best)).day;

  return { data, average, bestDay };
}

export function getFocusDistribution(dailyLogs: DailyLog[]) {
  const totalsBySubject = SUBJECTS.map((subject) => ({
    key: subject.key,
    name: subject.name === "English Core" ? "English" : subject.name,
    value: 0,
  }));

  const totalsMap = new Map(totalsBySubject.map((subject) => [subject.key, subject]));
  dailyLogs.forEach((log) => {
    const subject = totalsMap.get(log.subject);
    if (subject) {
      subject.value += Math.max(0, log.studyHours);
    }
  });

  const grandTotal = totalsBySubject.reduce((sum, item) => sum + item.value, 0);
  const colors = ["#06b6d4", "#a855f7", "#10b981", "#f97316", "#eab308"];
  return totalsBySubject.map((item, idx) => ({
    name: item.name,
    value: grandTotal ? Math.round((item.value / grandTotal) * 100) : 0,
    color: colors[idx] || "#06b6d4",
  }));
}

export function getProductivityHeatmap(dailyLogs: DailyLog[]) {
  const recentLogs = dailyLogs
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-28);

  const dateHours = new Map<string, number>();
  recentLogs.forEach((log) => {
    dateHours.set(log.date, (dateHours.get(log.date) ?? 0) + Math.max(0, log.studyHours));
  });

  const matrix: number[][] = [];
  let bestStreak = 0;
  let currentStreak = 0;

  for (let week = 0; week < 4; week++) {
    const row: number[] = [];
    for (let day = 0; day < 7; day++) {
      const daysBack = 27 - (week * 7 + day);
      const date = new Date();
      date.setDate(date.getDate() - daysBack);
      const dateKey = date.toISOString().slice(0, 10);
      const hours = dateHours.get(dateKey) ?? 0;
      const intensity = hours <= 0 ? 0 : Math.min(4, Math.floor(hours / 2) + 1);
      row.push(intensity);

      if (hours > 0) {
        currentStreak += 1;
        bestStreak = Math.max(bestStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    }
    matrix.push(row);
  }

  const nonZeroCells = matrix.flat().filter((value) => value > 0).length;
  const totalHours = recentLogs.reduce((sum, log) => sum + Math.max(0, log.studyHours), 0);

  return {
    matrix,
    consistencyScore: Math.round((nonZeroCells / 28) * 100),
    averageHours: Number((totalHours / Math.max(1, 28)).toFixed(1)),
    bestStreak,
  };
}


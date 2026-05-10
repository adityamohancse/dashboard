"use client";

import { type ComponentType, useEffect, useMemo, useRef, useState } from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import {
  BookOpenCheck,
  BriefcaseBusiness,
  Calculator,
  Code2,
  Download,
  Filter,
  Landmark,
  Plus,
  Search,
  Timer,
  TrendingUp,
} from "lucide-react";
import { SUBJECTS, SUBJECT_MAP } from "@/lib/constants";
import { DailyLog, SubjectKey } from "@/lib/types";
import { loadData, saveData } from "@/lib/storage";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { DropdownSelect } from "@/components/ui/dropdown-select";
import { StatusPill } from "./status-pill";
import { ProgressRing } from "@/components/ui/progress-ring";
import { exportToExcel, exportToPDF } from "@/lib/export";
import { SubjectDropdown } from "@/components/ui/subject-dropdown";

const pageSize = 7;
const today = format(new Date(), "yyyy-MM-dd");

const statusOptions = [
  { value: "Completed", label: "Completed" },
  { value: "Partial", label: "Partial" },
  { value: "Pending", label: "Pending" },
] as const;

const subjectOptions: { value: SubjectKey; label: string }[] = SUBJECTS.map((subject) => ({
  value: subject.key as SubjectKey,
  label: subject.name,
}));

const quickFilterOptions = [
  { key: "all", label: "All Logs" },
  { key: "today", label: "Today" },
  { key: "pending", label: "Pending Work" },
  { key: "revision", label: "Revision Due" },
] as const;

const emptyLog: DailyLog = {
  id: "",
  date: format(new Date(), "yyyy-MM-dd"),
  day: format(new Date(), "EEEE"),
  subject: "accountancy",
  chapterTopic: "",
  lectureType: "Self Study",
  facultyName: "",
  notesCompleted: "Pending",
  questionsPracticed: 0,
  homeworkDone: "Pending",
  revisionStatus: "Pending",
  doubts: "",
  assignmentTest: "",
  studyHours: 0,
  remarks: "",
};

const subjectVisuals: Record<
  SubjectKey,
  {
    icon: ComponentType<{ size?: number; className?: string }>;
    ringFrom: string;
    ringTo: string;
    cardGlow: string;
    cardTint: string;
  }
> = {
  accountancy: {
    icon: Calculator,
    ringFrom: "#38bdf8",
    ringTo: "#06b6d4",
    cardGlow: "shadow-cyan-500/20",
    cardTint: "from-sky-500/20 to-cyan-500/10",
  },
  "business-studies": {
    icon: BriefcaseBusiness,
    ringFrom: "#a78bfa",
    ringTo: "#8b5cf6",
    cardGlow: "shadow-violet-500/20",
    cardTint: "from-violet-500/20 to-fuchsia-500/10",
  },
  economics: {
    icon: Landmark,
    ringFrom: "#34d399",
    ringTo: "#22c55e",
    cardGlow: "shadow-emerald-500/20",
    cardTint: "from-emerald-500/20 to-teal-500/10",
  },
  "english-core": {
    icon: BookOpenCheck,
    ringFrom: "#fb923c",
    ringTo: "#f59e0b",
    cardGlow: "shadow-orange-500/20",
    cardTint: "from-orange-500/20 to-amber-500/10",
  },
  "computer-science": {
    icon: Code2,
    ringFrom: "#facc15",
    ringTo: "#f59e0b",
    cardGlow: "shadow-yellow-500/20",
    cardTint: "from-yellow-500/20 to-amber-500/10",
  },
  "applied-math": {
    icon: Calculator,
    ringFrom: "#6366f1",
    ringTo: "#3b82f6",
    cardGlow: "shadow-indigo-500/20",
    cardTint: "from-indigo-500/20 to-blue-500/10",
  },
};

function statusSelectClass(status: DailyLog["notesCompleted"]) {
  if (status === "Completed") {
    return "border-emerald-300/35 bg-emerald-500/10 text-emerald-100";
  }
  if (status === "Partial") {
    return "border-amber-300/35 bg-amber-500/10 text-amber-100";
  }
  return "border-rose-300/35 bg-rose-500/10 text-rose-100";
}

export function DailyLogTable() {
  const [logs, setLogs] = useState<DailyLog[]>(() => loadData<DailyLog>("dailyLogs"));
  const [query, setQuery] = useState("");
  const [subjectFilter, setSubjectFilter] = useState<SubjectKey | "all">("all");
  const [quickFilter, setQuickFilter] = useState<(typeof quickFilterOptions)[number]["key"]>("all");
  const [page, setPage] = useState(1);
  const [draft, setDraft] = useState<DailyLog>(emptyLog);
  const mountedRef = useRef(false);

  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }
    saveData("dailyLogs", logs);
  }, [logs]);

  const filtered = useMemo(() => {
    return logs.filter((log) => {
      const matchesSubject = subjectFilter === "all" || log.subject === subjectFilter;
      const searchSpace =
        `${log.chapterTopic} ${log.assignmentTest} ${log.facultyName}`.toLowerCase();
      const matchesSearch = searchSpace.includes(query.toLowerCase());
      const matchesQuick =
        quickFilter === "all"
          ? true
          : quickFilter === "today"
            ? log.date === today
            : quickFilter === "pending"
              ? [log.notesCompleted, log.homeworkDone, log.revisionStatus].some(
                  (status) => status !== "Completed",
                )
              : log.revisionStatus !== "Completed";
      return matchesSubject && matchesSearch && matchesQuick;
    });
  }, [logs, query, quickFilter, subjectFilter]);

  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  const metrics = useMemo(() => {
    const totalHours = logs.reduce((sum, log) => sum + log.studyHours, 0);
    const pendingCount = logs.filter(
      (log) =>
        log.notesCompleted !== "Completed" ||
        log.homeworkDone !== "Completed" ||
        log.revisionStatus !== "Completed",
    ).length;
    const revisionDone = logs.filter((log) => log.revisionStatus === "Completed").length;
    const revisionRate = logs.length ? Math.round((revisionDone / logs.length) * 100) : 0;
    const uniqueDays = new Set(logs.map((log) => log.date)).size;
    const productivity = Math.min(
      100,
      Math.round(totalHours * 2 + revisionRate * 0.45 - pendingCount * 1.2),
    );
    return {
      totalHours: totalHours.toFixed(1),
      pendingCount,
      revisionRate,
      streak: uniqueDays,
      productivity,
    };
  }, [logs]);

  const subjectProgress = useMemo(() => {
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 6);

    return SUBJECTS.map((subject) => {
      const subjectLogs = logs.filter((log) => log.subject === subject.key);
      const completedChapters = subjectLogs.filter(
        (log) => log.notesCompleted === "Completed",
      ).length;
      const pendingChapters = Math.max(0, subjectLogs.length - completedChapters);
      const completionPercent = subjectLogs.length
        ? Math.round((completedChapters / subjectLogs.length) * 100)
        : 0;
      const revisionDone = subjectLogs.filter(
        (log) => log.revisionStatus === "Completed",
      ).length;
      const revisionScore = subjectLogs.length
        ? Math.round((revisionDone / subjectLogs.length) * 100)
        : 0;
      const weeklyHours = subjectLogs
        .filter((log) => new Date(log.date) >= weekStart)
        .reduce((sum, log) => sum + log.studyHours, 0);
      const completedStates = subjectLogs.reduce((sum, log) => {
        return (
          sum +
          [log.notesCompleted, log.homeworkDone, log.revisionStatus].filter(
            (status) => status === "Completed",
          ).length
        );
      }, 0);
      const consistency = subjectLogs.length
        ? Math.round((completedStates / (subjectLogs.length * 3)) * 100)
        : 0;
      const trendSource = [...subjectLogs]
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(-6);
      const trend = trendSource.length
        ? trendSource.map((log) => Math.max(14, Math.round(log.studyHours * 14)))
        : [20, 26, 22, 30, 25, 34];

      return {
        ...subject,
        completionPercent,
        completedChapters,
        pendingChapters,
        weeklyHours: Number(weeklyHours.toFixed(1)),
        revisionScore,
        consistency,
        trend,
      };
    });
  }, [logs]);

  function addLog() {
    if (!draft.chapterTopic.trim()) return;
    const day = format(new Date(draft.date), "EEEE");
    setLogs((prev) => [{ ...draft, id: crypto.randomUUID(), day }, ...prev]);
    setDraft(emptyLog);
    setPage(1);
  }

  function updateStatus(
    id: string,
    key: "notesCompleted" | "homeworkDone" | "revisionStatus",
    value: DailyLog[typeof key],
  ) {
    setLogs((prev) =>
      prev.map((log) => (log.id === id ? { ...log, [key]: value } : log)),
    );
  }

  function removeLog(id: string) {
    setLogs((prev) => prev.filter((log) => log.id !== id));
  }

  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="grid gap-3 md:grid-cols-2 xl:grid-cols-6"
      >
        <Card className="border-white/10 bg-white/[0.06] p-4">
          <p className="text-xs text-slate-400">Today&apos;s Study Hours</p>
          <p className="mt-2 text-2xl font-semibold text-white">{metrics.totalHours}h</p>
        </Card>
        <Card className="border-white/10 bg-white/[0.06] p-4">
          <p className="text-xs text-slate-400">Current Streak</p>
          <p className="mt-2 text-2xl font-semibold text-cyan-200">{metrics.streak} days</p>
        </Card>
        <Card className="border-white/10 bg-white/[0.06] p-4">
          <p className="text-xs text-slate-400">Weekly Productivity</p>
          <p className="mt-2 text-2xl font-semibold text-violet-200">{metrics.productivity}%</p>
        </Card>
        <Card className="border-white/10 bg-white/[0.06] p-4">
          <p className="text-xs text-slate-400">Pending Backlogs</p>
          <p className="mt-2 text-2xl font-semibold text-rose-200">{metrics.pendingCount}</p>
        </Card>
        <Card className="border-white/10 bg-white/[0.06] p-4">
          <p className="text-xs text-slate-400">Revision Completion</p>
          <div className="mt-2 flex items-center justify-between">
            <p className="text-2xl font-semibold text-emerald-200">{metrics.revisionRate}%</p>
            <ProgressRing value={metrics.revisionRate} label="rev" size={56} />
          </div>
        </Card>
        <Card className="border-white/10 bg-white/[0.06] p-4">
          <p className="text-xs text-slate-400">Subject Progress</p>
          <div className="mt-2 flex items-center gap-1 overflow-auto">
            {subjectProgress.map((subject) => (
              <div
                key={subject.key}
                className="rounded-lg border border-white/10 bg-black/20 px-2 py-1 text-center"
              >
                <p className="text-[10px] text-slate-300">{subject.name.split(" ")[0]}</p>
                <p className="text-xs font-semibold text-white">{subject.completionPercent}%</p>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      <Card className="border-white/10 bg-white/[0.06] p-4">
        <div className="mb-3 flex items-center gap-2">
          <Plus size={14} className="text-cyan-300" />
          <p className="text-sm font-semibold text-white">Add study log</p>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-12">
          <Input
            value={draft.chapterTopic}
            onChange={(e) => setDraft((d) => ({ ...d, chapterTopic: e.target.value }))}
            placeholder="Chapter / Topic covered"
            className="h-11 rounded-2xl border-white/10 bg-black/25 px-3.5 text-slate-100 placeholder:text-slate-500 md:col-span-2 xl:col-span-4"
          />
          <div className="relative z-0 overflow-visible md:col-span-1 xl:col-span-3">
            <SubjectDropdown
              value={draft.subject}
              onChange={(subject) => setDraft((d) => ({ ...d, subject }))}
              options={subjectOptions}
              className="w-full"
              menuClassName="max-w-md"
              forceInline={true}
            />
          </div>
          <Input
            type="number"
            min={0}
            step={0.5}
            value={draft.studyHours}
            onChange={(e) =>
              setDraft((d) => ({ ...d, studyHours: Number(e.target.value) }))
            }
            placeholder="Study hours"
            className="h-11 rounded-2xl border-white/10 bg-black/25 px-3.5 text-slate-100 placeholder:text-slate-500 md:col-span-1 xl:col-span-2"
          />
          <Input
            type="date"
            value={draft.date}
            onChange={(e) => setDraft((d) => ({ ...d, date: e.target.value }))}
            className="h-11 rounded-2xl border-white/10 bg-black/25 px-3.5 text-slate-100 md:col-span-1 xl:col-span-2"
          />
          <Button
            onClick={addLog}
            className="h-11 rounded-2xl bg-gradient-to-r from-cyan-400 to-violet-500 text-white hover:brightness-105 md:col-span-2 xl:col-span-1"
          >
            Add Entry
          </Button>
        </div>
      </Card>

      <Card className="border-white/10 bg-white/[0.06] p-4">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <div className="relative min-w-[220px] flex-1">
            <Search
              size={14}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            />
            <Input
              placeholder="Search chapter, assignment, faculty..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-10 rounded-xl border-white/10 bg-black/25 pl-9 text-slate-100 placeholder:text-slate-500"
            />
          </div>
          <Select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value as SubjectKey | "all")}
            className="h-10 w-48 rounded-xl border-white/10 bg-black/25 text-slate-100"
          >
            <option value="all">All Subjects</option>
            {SUBJECTS.map((subject) => (
              <option key={subject.key} value={subject.key}>
                {subject.name}
              </option>
            ))}
          </Select>
          <Button
            variant="secondary"
            size="sm"
            className="h-10 rounded-xl border-white/10 bg-black/25 text-slate-200 hover:bg-black/35"
            onClick={() => exportToExcel(logs, "daily-log")}
          >
            <Download size={13} className="mr-1" />
            Excel
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="h-10 rounded-xl border-white/10 bg-black/25 text-slate-200 hover:bg-black/35"
            onClick={() => exportToPDF(logs, "Daily Log Report")}
          >
            <Download size={13} className="mr-1" />
            PDF
          </Button>
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[11px] text-slate-300">
            <Filter size={11} />
            Quick filters
          </div>
          {quickFilterOptions.map((chip) => (
            <button
              key={chip.key}
              type="button"
              onClick={() => setQuickFilter(chip.key)}
              className={`rounded-full px-3 py-1 text-xs transition ${
                quickFilter === chip.key
                  ? "bg-gradient-to-r from-cyan-400/30 to-violet-500/35 text-white"
                  : "border border-white/10 bg-black/20 text-slate-300 hover:bg-black/30"
              }`}
            >
              {chip.label}
            </button>
          ))}
          <p className="ml-auto inline-flex items-center gap-1 text-xs text-slate-400">
            <Timer size={12} />
            Weekly total: {metrics.totalHours}h
          </p>
        </div>

        <div className="hidden md:block">
          <div className="relative overflow-x-auto overflow-y-visible rounded-2xl">
            <table className="min-w-[1200px] border-separate border-spacing-y-2 text-sm">
              <thead className="sticky top-0 z-20 bg-[#0a1224]/90 backdrop-blur">
                <tr>
                  {[
                    "Date",
                    "Subject",
                    "Topic",
                    "Faculty",
                    "Notes",
                    "Questions",
                    "Homework",
                    "Revision",
                    "Assignment",
                    "Hours",
                    "Action",
                  ].map((head) => (
                    <th
                      key={head}
                      className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.08em] text-slate-400"
                    >
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paged.map((row) => (
                  <motion.tr
                    key={row.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl bg-white/[0.05] shadow-lg shadow-slate-950/30 transition hover:bg-white/[0.08]"
                  >
                    <td className="rounded-l-2xl px-3 py-4 text-slate-300">
                      <p>{row.date}</p>
                      <p className="text-xs text-slate-500">{row.day}</p>
                    </td>
                    <td className="px-3 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${SUBJECT_MAP[row.subject].color}`}
                      >
                        {SUBJECT_MAP[row.subject].name}
                      </span>
                    </td>
                    <td className="px-3 py-4">
                      <p className="max-w-56 font-medium text-slate-100">{row.chapterTopic}</p>
                      <p className="text-xs text-slate-500">{row.lectureType}</p>
                    </td>
                    <td className="px-3 py-4 text-slate-300">
                      {row.facultyName || SUBJECT_MAP[row.subject].faculty}
                    </td>
                    <td className="px-3 py-4">
                      <DropdownSelect
                        value={row.notesCompleted}
                        options={statusOptions}
                        onChange={(value) => updateStatus(row.id, "notesCompleted", value)}
                        className={`h-9 min-w-[128px] rounded-xl border-white/10 ${statusSelectClass(row.notesCompleted)}`}
                      />
                    </td>
                    <td className="px-3 py-4 text-slate-200">{row.questionsPracticed}</td>
                    <td className="px-3 py-4">
                      <DropdownSelect
                        value={row.homeworkDone}
                        options={statusOptions}
                        onChange={(value) => updateStatus(row.id, "homeworkDone", value)}
                        className={`h-9 min-w-[128px] rounded-xl border-white/10 ${statusSelectClass(row.homeworkDone)}`}
                      />
                    </td>
                    <td className="px-3 py-4">
                      <DropdownSelect
                        value={row.revisionStatus}
                        options={statusOptions}
                        onChange={(value) => updateStatus(row.id, "revisionStatus", value)}
                        className={`h-9 min-w-[128px] rounded-xl border-white/10 ${statusSelectClass(row.revisionStatus)}`}
                      />
                    </td>
                    <td className="px-3 py-4 text-slate-300">{row.assignmentTest || "-"}</td>
                    <td className="px-3 py-4 text-slate-200">{row.studyHours}</td>
                    <td className="rounded-r-2xl px-3 py-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 rounded-lg text-slate-300 hover:bg-rose-500/20 hover:text-rose-200"
                        onClick={() => removeLog(row.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-3 md:hidden">
          {paged.map((row) => (
            <Card key={row.id} className="border-white/10 bg-white/[0.06] p-4">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs text-slate-400">
                  {row.date} • {row.day}
                </p>
                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${SUBJECT_MAP[row.subject].color}`}
                >
                  {SUBJECT_MAP[row.subject].name}
                </span>
              </div>
              <p className="text-sm font-medium text-white">{row.chapterTopic}</p>
              <p className="mt-1 text-xs text-slate-400">
                {row.facultyName || SUBJECT_MAP[row.subject].faculty}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <StatusPill status={row.notesCompleted} />
                <StatusPill status={row.homeworkDone} />
                <StatusPill status={row.revisionStatus} />
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                <span>Questions: {row.questionsPracticed}</span>
                <span>Hours: {row.studyHours}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="mt-3 h-8 rounded-lg text-slate-300 hover:bg-rose-500/20 hover:text-rose-200"
                onClick={() => removeLog(row.id)}
              >
                Delete
              </Button>
            </Card>
          ))}
        </div>

        {paged.length === 0 && (
          <div className="rounded-xl border border-white/10 bg-black/20 px-4 py-6 text-sm text-slate-400">
            No entries found for selected filters.
          </div>
        )}

        <div className="mt-4 flex items-center justify-end gap-2">
          <Button
            variant="secondary"
            size="sm"
            className="h-9 rounded-lg border-white/10 bg-black/25 text-slate-200 hover:bg-black/35"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Prev
          </Button>
          <p className="rounded-md border border-white/10 px-2 py-1 text-xs text-slate-300">
            {page}/{pages}
          </p>
          <Button
            variant="secondary"
            size="sm"
            className="h-9 rounded-lg border-white/10 bg-black/25 text-slate-200 hover:bg-black/35"
            onClick={() => setPage((p) => Math.min(pages, p + 1))}
          >
            Next
          </Button>
        </div>
      </Card>

      <Card className="border-white/10 bg-white/[0.06] p-4 md:p-5">
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-cyan-300/90">
              Subject Analytics
            </p>
            <h3 className="mt-1 text-xl font-semibold text-white md:text-2xl">
              Subject Progress Intelligence
            </h3>
            <p className="mt-1 text-xs text-slate-400 md:text-sm">
              Completion %, chapter velocity, revision score, and weekly consistency by subject.
            </p>
          </div>
          <p className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-black/25 px-3 py-1 text-xs text-slate-300">
            <TrendingUp size={12} className="text-cyan-300" />
            Live growth widgets
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {subjectProgress.map((subject, index) => {
            const visual = subjectVisuals[subject.key];
            const Icon = visual.icon;
            return (
              <motion.div
                key={subject.key}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
                className="h-full"
              >
                <Card
                  className={`group relative h-full overflow-hidden border-white/10 bg-gradient-to-br ${visual.cardTint} p-4 shadow-xl ${visual.cardGlow} transition duration-300 hover:-translate-y-1 hover:border-white/20`}
                >
                  <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
                  <div className="relative">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[11px] uppercase tracking-[0.14em] text-slate-400">
                          {subject.name}
                        </p>
                        <p className="mt-1 text-3xl font-semibold text-white">
                          {subject.completionPercent}%
                        </p>
                      </div>
                      <ProgressRing
                        value={subject.completionPercent}
                        label="Completed"
                        size={126}
                        gradientFrom={visual.ringFrom}
                        gradientTo={visual.ringTo}
                        center={<Icon size={16} />}
                      />
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-2">
                        <p className="text-[11px] text-slate-400">Chapters done</p>
                        <p className="text-sm font-semibold text-emerald-200">
                          {subject.completedChapters}
                        </p>
                      </div>
                      <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-2">
                        <p className="text-[11px] text-slate-400">Pending</p>
                        <p className="text-sm font-semibold text-rose-200">
                          {subject.pendingChapters}
                        </p>
                      </div>
                      <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-2">
                        <p className="text-[11px] text-slate-400">Weekly hours</p>
                        <p className="text-sm font-semibold text-cyan-200">
                          {subject.weeklyHours}h
                        </p>
                      </div>
                      <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-2">
                        <p className="text-[11px] text-slate-400">Revision score</p>
                        <p className="text-sm font-semibold text-violet-200">
                          {subject.revisionScore}%
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 rounded-xl border border-white/10 bg-black/20 px-3 py-2">
                      <div className="mb-1 flex items-center justify-between text-[11px] text-slate-400">
                        <span>Study trend</span>
                        <span>Consistency {subject.consistency}%</span>
                      </div>
                      <div className="flex h-10 items-end gap-1.5">
                        {subject.trend.map((value, barIndex) => (
                          <div
                            key={`${subject.key}-${barIndex}`}
                            className="flex-1 rounded-t-sm bg-gradient-to-t from-cyan-400/70 to-violet-400/70 transition-all duration-300 group-hover:from-cyan-300 group-hover:to-violet-300"
                            style={{ height: value }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}


"use client";

import { useParams } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { SUBJECT_MAP } from "@/lib/constants";
import { Card } from "@/components/ui/card";
import { useStorageData } from "@/lib/storage";
import { DailyLog, SubjectKey } from "@/lib/types";
import { ProgressRing } from "@/components/ui/progress-ring";

export default function SubjectDetailPage() {
  const params = useParams<{ subject: SubjectKey }>();
  const subjectKey = params.subject;
  const subject = SUBJECT_MAP[subjectKey];

  const logs = useStorageData<DailyLog>("dailyLogs");
  const subjectLogs = logs.filter((log) => log.subject === subjectKey);
  const completed = subjectLogs.filter((log) => log.notesCompleted === "Completed").length;
  const revisionDone = subjectLogs.filter((log) => log.revisionStatus === "Completed").length;
  const pending = subjectLogs.length - completed;
  const progress = subjectLogs.length ? Math.round((completed / subjectLogs.length) * 100) : 0;

  if (!subject) {
    return <AppShell title="Subject not found">Invalid subject route.</AppShell>;
  }

  return (
    <AppShell title={`${subject.name} Tracker`}>
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className={`bg-gradient-to-br ${subject.gradient}`}>
          <p className="text-xs text-slate-600">Faculty</p>
          <h3 className="text-lg font-bold text-slate-800">{subject.faculty}</h3>
          <div className="mt-3">
            <ProgressRing value={progress} label="Overall" />
          </div>
        </Card>
        <Card>
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Progress Summary</h3>
          <div className="mt-2 space-y-2 text-sm text-slate-600 dark:text-slate-300">
            <p>Chapters completed: {completed}</p>
            <p>Pending topics: {pending}</p>
            <p>Revision done: {revisionDone}</p>
            <p>Weak areas: Numericals, case-based questions</p>
          </div>
        </Card>
        <Card>
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Tracking Blocks</h3>
          <div className="mt-2 space-y-2 text-sm text-slate-600 dark:text-slate-300">
            <p>• Notes tracking</p>
            <p>• Homework tracking</p>
            <p>• Revision tracker</p>
            <p>• Subject analytics</p>
          </div>
        </Card>
      </div>
      <Card className="mt-4">
        <h3 className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">Recent Topic Logs</h3>
        <div className="space-y-2">
          {subjectLogs.map((log) => (
            <div key={log.id} className="rounded-xl border border-slate-200 bg-white/60 p-3 text-sm dark:border-slate-700 dark:bg-slate-900/60">
              <p className="font-medium text-slate-700 dark:text-slate-100">
                {log.chapterTopic} ({log.date})
              </p>
              <p className="text-slate-500">Homework: {log.homeworkDone} • Revision: {log.revisionStatus}</p>
            </div>
          ))}
          {subjectLogs.length === 0 && <p className="text-sm text-slate-500">No entries yet.</p>}
        </div>
      </Card>
    </AppShell>
  );
}


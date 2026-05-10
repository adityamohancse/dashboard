"use client";

import { AppShell } from "@/components/layout/app-shell";
import { SUBJECTS } from "@/lib/constants";
import { SubjectCard } from "@/components/subjects/subject-card";
import { DailyLog } from "@/lib/types";
import { useStorageData } from "@/lib/storage";

export default function SubjectsPage() {
  const logs = useStorageData<DailyLog>("dailyLogs");

  return (
    <AppShell title="Subject-wise Tracker">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {SUBJECTS.map((subject) => {
          const subjectLogs = logs.filter((log) => log.subject === subject.key);
          const completed = subjectLogs.filter((log) => log.notesCompleted === "Completed").length;
          const pending = subjectLogs.length - completed;
          const progress = subjectLogs.length ? Math.round((completed / subjectLogs.length) * 100) : 0;

          return (
            <SubjectCard
              key={subject.key}
              subject={subject}
              progress={progress}
              completed={completed}
              pending={pending}
            />
          );
        })}
      </div>
    </AppShell>
  );
}


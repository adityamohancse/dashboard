"use client";

import { useEffect, useRef, useState } from "react";
import { SUBJECT_MAP } from "@/lib/constants";
import { RevisionEntry } from "@/lib/types";
import { loadData, saveData } from "@/lib/storage";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";

export function RevisionCalendar() {
  const [revisions, setRevisions] = useState<RevisionEntry[]>(() =>
    loadData<RevisionEntry>("revisions"),
  );
  const mountedRef = useRef(false);

  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }
    saveData("revisions", revisions);
  }, [revisions]);

  function markDone(id: string) {
    setRevisions((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: "Completed" } : item)),
    );
  }

  const streak = revisions.filter((r) => r.status === "Completed").length;

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <h3 className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
          Revision Calendar
        </h3>
        <div className="space-y-2">
          {revisions.map((revision) => (
            <div
              key={revision.id}
              className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-white/60 p-3 dark:border-slate-700 dark:bg-slate-900/60"
            >
              <p className="w-24 text-sm text-slate-600 dark:text-slate-300">{revision.date}</p>
              <p className="min-w-40 text-sm font-medium text-slate-700 dark:text-slate-100">
                {SUBJECT_MAP[revision.subject].name}
              </p>
              <p className="flex-1 text-sm text-slate-600 dark:text-slate-300">{revision.topic}</p>
              <p className="rounded-lg bg-slate-100 px-2 py-1 text-xs dark:bg-slate-800">
                {revision.stage}
              </p>
              <Select
                value={revision.status}
                onChange={(e) =>
                  setRevisions((prev) =>
                    prev.map((item) =>
                      item.id === revision.id
                        ? { ...item, status: e.target.value as RevisionEntry["status"] }
                        : item,
                    ),
                  )
                }
                className="w-32"
              >
                <option>Completed</option>
                <option>Partial</option>
                <option>Pending</option>
              </Select>
              <Button size="sm" variant="secondary" onClick={() => markDone(revision.id)}>
                Done
              </Button>
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <p className="text-xs text-slate-500">Revision Streak</p>
        <p className="mt-2 text-3xl font-bold text-slate-800 dark:text-slate-100">{streak} days</p>
        <p className="mt-4 text-xs text-slate-500">Daily target: 3 revision blocks</p>
        <p className="mt-2 rounded-lg bg-amber-50 p-3 text-xs text-amber-800">
          Reminder: Economics Day-7 cycle due tomorrow.
        </p>
      </Card>
    </div>
  );
}


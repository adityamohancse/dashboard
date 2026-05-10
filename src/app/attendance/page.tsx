"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { format } from "date-fns";
import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AttendanceEntry } from "@/lib/types";
import { loadData, saveData } from "@/lib/storage";
import { percentage } from "@/lib/analytics";

export default function AttendancePage() {
  const [attendance, setAttendance] = useState<AttendanceEntry[]>(() =>
    loadData<AttendanceEntry>("attendance"),
  );
  const mountedRef = useRef(false);

  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }
    saveData("attendance", attendance);
  }, [attendance]);

  const present = useMemo(
    () => attendance.filter((entry) => entry.status === "Present").length,
    [attendance],
  );
  const absent = attendance.length - present;
  const percent = percentage(present, attendance.length);
  const today = format(new Date(), "yyyy-MM-dd");

  const sortedAttendance = useMemo(
    () => [...attendance].sort((a, b) => b.date.localeCompare(a.date)),
    [attendance],
  );

  function markForDate(status: AttendanceEntry["status"], date = today) {
    setAttendance((prev) => {
      const existing = prev.find((entry) => entry.date === date);
      if (existing) {
        return prev.map((entry) =>
          entry.date === date ? { ...entry, status } : entry,
        );
      }
      return [{ id: crypto.randomUUID(), date, status }, ...prev];
    });
  }

  function remove(id: string) {
    setAttendance((prev) => prev.filter((entry) => entry.id !== id));
  }

  return (
    <AppShell title="Attendance Tracker">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <p className="text-xs text-slate-500">Attendance %</p>
          <p className="mt-2 text-3xl font-bold text-slate-800 dark:text-slate-100">{percent}%</p>
        </Card>
        <Card>
          <p className="text-xs text-slate-500">Present Days</p>
          <p className="mt-2 text-3xl font-bold text-slate-800 dark:text-slate-100">{present}</p>
        </Card>
        <Card>
          <p className="text-xs text-slate-500">Absent Days</p>
          <p className="mt-2 text-3xl font-bold text-slate-800 dark:text-slate-100">{absent}</p>
        </Card>
        <Card>
          <p className="text-xs text-slate-500">Quick Mark ({today})</p>
          <div className="mt-3 flex gap-2">
            <Button size="sm" onClick={() => markForDate("Present")}>
              Present
            </Button>
            <Button size="sm" variant="secondary" onClick={() => markForDate("Absent")}>
              Absent
            </Button>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Re-marking today updates the same entry instead of creating duplicates.
          </p>
        </Card>
      </div>

      <Card className="mt-4">
        <h3 className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-200">Attendance Log</h3>
        <div className="space-y-2">
          {sortedAttendance.map((entry) => (
            <div key={entry.id} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white/60 p-3 text-sm dark:border-slate-700 dark:bg-slate-900/60">
              <p>{entry.date}</p>
              <div className="flex items-center gap-2">
                <p
                  className={
                    entry.status === "Present"
                      ? "rounded-lg bg-emerald-100 px-2 py-1 text-emerald-700"
                      : "rounded-lg bg-rose-100 px-2 py-1 text-rose-700"
                  }
                >
                  {entry.status}
                </p>
                <Button size="sm" variant="ghost" onClick={() => markForDate("Present", entry.date)}>
                  Present
                </Button>
                <Button size="sm" variant="ghost" onClick={() => markForDate("Absent", entry.date)}>
                  Absent
                </Button>
                <Button size="sm" variant="ghost" onClick={() => remove(entry.id)}>
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </AppShell>
  );
}


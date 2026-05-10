"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Goal } from "@/lib/types";
import { loadData, saveData } from "@/lib/storage";
import { getGoalCompletion } from "@/lib/analytics";

const initialGoal: Goal = {
  id: "",
  title: "",
  targetDate: new Date().toISOString().slice(0, 10),
  progress: 0,
  category: "Academic",
};

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>(() => loadData<Goal>("goals"));
  const [draft, setDraft] = useState(initialGoal);
  const mountedRef = useRef(false);

  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }
    saveData("goals", goals);
  }, [goals]);

  const completion = useMemo(() => getGoalCompletion(goals), [goals]);

  function addGoal() {
    if (!draft.title.trim()) return;
    setGoals((prev) => [{ ...draft, id: crypto.randomUUID() }, ...prev]);
    setDraft(initialGoal);
  }

  return (
    <AppShell title="Goal Management & Study Streak">
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Goal Tracker</h3>
          <div className="mt-3 grid gap-3 md:grid-cols-4">
            <Input
              placeholder="Goal title"
              value={draft.title}
              onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
              className="md:col-span-2"
            />
            <Input
              type="date"
              value={draft.targetDate}
              onChange={(e) => setDraft((d) => ({ ...d, targetDate: e.target.value }))}
            />
            <Button onClick={addGoal}>Add Goal</Button>
            <Select
              value={draft.category}
              onChange={(e) => setDraft((d) => ({ ...d, category: e.target.value as Goal["category"] }))}
            >
              <option>Academic</option>
              <option>Revision</option>
              <option>Consistency</option>
            </Select>
            <Input
              type="number"
              value={draft.progress}
              onChange={(e) => setDraft((d) => ({ ...d, progress: Number(e.target.value) }))}
              placeholder="Progress %"
            />
          </div>
          <div className="mt-4 space-y-2">
            {goals.map((goal) => (
              <div key={goal.id} className="rounded-xl border border-slate-200 bg-white/60 p-3 text-sm dark:border-slate-700 dark:bg-slate-900/60">
                <p className="font-medium text-slate-700 dark:text-slate-100">{goal.title}</p>
                <p className="text-slate-500">
                  {goal.category} • Target: {goal.targetDate} • Progress: {goal.progress}%
                </p>
                <div className="mt-2 h-2 rounded-full bg-slate-200 dark:bg-slate-700">
                  <div className="h-2 rounded-full bg-gradient-to-r from-sky-400 to-violet-400" style={{ width: `${goal.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <p className="text-xs text-slate-500">Goal Completion</p>
          <p className="mt-2 text-3xl font-bold text-slate-800 dark:text-slate-100">{completion}%</p>
          <p className="mt-4 text-xs text-slate-500">Achievement Badges</p>
          <div className="mt-2 space-y-2 text-sm text-slate-600 dark:text-slate-300">
            <p>🏅 7-Day Study Streak</p>
            <p>⚡ 100+ Hours Month</p>
            <p>📘 Revision Warrior</p>
          </div>
          <p className="mt-4 text-xs text-slate-500">Weekly Challenge: Attempt 2 mock tests + 1 backlog clear sprint.</p>
        </Card>
      </div>
    </AppShell>
  );
}


"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { isBefore, parseISO } from "date-fns";
import { SUBJECTS, SUBJECT_MAP } from "@/lib/constants";
import { BacklogEntry } from "@/lib/types";
import { loadData, saveData } from "@/lib/storage";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { StatusPill } from "./status-pill";

const initialBacklog: BacklogEntry = {
  id: "",
  subject: "accountancy",
  pendingTopic: "",
  reason: "",
  priority: "Medium",
  deadline: new Date().toISOString().slice(0, 10),
  status: "Pending",
};

export function BacklogTable() {
  const [backlogs, setBacklogs] = useState<BacklogEntry[]>(() =>
    loadData<BacklogEntry>("backlogs"),
  );
  const [draft, setDraft] = useState<BacklogEntry>(initialBacklog);
  const [priorityFilter, setPriorityFilter] = useState("all");
  const mountedRef = useRef(false);

  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }
    saveData("backlogs", backlogs);
  }, [backlogs]);

  function addBacklog() {
    if (!draft.pendingTopic.trim()) return;
    setBacklogs((prev) => [{ ...draft, id: crypto.randomUUID() }, ...prev]);
    setDraft(initialBacklog);
  }

  const filtered = useMemo(
    () =>
      backlogs
        .filter((item) => priorityFilter === "all" || item.priority === priorityFilter)
        .sort((a, b) => {
          const priorityRank = { High: 1, Medium: 2, Low: 3 };
          return priorityRank[a.priority] - priorityRank[b.priority];
        }),
    [backlogs, priorityFilter],
  );

  return (
    <div className="space-y-4">
      <Card>
        <div className="grid gap-3 md:grid-cols-6">
          <Input
            placeholder="Pending Topic"
            value={draft.pendingTopic}
            onChange={(e) => setDraft((d) => ({ ...d, pendingTopic: e.target.value }))}
            className="md:col-span-2"
          />
          <Select
            value={draft.subject}
            onChange={(e) => setDraft((d) => ({ ...d, subject: e.target.value as BacklogEntry["subject"] }))}
          >
            {SUBJECTS.map((subject) => (
              <option key={subject.key} value={subject.key}>
                {subject.name}
              </option>
            ))}
          </Select>
          <Select
            value={draft.priority}
            onChange={(e) => setDraft((d) => ({ ...d, priority: e.target.value as BacklogEntry["priority"] }))}
          >
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </Select>
          <Input
            type="date"
            value={draft.deadline}
            onChange={(e) => setDraft((d) => ({ ...d, deadline: e.target.value }))}
          />
          <Button onClick={addBacklog}>Add Backlog</Button>
        </div>
      </Card>

      <Card>
        <div className="mb-3 flex items-center gap-2">
          <Select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} className="w-56">
            <option value="all">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </Select>
          <p className="ml-auto text-sm text-slate-500">Smart reminders: {filtered.filter((b) => b.status !== "Completed").length}</p>
        </div>
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
          <table className="min-w-[900px] text-sm">
            <thead className="bg-slate-50 dark:bg-slate-900">
              <tr>
                {["Subject", "Pending Topic", "Reason", "Priority", "Deadline", "Completion Status", "Alert"].map((head) => (
                  <th key={head} className="border-b border-slate-200 px-3 py-2 text-left dark:border-slate-700">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => {
                const overdue =
                  item.status !== "Completed" && isBefore(parseISO(item.deadline), new Date());
                return (
                  <tr key={item.id} className="border-b border-slate-100 dark:border-slate-800">
                    <td className="px-3 py-2">{SUBJECT_MAP[item.subject].name}</td>
                    <td className="px-3 py-2">{item.pendingTopic}</td>
                    <td className="px-3 py-2">{item.reason || "-"}</td>
                    <td className="px-3 py-2">{item.priority}</td>
                    <td className="px-3 py-2">{item.deadline}</td>
                    <td className="px-3 py-2">
                      <StatusPill status={item.status} />
                    </td>
                    <td className="px-3 py-2">
                      {overdue ? (
                        <span className="rounded-lg bg-rose-100 px-2 py-1 text-xs text-rose-700">
                          Overdue
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}


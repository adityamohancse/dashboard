"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { SUBJECTS, SUBJECT_MAP } from "@/lib/constants";
import { TestEntry } from "@/lib/types";
import { loadData, saveData } from "@/lib/storage";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { percentage } from "@/lib/analytics";
import { exportToExcel, exportToPDF } from "@/lib/export";

const initialTest: TestEntry = {
  id: "",
  date: new Date().toISOString().slice(0, 10),
  subject: "accountancy",
  testName: "",
  marksObtained: 0,
  totalMarks: 100,
  mistakesToImprove: "",
  revisionRequired: "Pending",
};

export function TestPerformanceTable() {
  const [tests, setTests] = useState<TestEntry[]>(() => loadData<TestEntry>("tests"));
  const [draft, setDraft] = useState<TestEntry>(initialTest);
  const [subjectFilter, setSubjectFilter] = useState("all");
  const mountedRef = useRef(false);

  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }
    saveData("tests", tests);
  }, [tests]);

  const filtered = useMemo(
    () => tests.filter((test) => subjectFilter === "all" || test.subject === subjectFilter),
    [subjectFilter, tests],
  );

  function addTest() {
    if (!draft.testName.trim()) return;
    setTests((prev) => [{ ...draft, id: crypto.randomUUID() }, ...prev]);
    setDraft(initialTest);
  }

  const average = filtered.length
    ? Math.round(
        filtered.reduce((sum, item) => sum + percentage(item.marksObtained, item.totalMarks), 0) /
          filtered.length,
      )
    : 0;

  return (
    <div className="space-y-4">
      <Card>
        <div className="grid gap-3 md:grid-cols-6">
          <Input
            placeholder="Test Name"
            value={draft.testName}
            onChange={(e) => setDraft((d) => ({ ...d, testName: e.target.value }))}
            className="md:col-span-2"
          />
          <Select
            value={draft.subject}
            onChange={(e) => setDraft((d) => ({ ...d, subject: e.target.value as TestEntry["subject"] }))}
          >
            {SUBJECTS.map((subject) => (
              <option key={subject.key} value={subject.key}>
                {subject.name}
              </option>
            ))}
          </Select>
          <Input
            type="number"
            value={draft.marksObtained}
            onChange={(e) => setDraft((d) => ({ ...d, marksObtained: Number(e.target.value) }))}
          />
          <Input
            type="number"
            value={draft.totalMarks}
            onChange={(e) => setDraft((d) => ({ ...d, totalMarks: Number(e.target.value) }))}
          />
          <Button onClick={addTest}>Add Test</Button>
        </div>
      </Card>

      <Card>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Select value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)} className="w-56">
            <option value="all">All Subjects</option>
            {SUBJECTS.map((subject) => (
              <option key={subject.key} value={subject.key}>
                {subject.name}
              </option>
            ))}
          </Select>
          <Button variant="secondary" size="sm" onClick={() => exportToExcel(filtered, "test-performance")}>
            Export Excel
          </Button>
          <Button variant="secondary" size="sm" onClick={() => exportToPDF(filtered, "Test Performance")}>
            Export PDF
          </Button>
          <p className="ml-auto text-sm text-slate-500">Average: {average}%</p>
        </div>
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
          <table className="min-w-[900px] text-sm">
            <thead className="bg-slate-50 dark:bg-slate-900">
              <tr>
                {[
                  "Date",
                  "Subject",
                  "Test Name",
                  "Marks",
                  "Total",
                  "Percentage",
                  "Mistakes to Improve",
                  "Revision Required",
                  "Alert",
                ].map((head) => (
                  <th key={head} className="border-b border-slate-200 px-3 py-2 text-left dark:border-slate-700">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((test) => {
                const percent = percentage(test.marksObtained, test.totalMarks);
                const low = percent < 60;
                return (
                  <tr key={test.id} className="border-b border-slate-100 dark:border-slate-800">
                    <td className="px-3 py-2">{test.date}</td>
                    <td className="px-3 py-2">{SUBJECT_MAP[test.subject].name}</td>
                    <td className="px-3 py-2">{test.testName}</td>
                    <td className="px-3 py-2">{test.marksObtained}</td>
                    <td className="px-3 py-2">{test.totalMarks}</td>
                    <td className="px-3 py-2">{percent}%</td>
                    <td className="px-3 py-2">{test.mistakesToImprove || "-"}</td>
                    <td className="px-3 py-2">{test.revisionRequired}</td>
                    <td className="px-3 py-2">
                      {low ? <span className="rounded-lg bg-rose-100 px-2 py-1 text-xs text-rose-700">Low Score Alert</span> : "-"}
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


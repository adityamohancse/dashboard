"use client";

import { Bot, CalendarCheck2, CheckCircle2, Sparkles, Target, Timer } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motivationQuotes } from "@/lib/mock-data";
import { PomodoroTimer } from "@/components/productivity/pomodoro";

export function DashboardWidgets() {
  const quote = motivationQuotes[new Date().getDate() % motivationQuotes.length];
  const suggestions = [
    "Economics revision needs one extra 30-min slot tonight.",
    "Prioritize Accountancy backlog before 8 PM.",
    "Attempt one mixed chapter test to keep momentum.",
  ];

  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      <Card className="border-white/10 bg-gradient-to-br from-cyan-500/15 to-blue-500/10 p-3">
        <p className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-200">
          <Sparkles size={12} /> Motivation
        </p>
        <p className="mt-1.5 text-sm leading-5 text-slate-100">{quote}</p>
      </Card>

      <Card className="border-white/10 bg-gradient-to-br from-violet-500/15 to-fuchsia-500/10 p-3">
        <p className="inline-flex items-center gap-1 text-xs font-semibold text-violet-200">
          <CalendarCheck2 size={12} /> Revision
        </p>
        <div className="mt-1.5 space-y-1 text-xs text-slate-200">
          <p>• Bills of Exchange - Day 3</p>
          <p>• Demand Elasticity - Day 7</p>
        </div>
      </Card>

      <Card className="border-white/10 bg-gradient-to-br from-emerald-500/15 to-teal-500/10 p-3">
        <p className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-200">
          <Timer size={12} /> Focus Mode
        </p>
        <div className="mt-2">
          <PomodoroTimer compact />
        </div>
      </Card>

      <Card className="border-white/10 bg-white/[0.07] p-3">
        <p className="inline-flex items-center gap-1 text-xs font-semibold text-slate-300">
          <CheckCircle2 size={12} /> Tasks
        </p>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          <Badge className="text-xs border border-rose-300/20 bg-rose-500/20 text-rose-100">CS HW</Badge>
          <Badge className="text-xs border border-amber-300/20 bg-amber-500/20 text-amber-100">Eco Rev</Badge>
          <Badge className="text-xs border border-emerald-300/20 bg-emerald-500/20 text-emerald-100">BST Notes</Badge>
        </div>
      </Card>

      <Card className="border-white/10 bg-white/[0.07] p-3">
        <p className="inline-flex items-center gap-1 text-xs font-semibold text-slate-300">
          <Target size={12} /> Goals
        </p>
        <p className="mt-1.5 text-xs text-slate-200">
          Complete 5 chapters, 3 revisions, and 2 tests.
        </p>
        <div className="mt-2 h-1.5 rounded-full bg-slate-800">
          <div className="h-1.5 w-[72%] rounded-full bg-gradient-to-r from-cyan-400 to-violet-400" />
        </div>
      </Card>

      <Card className="border-white/10 bg-white/[0.07] p-3">
        <p className="inline-flex items-center gap-1 text-xs font-semibold text-slate-300">
          <Bot size={12} /> AI Tips
        </p>
        <div className="mt-1.5 space-y-1 text-xs text-slate-200">
          {suggestions.slice(0, 2).map((item) => (
            <p key={item}>• {item}</p>
          ))}
        </div>
      </Card>
    </div>
  );
}


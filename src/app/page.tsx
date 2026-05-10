"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  BrainCircuit,
  CalendarClock,
  CheckCircle2,
  Sparkles,
  Zap,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProgressRing } from "@/components/ui/progress-ring";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const bentoItems = [
  {
    title: "Smart Analytics Engine",
    text: "Productivity score, trend insights, and adaptive study suggestions powered by your daily data.",
    icon: BarChart3,
    span: "md:col-span-2",
  },
  {
    title: "Revision Intelligence",
    text: "Spaced repetition cycles with priority reminders and weakness recovery loops.",
    icon: BrainCircuit,
    span: "",
  },
  {
    title: "Goal-to-Execution Flow",
    text: "Weekly challenge layers, streak logic, and measurable milestones for year-long consistency.",
    icon: Zap,
    span: "",
  },
  {
    title: "Academic OS for Commerce",
    text: "Accountancy, BST, Economics, English, and CS tracked in one premium command center.",
    icon: CalendarClock,
    span: "md:col-span-2",
  },
];

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050914] text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.18),transparent_40%),radial-gradient(circle_at_78%_18%,rgba(167,139,250,0.18),transparent_36%),radial-gradient(circle_at_50%_80%,rgba(6,182,212,0.12),transparent_38%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.08)_1px,transparent_1px)] bg-[size:40px_40px]" />
      <div className="landing-noise pointer-events-none absolute inset-0 opacity-35" />
      <div className="absolute -left-24 top-28 h-72 w-72 rounded-full bg-cyan-400/25 blur-[120px]" />
      <div className="absolute right-8 top-14 h-64 w-64 rounded-full bg-violet-500/20 blur-[110px]" />

      <main className="relative mx-auto max-w-7xl px-4 pb-20 pt-8 md:px-8 md:pt-10">
        <motion.header
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.45 }}
          className="mb-12 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 shadow-2xl shadow-cyan-900/20 backdrop-blur-xl md:px-5"
        >
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">PW UDAY 2027</p>
            <p className="text-sm font-semibold text-slate-200">Commerce OS</p>
          </div>
          <Link href="/dashboard" className="text-sm text-cyan-300 transition hover:text-cyan-200">
            Open Dashboard
          </Link>
        </motion.header>

        <section className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ duration: 0.5, delay: 0.08 }}
          >
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-cyan-200 backdrop-blur">
              <Sparkles size={14} /> Next-gen Academic Productivity Platform
            </p>
            <h1 className="max-w-2xl text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Build elite study consistency with{" "}
              <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-violet-300 bg-clip-text text-transparent">
                intelligent planning
              </span>{" "}
              and real-time academic analytics.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
              A premium student workspace for Class 11 CBSE Commerce — unify daily logs,
              revision cycles, tests, backlogs, attendance, and goals in one futuristic dashboard.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link href="/daily-log">
                <Button
                  size="lg"
                  className="rounded-full bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-500 px-6 shadow-xl shadow-blue-900/35 hover:scale-[1.02] hover:shadow-cyan-500/25"
                >
                  Start Tracking <ArrowRight size={16} className="ml-2" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button
                  variant="secondary"
                  size="lg"
                  className="rounded-full border-white/20 bg-white/10 px-6 text-slate-100 hover:bg-white/15"
                >
                  Open Dashboard
                </Button>
              </Link>
            </div>
            <div className="mt-7 grid max-w-xl grid-cols-3 gap-3">
              {[
                { label: "Active Streak", value: "14d" },
                { label: "Revision Rate", value: "81%" },
                { label: "Student Focus", value: "92%" },
              ].map((stat) => (
                <Card
                  key={stat.label}
                  className="border-white/10 bg-white/5 p-3 text-center shadow-lg shadow-slate-950/40"
                >
                  <p className="text-lg font-semibold text-white">{stat.value}</p>
                  <p className="text-xs text-slate-400">{stat.label}</p>
                </Card>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ duration: 0.5, delay: 0.18 }}
            className="relative"
          >
            <motion.div
              className="absolute -right-4 -top-8 rounded-xl border border-cyan-300/25 bg-cyan-400/10 px-3 py-2 text-xs text-cyan-100 backdrop-blur"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              +2.4h focus today
            </motion.div>
            <motion.div
              className="absolute -bottom-6 -left-5 rounded-xl border border-violet-300/20 bg-violet-400/10 px-3 py-2 text-xs text-violet-100 backdrop-blur"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              Revision reminder due
            </motion.div>

            <Card className="relative overflow-hidden rounded-3xl border-white/15 bg-white/[0.07] p-5 shadow-2xl shadow-cyan-950/40 backdrop-blur-2xl">
              <div className="absolute -left-16 top-0 h-32 w-32 rounded-full bg-cyan-400/25 blur-3xl" />
              <div className="absolute -right-10 bottom-0 h-36 w-36 rounded-full bg-violet-500/25 blur-3xl" />
              <div className="relative">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-400">Live Academic Dashboard</p>
                    <p className="text-sm font-semibold text-white">Today’s Performance</p>
                  </div>
                  <span className="rounded-full border border-white/15 bg-white/10 px-2 py-1 text-[11px] text-cyan-200">
                    Synced
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Card className="border-white/10 bg-white/[0.08] p-3">
                    <p className="text-xs text-slate-400">Productivity</p>
                    <p className="mt-1 text-xl font-semibold text-white">88%</p>
                  </Card>
                  <Card className="border-white/10 bg-white/[0.08] p-3">
                    <p className="text-xs text-slate-400">Study Streak</p>
                    <p className="mt-1 text-xl font-semibold text-white">14 days</p>
                  </Card>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <Card className="flex items-center justify-center border-white/10 bg-white/[0.08] p-3">
                    <ProgressRing value={74} label="Revision" size={96} />
                  </Card>
                  <Card className="border-white/10 bg-white/[0.08] p-3">
                    <p className="mb-2 text-xs text-slate-400">Consistency</p>
                    <div className="flex h-20 items-end gap-1.5">
                      {[34, 52, 40, 70, 58, 76, 64].map((height, index) => (
                        <div
                          key={index}
                          className="w-3 rounded-t-md bg-gradient-to-t from-cyan-400/80 to-violet-400/80"
                          style={{ height }}
                        />
                      ))}
                    </div>
                  </Card>
                </div>

                <Card className="mt-4 border-white/10 bg-white/[0.08] p-3">
                  <p className="text-xs text-slate-400">Productivity Heatmap</p>
                  <div className="mt-2 grid grid-cols-7 gap-1">
                    {[2, 1, 3, 4, 2, 4, 3, 3, 2, 4, 1, 4, 3, 2].map((value, i) => (
                      <div
                        key={i}
                        className="h-4 rounded-sm"
                        style={{
                          background:
                            value === 1
                              ? "rgba(34,211,238,0.25)"
                              : value === 2
                                ? "rgba(59,130,246,0.38)"
                                : value === 3
                                  ? "rgba(139,92,246,0.45)"
                                  : "rgba(6,182,212,0.65)",
                        }}
                      />
                    ))}
                  </div>
                </Card>
              </div>
            </Card>
          </motion.div>
        </section>

        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
          transition={{ duration: 0.45 }}
          className="mt-20"
        >
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-cyan-300/90">Feature Stack</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white md:text-4xl">
                Built as a high-performance student SaaS workspace
              </h2>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {bentoItems.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
              >
                <Card
                  className={`group h-full border-white/10 bg-white/[0.06] p-5 shadow-xl shadow-slate-950/40 transition hover:-translate-y-1 hover:border-cyan-300/30 hover:bg-white/[0.1] ${item.span}`}
                >
                  <div className="mb-3 inline-flex rounded-xl border border-cyan-300/25 bg-cyan-400/10 p-2 text-cyan-200">
                    <item.icon size={18} />
                  </div>
                  <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{item.text}</p>
                  <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-800/90">
                    <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-cyan-400 to-violet-400 transition-all group-hover:w-[92%]" />
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45 }}
          className="mt-20"
        >
          <Card className="overflow-hidden rounded-3xl border-white/10 bg-white/[0.06] p-6 shadow-2xl shadow-cyan-950/25">
            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-violet-300">Dashboard Preview</p>
                <h3 className="mt-2 text-2xl font-semibold text-white">
                  Real-time visibility into study quality, not just study quantity.
                </h3>
                <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">
                  Track streak momentum, attendance confidence, revision coverage, chapter velocity,
                  and weekly consistency in one clear interface.
                </p>
                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    "Study Hours",
                    "Attendance",
                    "Backlog Burn",
                    "Test Readiness",
                  ].map((item) => (
                    <div key={item} className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-xs text-slate-300">
                      <CheckCircle2 size={12} className="mb-1 text-cyan-300" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="mb-3 text-xs text-slate-400">Weekly Consistency</p>
                <div className="space-y-2">
                  {[
                    { day: "Mon", score: 68 },
                    { day: "Tue", score: 74 },
                    { day: "Wed", score: 62 },
                    { day: "Thu", score: 84 },
                    { day: "Fri", score: 71 },
                  ].map((item) => (
                    <div key={item.day} className="flex items-center gap-2">
                      <span className="w-8 text-xs text-slate-400">{item.day}</span>
                      <div className="h-2 flex-1 rounded-full bg-slate-800">
                        <motion.div
                          className="h-2 rounded-full bg-gradient-to-r from-cyan-400 to-violet-400"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${item.score}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: 0.1 }}
                        />
                      </div>
                      <span className="w-8 text-right text-xs text-slate-300">{item.score}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </motion.section>

        <footer className="mt-20 border-t border-white/10 py-6 text-sm text-slate-400">
          Commerce OS • PW UDAY 2027 • Premium academic intelligence platform
        </footer>
      </main>
    </div>
  );
}

"use client";

import Link from "next/link";
import { Bell, Command, Search, Sparkles, UserCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

export function Navbar({ title }: { title: string }) {
  return (
    <header className="sticky top-0 z-30 px-4 pt-4 md:px-6 md:pt-6">
      <div className="rounded-2xl border border-white/10 bg-white/[0.07] px-4 py-3 shadow-xl shadow-slate-950/40 backdrop-blur-2xl md:px-5">
        <div className="flex items-center gap-3">
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">Commerce workflow</p>
            <h1 className="truncate text-lg font-semibold text-white md:text-xl">{title}</h1>
          </div>
          <div className="ml-auto hidden max-w-sm flex-1 xl:block">
            <div className="relative">
              <Search
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <Input
                placeholder="Search chapters, logs, tests..."
                className="h-10 rounded-xl border-white/10 bg-black/30 pl-9 text-slate-100 placeholder:text-slate-500 focus:ring-cyan-400/50"
              />
            </div>
          </div>
          <div className="hidden items-center gap-2 md:flex">
            <span className="rounded-full border border-cyan-300/20 bg-cyan-400/10 px-2.5 py-1 text-[11px] font-medium text-cyan-200">
              Productivity 88%
            </span>
            <span className="rounded-full border border-violet-300/20 bg-violet-400/10 px-2.5 py-1 text-[11px] font-medium text-violet-200">
              Streak 14d
            </span>
          </div>
          <Button
            variant="secondary"
            size="sm"
            className="hidden h-9 rounded-xl border-white/10 bg-black/30 text-slate-200 hover:bg-black/40 md:inline-flex"
          >
            <Command size={13} className="mr-1" />
            Command
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="h-9 rounded-xl border-white/10 bg-black/30 text-slate-200 hover:bg-black/40"
          >
            <Bell size={14} />
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="hidden h-9 rounded-xl border-white/10 bg-black/30 text-slate-200 hover:bg-black/40 sm:inline-flex"
          >
            <Sparkles size={14} className="mr-1 text-cyan-300" />
            AI
          </Button>
          <ThemeToggle />
          <Link
            href="/"
            className="hidden items-center rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-xs font-medium text-slate-200 transition hover:bg-black/40 md:inline-flex"
          >
            Home
          </Link>
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-black/30 text-slate-300 transition hover:bg-black/40"
            aria-label="Profile menu"
          >
            <UserCircle2 size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}


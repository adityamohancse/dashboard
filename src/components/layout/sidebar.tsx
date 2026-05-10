"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { type ComponentType, useState } from "react";
import { NAV_ITEMS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  BookOpenText,
  CalendarRange,
  FileCheck2,
  Home,
  LayoutDashboard,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  RefreshCcw,
  Target,
  UserCheck,
  Zap,
} from "lucide-react";

const iconMap: Record<string, ComponentType<{ size?: number; className?: string }>> = {
  Home,
  Dashboard: LayoutDashboard,
  "Daily Log": FileCheck2,
  Subjects: BookOpenText,
  "Monthly Progress": CalendarRange,
  Tests: FileCheck2,
  Backlogs: AlertCircle,
  Revision: RefreshCcw,
  Goals: Target,
  Attendance: UserCheck,
};

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      animate={{ width: collapsed ? 88 : 248 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="m-4 hidden shrink-0 rounded-3xl border border-white/10 bg-white/[0.06] p-3 shadow-2xl shadow-cyan-950/20 backdrop-blur-2xl lg:flex lg:flex-col"
    >
      <div className="mb-2 flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.06] px-3 py-2">
        {!collapsed && (
          <div>
            <p className="text-[10px] uppercase tracking-[0.16em] text-slate-400">PW UDAY 2027</p>
            <p className="text-sm font-semibold text-slate-100">Commerce OS</p>
          </div>
        )}
        <button
          type="button"
          onClick={() => setCollapsed((value) => !value)}
          className="rounded-lg border border-white/10 bg-white/[0.08] p-1.5 text-slate-300 transition hover:bg-white/[0.14]"
          aria-label="Toggle sidebar"
        >
          {collapsed ? <PanelLeftOpen size={14} /> : <PanelLeftClose size={14} />}
        </button>
      </div>

      {!collapsed && (
        <div className="mb-3 rounded-2xl border border-cyan-300/15 bg-gradient-to-br from-cyan-500/10 to-violet-500/10 p-3">
          <p className="text-[11px] text-slate-300">Current Study Streak</p>
          <p className="mt-1 text-xl font-semibold text-cyan-200">14 days</p>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-slate-400">
            <Zap size={12} className="text-cyan-300" />
            Productivity momentum is strong
          </div>
        </div>
      )}

      <nav className="space-y-1.5">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          const Icon = iconMap[item.label] ?? LayoutDashboard;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm transition",
                active
                  ? "bg-gradient-to-r from-cyan-400/90 via-blue-500/80 to-violet-500/90 text-white shadow-lg shadow-cyan-900/40"
                  : "text-slate-300 hover:bg-white/[0.09] hover:text-white",
                collapsed && "justify-center px-2",
              )}
            >
              {active ? <span className="absolute left-1 top-2 h-6 w-1 rounded-full bg-white/70" /> : null}
              <Icon size={16} className={cn("shrink-0", active ? "text-white" : "text-slate-400")} />
              {!collapsed ? <span className="truncate">{item.label}</span> : null}
            </Link>
          );
        })}
      </nav>

      {!collapsed && (
        <>
          <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.05] p-3">
            <p className="text-[11px] uppercase tracking-[0.15em] text-slate-400">Quick Actions</p>
            <button
              type="button"
              className="mt-2 flex w-full items-center gap-2 rounded-xl border border-white/10 bg-white/[0.08] px-3 py-2 text-xs text-slate-200 transition hover:bg-white/[0.14]"
            >
              <Plus size={13} />
              Add study entry
            </button>
          </div>

          <div className="mt-auto rounded-2xl border border-white/10 bg-black/25 p-3">
            <p className="text-xs text-slate-400">Student Profile</p>
            <p className="mt-1 text-sm font-medium text-slate-100">Class 11 Commerce</p>
            <p className="text-[11px] text-slate-400">PW UDAY 2027 Batch</p>
          </div>
        </>
      )}
    </motion.aside>
  );
}


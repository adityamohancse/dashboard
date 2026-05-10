"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ComponentType } from "react";
import { NAV_ITEMS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { CalendarRange, FileCheck2, Home, LayoutDashboard, UserCheck } from "lucide-react";

const MOBILE_ITEMS = NAV_ITEMS.slice(0, 5);
const iconMap: Record<string, ComponentType<{ size?: number; className?: string }>> = {
  Home,
  Dashboard: LayoutDashboard,
  "Daily Log": FileCheck2,
  Subjects: CalendarRange,
  "Monthly Progress": UserCheck,
};

export function MobileNav() {
  const pathname = usePathname();
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-[#070d1c]/95 px-3 py-2 backdrop-blur-2xl lg:hidden">
      <div className="grid grid-cols-5 gap-1">
        {MOBILE_ITEMS.map((item) => {
          const Icon = iconMap[item.label] ?? LayoutDashboard;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 rounded-lg px-2 py-2 text-center text-[11px] font-medium transition",
                pathname === item.href
                  ? "bg-gradient-to-r from-cyan-400/30 to-violet-500/30 text-white"
                  : "text-slate-400",
              )}
            >
              <Icon size={14} />
              {item.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}


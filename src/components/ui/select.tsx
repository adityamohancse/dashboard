import * as React from "react";
import { cn } from "@/lib/utils";

export function Select({
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "h-10 w-full rounded-xl border border-slate-200 bg-white/70 px-3 text-sm text-slate-700 outline-none ring-sky-200 transition focus:ring-2 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100",
        className,
        "[appearance:none] bg-[right_0.75rem_center] bg-no-repeat pr-8",
      )}
      {...props}
    >
      {children}
    </select>
  );
}


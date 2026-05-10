import * as React from "react";
import { cn } from "@/lib/utils";

export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/60 bg-white/70 p-4 shadow-md shadow-slate-200/50 backdrop-blur-xl dark:border-slate-700/70 dark:bg-slate-900/70 dark:shadow-slate-900/20",
        className,
      )}
      {...props}
    />
  );
}


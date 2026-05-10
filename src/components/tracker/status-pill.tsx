import { CompletionStatus } from "@/lib/types";
import { cn } from "@/lib/utils";
import { AlertTriangle, CheckCircle2, CircleDashed } from "lucide-react";

const map: Record<CompletionStatus, string> = {
  Completed:
    "border border-emerald-300/35 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 text-emerald-200",
  Partial:
    "border border-amber-300/35 bg-gradient-to-r from-amber-400/20 to-yellow-400/20 text-amber-200",
  Pending:
    "border border-rose-300/35 bg-gradient-to-r from-rose-400/20 to-red-400/20 text-rose-200",
};

const iconMap = {
  Completed: CheckCircle2,
  Partial: CircleDashed,
  Pending: AlertTriangle,
} as const;

export function StatusPill({ status }: { status: CompletionStatus }) {
  const Icon = iconMap[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
        map[status],
      )}
    >
      <Icon size={11} />
      {status}
    </span>
  );
}


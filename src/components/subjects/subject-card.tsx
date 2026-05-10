import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { SubjectMeta } from "@/lib/types";
import { ProgressRing } from "@/components/ui/progress-ring";

export function SubjectCard({
  subject,
  progress,
  completed,
  pending,
}: {
  subject: SubjectMeta;
  progress: number;
  completed: number;
  pending: number;
}) {
  return (
    <Card className={`bg-gradient-to-br ${subject.gradient}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-600">{subject.faculty}</p>
          <h3 className="text-lg font-bold text-slate-800">{subject.name}</h3>
        </div>
        <ProgressRing value={progress} label="Progress" size={82} />
      </div>
      <div className="mt-3 flex items-center justify-between text-sm text-slate-700">
        <p>Completed: {completed}</p>
        <p>Pending: {pending}</p>
      </div>
      <Link
        href={`/subjects/${subject.key}`}
        className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white/80 px-3 py-2 text-sm font-semibold text-slate-700"
      >
        Open tracker <ArrowRight size={14} />
      </Link>
    </Card>
  );
}


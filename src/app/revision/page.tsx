import { AppShell } from "@/components/layout/app-shell";
import { RevisionCalendar } from "@/components/revision/revision-calendar";

export default function RevisionPage() {
  return (
    <AppShell title="Revision Management System">
      <RevisionCalendar />
    </AppShell>
  );
}


import { AppShell } from "@/components/layout/app-shell";
import { BacklogTable } from "@/components/tracker/backlog-table";

export default function BacklogsPage() {
  return (
    <AppShell title="Backlog Tracker">
      <BacklogTable />
    </AppShell>
  );
}


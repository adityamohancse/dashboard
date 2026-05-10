import { AppShell } from "@/components/layout/app-shell";
import { TestPerformanceTable } from "@/components/tracker/test-performance-table";

export default function TestPerformancePage() {
  return (
    <AppShell title="Test Performance Tracker">
      <TestPerformanceTable />
    </AppShell>
  );
}


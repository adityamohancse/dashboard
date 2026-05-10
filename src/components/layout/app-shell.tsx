import { Navbar } from "./navbar";
import { Sidebar } from "./sidebar";
import { MobileNav } from "./mobile-nav";

export function AppShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050a16] text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,rgba(34,211,238,0.18),transparent_38%),radial-gradient(circle_at_84%_12%,rgba(139,92,246,0.18),transparent_35%),radial-gradient(circle_at_50%_86%,rgba(59,130,246,0.14),transparent_42%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.06)_1px,transparent_1px)] bg-[size:38px_38px]" />
      <div className="landing-noise pointer-events-none absolute inset-0 opacity-25" />
      <div className="pointer-events-none absolute -left-16 top-24 h-64 w-64 rounded-full bg-cyan-500/20 blur-[110px]" />
      <div className="pointer-events-none absolute -right-20 top-20 h-72 w-72 rounded-full bg-violet-500/20 blur-[120px]" />

      <div className="relative z-10 flex min-h-screen">
        <Sidebar />
        <div className="flex min-h-screen flex-1 flex-col">
          <Navbar title={title} />
          <main className="flex-1 p-4 pb-24 md:p-6 md:pb-24 lg:p-7">{children}</main>
        </div>
      </div>
      <MobileNav />
    </div>
  );
}


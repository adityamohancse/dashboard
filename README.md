# Commerce OS (PW UDAY 2027)

Premium academic productivity website for **Class 11 CBSE Commerce** students.

## Stack

- Next.js + React + TypeScript + Tailwind CSS
- Framer Motion + Recharts
- ShadCN-style reusable UI primitives
- Node.js + Express backend scaffold
- PostgreSQL/Supabase schema planning (Prisma + SQL)
- Export reports with PDF/Excel

## Core Features

- Landing page with SaaS-style hero, feature sections, and CTA
- Main dashboard with:
  - Animated stat cards
  - Circular progress rings
  - Weekly consistency chart
  - Productivity heatmap
  - Smart widgets (quote, reminders, pending tasks, goals, suggestions, pomodoro)
- Daily log tracker:
  - Editable entries, add/delete
  - Search + subject filters
  - Sticky table header + pagination
  - Subject color coding
  - Auto-save with localStorage
  - Export to PDF/Excel
- Subject-wise tracker:
  - Accountancy
  - Business Studies
  - Economics
  - English Core
  - Computer Science
- Monthly progress, test tracker, backlog tracker
- Revision management (calendar, reminders, streak)
- Attendance tracker + goal tracker + badges/challenges
- Responsive UI (desktop/tablet/mobile bottom navigation)
- Dark mode + light mode

## Project Structure

```text
src/
  app/
    dashboard/
    daily-log/
    subjects/
    monthly-progress/
    test-performance/
    backlogs/
    revision/
    goals/
    attendance/
  components/
    layout/
    dashboard/
    tracker/
    subjects/
    revision/
    productivity/
    ui/
  lib/
    analytics.ts
    constants.ts
    export.ts
    mock-data.ts
    storage.ts
    types.ts
server/
  src/
    routes/
prisma/
  schema.prisma
db/
  schema.sql
```

## Run

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Backend Scaffold

```bash
npm run server:dev
```

Server runs on `http://localhost:4000` with:
- `GET /health`
- `GET /api/dashboard-summary`

## Database Planning

- Prisma models: `User`, `Subject`, `DailyLog`, `Test`, `Revision`, `Attendance`, `Backlog`, `Goal`, `ProductivityAnalytics`
- SQL blueprint: `db/schema.sql` for Supabase/PostgreSQL provisioning

## Authentication Notes

Planned integration:
- Email login
- Google OAuth
- Recommended: Supabase Auth or NextAuth

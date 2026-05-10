-- Supabase/PostgreSQL schema blueprint
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  full_name text not null,
  batch text default 'PW UDAY 2027',
  created_at timestamptz default now()
);

create table if not exists subjects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  name text not null,
  faculty text,
  total_chapters int default 0,
  completed int default 0,
  pending int default 0,
  revision_percent int default 0
);

create table if not exists daily_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  date date not null,
  day text not null,
  subject text not null,
  chapter_topic text not null,
  lecture_type text not null,
  faculty_name text,
  notes_completed text not null,
  questions_practiced int default 0,
  homework_done text not null,
  revision_status text not null,
  doubts text,
  assignment_test text,
  study_hours numeric(4,1) default 0,
  remarks text
);

create table if not exists tests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  date date not null,
  subject text not null,
  test_name text not null,
  marks_obtained int not null,
  total_marks int not null,
  percentage numeric(5,2) generated always as (
    case when total_marks > 0 then marks_obtained * 100.0 / total_marks else 0 end
  ) stored,
  mistakes_to_improve text,
  revision_required text not null
);

create table if not exists revisions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  date date not null,
  subject text not null,
  topic text not null,
  stage text not null,
  status text not null
);

create table if not exists attendance (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  date date not null,
  status text not null
);

create table if not exists backlogs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  subject text not null,
  pending_topic text not null,
  reason text,
  priority text not null,
  deadline date not null,
  status text not null
);

create table if not exists goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  title text not null,
  category text not null,
  target_date date not null,
  progress int default 0
);

create table if not exists productivity_analytics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  week_start_date date not null,
  total_study_hours numeric(5,1) default 0,
  productivity_score int default 0,
  revision_completion int default 0,
  attendance_percent int default 0,
  tests_attempted int default 0,
  study_streak int default 0
);


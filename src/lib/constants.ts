import { SubjectMeta, SubjectKey } from "./types";

export const SUBJECTS: SubjectMeta[] = [
  {
    key: "accountancy",
    name: "Accountancy",
    faculty: "CA Raghav Sir",
    color: "bg-sky-100 text-sky-800",
    gradient: "from-sky-200 to-blue-100",
  },
  {
    key: "business-studies",
    name: "Business Studies",
    faculty: "Aditi Ma'am",
    color: "bg-violet-100 text-violet-800",
    gradient: "from-violet-200 to-indigo-100",
  },
  {
    key: "economics",
    name: "Economics",
    faculty: "Ankit Sir",
    color: "bg-emerald-100 text-emerald-800",
    gradient: "from-emerald-200 to-teal-100",
  },
  {
    key: "english-core",
    name: "English Core",
    faculty: "Ria Ma'am",
    color: "bg-amber-100 text-amber-800",
    gradient: "from-amber-200 to-yellow-100",
  },
  {
    key: "computer-science",
    name: "Computer Science",
    faculty: "Rohit Sir",
    color: "bg-rose-100 text-rose-800",
    gradient: "from-rose-200 to-orange-100",
  },
  {
    key: "applied-math",
    name: "Applied Math",
    faculty: "Nitin Sir",
    color: "bg-indigo-100 text-indigo-800",
    gradient: "from-indigo-200 to-blue-100",
  },
];

export const SUBJECT_MAP: Record<SubjectKey, SubjectMeta> = SUBJECTS.reduce(
  (acc, subject) => {
    acc[subject.key] = subject;
    return acc;
  },
  {} as Record<SubjectKey, SubjectMeta>,
);

export const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/daily-log", label: "Daily Log" },
  { href: "/subjects", label: "Subjects" },
  { href: "/monthly-progress", label: "Monthly Progress" },
  { href: "/test-performance", label: "Tests" },
  { href: "/backlogs", label: "Backlogs" },
  { href: "/revision", label: "Revision" },
  { href: "/goals", label: "Goals" },
  { href: "/attendance", label: "Attendance" },
];


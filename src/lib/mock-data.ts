import {
  AttendanceEntry,
  BacklogEntry,
  DailyLog,
  Goal,
  RevisionEntry,
  TestEntry,
} from "./types";

export const defaultDailyLogs: DailyLog[] = [
  {
    id: "d1",
    date: "2026-05-08",
    day: "Friday",
    subject: "accountancy",
    chapterTopic: "Journal Entries & Ledger",
    lectureType: "Live",
    facultyName: "CA Raghav Sir",
    notesCompleted: "Completed",
    questionsPracticed: 42,
    homeworkDone: "Completed",
    revisionStatus: "Partial",
    doubts: "Depreciation adjustment",
    assignmentTest: "Worksheet 5",
    studyHours: 3.5,
    remarks: "Strong progress",
  },
  {
    id: "d2",
    date: "2026-05-08",
    day: "Friday",
    subject: "economics",
    chapterTopic: "Demand Elasticity",
    lectureType: "Recorded",
    facultyName: "Ankit Sir",
    notesCompleted: "Partial",
    questionsPracticed: 24,
    homeworkDone: "Pending",
    revisionStatus: "Pending",
    doubts: "Cross elasticity numericals",
    assignmentTest: "Quiz 3",
    studyHours: 2,
    remarks: "Need revision",
  },
];

export const defaultTests: TestEntry[] = [
  {
    id: "t1",
    date: "2026-05-01",
    subject: "business-studies",
    testName: "Nature & Significance of Management",
    marksObtained: 34,
    totalMarks: 40,
    mistakesToImprove: "Case study structure",
    revisionRequired: "Partial",
  },
  {
    id: "t2",
    date: "2026-05-04",
    subject: "accountancy",
    testName: "Rectification of Errors",
    marksObtained: 19,
    totalMarks: 40,
    mistakesToImprove: "Error classification",
    revisionRequired: "Completed",
  },
];

export const defaultBacklogs: BacklogEntry[] = [
  {
    id: "b1",
    subject: "english-core",
    pendingTopic: "Poem: A Photograph analysis",
    reason: "Late class recording",
    priority: "Medium",
    deadline: "2026-05-12",
    status: "Partial",
  },
  {
    id: "b2",
    subject: "computer-science",
    pendingTopic: "Python loops practice",
    reason: "Skipped practice set",
    priority: "High",
    deadline: "2026-05-10",
    status: "Pending",
  },
];

export const defaultRevisions: RevisionEntry[] = [
  {
    id: "r1",
    date: "2026-05-09",
    subject: "accountancy",
    topic: "Bills of Exchange",
    stage: "Day 1",
    status: "Completed",
  },
  {
    id: "r2",
    date: "2026-05-10",
    subject: "economics",
    topic: "Consumer Equilibrium",
    stage: "Day 3",
    status: "Pending",
  },
];

export const defaultAttendance: AttendanceEntry[] = [
  { id: "a1", date: "2026-05-05", status: "Present" },
  { id: "a2", date: "2026-05-06", status: "Present" },
  { id: "a3", date: "2026-05-07", status: "Absent" },
  { id: "a4", date: "2026-05-08", status: "Present" },
];

export const defaultGoals: Goal[] = [
  {
    id: "g1",
    title: "Complete 70% Accountancy syllabus by July",
    targetDate: "2026-07-25",
    progress: 48,
    category: "Academic",
  },
  {
    id: "g2",
    title: "Maintain 14-day revision streak",
    targetDate: "2026-06-01",
    progress: 64,
    category: "Revision",
  },
  {
    id: "g3",
    title: "Daily study consistency above 6 hours",
    targetDate: "2026-06-15",
    progress: 58,
    category: "Consistency",
  },
];

export const motivationQuotes = [
  "Discipline beats motivation. Show up today.",
  "Small daily wins compound into board exam confidence.",
  "Focus on completion, then polish with revision.",
  "Every solved question reduces future stress.",
];


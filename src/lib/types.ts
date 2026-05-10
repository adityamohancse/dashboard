export type SubjectKey =
  | "accountancy"
  | "business-studies"
  | "economics"
  | "english-core"
  | "computer-science"
  | "applied-math";

export type CompletionStatus = "Completed" | "Partial" | "Pending";

export interface SubjectMeta {
  key: SubjectKey;
  name: string;
  faculty: string;
  color: string;
  gradient: string;
}

export interface DailyLog {
  id: string;
  date: string;
  day: string;
  subject: SubjectKey;
  chapterTopic: string;
  lectureType: "Live" | "Recorded" | "Self Study";
  facultyName: string;
  notesCompleted: CompletionStatus;
  questionsPracticed: number;
  homeworkDone: CompletionStatus;
  revisionStatus: CompletionStatus;
  doubts: string;
  assignmentTest: string;
  studyHours: number;
  remarks: string;
}

export interface TestEntry {
  id: string;
  date: string;
  subject: SubjectKey;
  testName: string;
  marksObtained: number;
  totalMarks: number;
  mistakesToImprove: string;
  revisionRequired: CompletionStatus;
}

export interface BacklogEntry {
  id: string;
  subject: SubjectKey;
  pendingTopic: string;
  reason: string;
  priority: "High" | "Medium" | "Low";
  deadline: string;
  status: CompletionStatus;
}

export interface AttendanceEntry {
  id: string;
  date: string;
  status: "Present" | "Absent";
}

export interface RevisionEntry {
  id: string;
  date: string;
  subject: SubjectKey;
  topic: string;
  stage: "Day 1" | "Day 3" | "Day 7" | "Day 14";
  status: CompletionStatus;
}

export interface Goal {
  id: string;
  title: string;
  targetDate: string;
  progress: number;
  category: "Academic" | "Revision" | "Consistency";
}


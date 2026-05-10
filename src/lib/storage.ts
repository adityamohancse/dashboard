import {
  AttendanceEntry,
  BacklogEntry,
  DailyLog,
  Goal,
  RevisionEntry,
  TestEntry,
} from "./types";
import {
  defaultAttendance,
  defaultBacklogs,
  defaultDailyLogs,
  defaultGoals,
  defaultRevisions,
  defaultTests,
} from "./mock-data";
import { useSyncExternalStore } from "react";

type StorageKey =
  | "dailyLogs"
  | "tests"
  | "backlogs"
  | "attendance"
  | "revisions"
  | "goals";
const STORAGE_CHANGE_EVENT = "pw-storage-change";
const STORAGE_CACHE_KEY_PREFIX = "pw-";

const defaults = {
  dailyLogs: defaultDailyLogs,
  tests: defaultTests,
  backlogs: defaultBacklogs,
  attendance: defaultAttendance,
  revisions: defaultRevisions,
  goals: defaultGoals,
};

type SnapshotCacheEntry = {
  raw: string | null;
  value: unknown[];
};

const snapshotCache: Partial<Record<StorageKey, SnapshotCacheEntry>> = {};

export function loadData<T>(key: StorageKey): T[] {
  if (typeof window === "undefined") {
    return defaults[key] as T[];
  }
  const raw = localStorage.getItem(`${STORAGE_CACHE_KEY_PREFIX}${key}`);
  if (!raw) return defaults[key] as T[];
  try {
    return JSON.parse(raw) as T[];
  } catch {
    return defaults[key] as T[];
  }
}

export function saveData<T>(key: StorageKey, value: T[]) {
  if (typeof window === "undefined") return;
  const raw = JSON.stringify(value);
  localStorage.setItem(`${STORAGE_CACHE_KEY_PREFIX}${key}`, raw);
  snapshotCache[key] = { raw, value: value as unknown[] };
  window.dispatchEvent(new CustomEvent<{ key: StorageKey }>(STORAGE_CHANGE_EVENT, { detail: { key } }));
}

function getStorageSnapshot<T>(key: StorageKey): T[] {
  if (typeof window === "undefined") {
    return defaults[key] as T[];
  }

  const raw = localStorage.getItem(`${STORAGE_CACHE_KEY_PREFIX}${key}`);
  const cached = snapshotCache[key] as SnapshotCacheEntry | undefined;
  if (cached && cached.raw === raw) {
    return cached.value as T[];
  }

  const value = loadData<T>(key);
  snapshotCache[key] = { raw, value: value as unknown[] };
  return value;
}

export function subscribeStorage(key: StorageKey, listener: () => void) {
  if (typeof window === "undefined") return () => {};

  const onStorage = (event: StorageEvent) => {
    if (event.key === `${STORAGE_CACHE_KEY_PREFIX}${key}`) {
      listener();
    }
  };

  const onCustomStorageEvent = (event: Event) => {
    const customEvent = event as CustomEvent<{ key: StorageKey }>;
    if (customEvent.detail?.key === key) {
      listener();
    }
  };

  window.addEventListener("storage", onStorage);
  window.addEventListener(STORAGE_CHANGE_EVENT, onCustomStorageEvent);

  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(STORAGE_CHANGE_EVENT, onCustomStorageEvent);
  };
}

export function useStorageData<T>(key: StorageKey): T[] {
  return useSyncExternalStore(
    (listener) => subscribeStorage(key, listener),
    () => getStorageSnapshot<T>(key),
    () => defaults[key] as T[],
  );
}

export type PlatformStore = {
  dailyLogs: DailyLog[];
  tests: TestEntry[];
  backlogs: BacklogEntry[];
  attendance: AttendanceEntry[];
  revisions: RevisionEntry[];
  goals: Goal[];
};


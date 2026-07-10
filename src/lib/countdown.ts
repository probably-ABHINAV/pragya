export const BIRTHDAY = new Date("2026-07-31T00:00:00");

export function diffParts(target: Date, now: Date = new Date()) {
  const ms = Math.max(0, target.getTime() - now.getTime());
  const days = Math.floor(ms / 86400000);
  const hours = Math.floor((ms % 86400000) / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return { days, hours, minutes, seconds, done: ms === 0 };
}

export function daysUntil(dateStr: string, now: Date = new Date()): number {
  const target = new Date(dateStr + "T00:00:00");
  const diff = target.getTime() - now.getTime();
  return Math.ceil(diff / 86400000);
}

export function isUnlocked(dateStr: string, now: Date = new Date()): boolean {
  return daysUntil(dateStr, now) <= 0;
}

export function todayLong(now: Date = new Date()): string {
  return now.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" });
}

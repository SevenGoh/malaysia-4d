import { addDays, format, parse, parseISO } from "date-fns";

export function toIsoDate(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export function parseIsoDate(value: string): Date {
  return parseISO(value);
}

export function formatDisplayDate(iso: string): string {
  const date = parseIsoDate(iso);
  return format(date, "EEE, d MMM yyyy");
}

/** DD/MM/YYYY as used by Damacai */
export function toDamacaiDate(iso: string): string {
  const date = parseIsoDate(iso);
  return format(date, "dd/MM/yyyy");
}

/** Parse DD/MM/YYYY to ISO */
export function fromSlashDate(value: string): string {
  const date = parse(value, "dd/MM/yyyy", new Date());
  return toIsoDate(date);
}

export function isDrawDay(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 3 || day === 6;
}

export function getTodayIso(): string {
  return toIsoDate(new Date());
}

export function shiftIsoDate(iso: string, deltaDays: number): string {
  const date = parseIsoDate(iso);
  return toIsoDate(addDays(date, deltaDays));
}

import { addDays, format, parse, parseISO } from "date-fns";
import { SPECIAL_DRAW_DATES } from "./special-draw-dates";

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

export function isRegularDrawDay(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 3 || day === 6;
}

export function isSpecialDrawDate(date: Date | string): boolean {
  const iso = typeof date === "string" ? date : toIsoDate(date);
  return SPECIAL_DRAW_DATES.has(iso);
}

/** Wed / Sat / Sun plus MOF special-draw Tuesdays (Big 3). */
export function isDrawDay(date: Date): boolean {
  return isRegularDrawDay(date) || isSpecialDrawDate(date);
}

/** Whether an operator has a draw on this date. */
export function isOperatorDrawDay(
  operator: "magnum" | "damacai" | "toto" | "granddragon",
  date: Date
): boolean {
  if (operator === "granddragon") return true;
  return isDrawDay(date);
}

/** Poll when viewing today and any shown operator may still update. */
export function shouldPollToday(isoDate: string): boolean {
  if (isoDate !== getTodayIso()) return false;
  return true;
}

export function getTodayIso(): string {
  return toIsoDate(new Date());
}

export function shiftIsoDate(iso: string, deltaDays: number): string {
  const date = parseIsoDate(iso);
  return toIsoDate(addDays(date, deltaDays));
}

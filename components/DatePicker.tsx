"use client";

import {
  formatDisplayDate,
  isDrawDay,
  isSpecialDrawDate,
  parseIsoDate,
  shiftIsoDate,
} from "@/lib/dates";

type DatePickerProps = {
  date: string;
  onChange: (date: string) => void;
};

export function DatePicker({ date, onChange }: DatePickerProps) {
  const parsed = parseIsoDate(date);
  const special = isSpecialDrawDate(date);
  const bigThreeDraw = isDrawDay(parsed);
  const gdDaily = true;

  return (
    <div className="sticky top-0 z-10 -mx-4 border-b border-zinc-800 bg-zinc-950/90 px-4 py-3 backdrop-blur">
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => onChange(shiftIsoDate(date, -1))}
          className="rounded-lg bg-zinc-800 px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-700"
          aria-label="Previous day"
        >
          ←
        </button>

        <div className="flex flex-1 flex-col items-center gap-1">
          <p className="text-sm font-medium text-white">{formatDisplayDate(date)}</p>
          {special && (
            <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-medium text-amber-300">
              特别开彩 Special Draw
            </span>
          )}
          <p className="text-[10px] text-zinc-500">
            {[
              bigThreeDraw ? "M4D·DMC·ST" : null,
              gdDaily ? "GD 每日" : null,
            ]
              .filter(Boolean)
              .join(" · ") || "无开彩日"}
          </p>
          <input
            type="date"
            value={date}
            onChange={(e) => onChange(e.target.value)}
            className="w-full max-w-[10rem] rounded-lg border border-zinc-700 bg-zinc-900 px-2 py-1 text-center text-xs text-zinc-300"
          />
        </div>

        <button
          type="button"
          onClick={() => onChange(shiftIsoDate(date, 1))}
          className="rounded-lg bg-zinc-800 px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-700"
          aria-label="Next day"
        >
          →
        </button>
      </div>
    </div>
  );
}

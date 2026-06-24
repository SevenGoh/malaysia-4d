"use client";

import { useState } from "react";
import type { DrawResult } from "@/lib/providers/types";
import { OPERATORS } from "@/lib/providers/types";

type ResultCardProps = {
  result: DrawResult;
  selectedDate?: string;
};

function PrizeNumber({ value, size = "lg" }: { value: string; size?: "lg" | "sm" }) {
  const sizeClass =
    size === "lg"
      ? "text-3xl font-bold tracking-widest"
      : "text-sm font-semibold tracking-wide";

  return (
    <span className={`font-mono ${sizeClass} ${value ? "" : "text-zinc-500"}`}>
      {value || "----"}
    </span>
  );
}

export function ResultCard({ result, selectedDate }: ResultCardProps) {
  const [expanded, setExpanded] = useState(false);
  const meta = OPERATORS[result.operator];
  const { prizes } = result;

  return (
    <article
      className={`rounded-2xl border-l-4 bg-zinc-900/60 p-5 shadow-lg backdrop-blur ${meta.accentClass}`}
    >
      <header className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-white">{meta.name}</h2>
          <p className="text-sm text-zinc-400">
            {result.drawId ? `Draw ${result.drawId}` : "Latest draw"}
            {selectedDate && selectedDate !== result.drawDate && (
              <span className="block text-xs text-amber-400/90">
                Results from {result.drawDate}
              </span>
            )}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          {result.stale && (
            <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-xs text-amber-300">
              Cached
            </span>
          )}
          <a
            href={meta.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-zinc-500 hover:text-zinc-300"
          >
            Official site
          </a>
        </div>
      </header>

      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="rounded-xl bg-zinc-800/80 p-3">
          <p className="mb-1 text-xs uppercase text-zinc-500">1st</p>
          <PrizeNumber value={prizes.first} />
        </div>
        <div className="rounded-xl bg-zinc-800/80 p-3">
          <p className="mb-1 text-xs uppercase text-zinc-500">2nd</p>
          <PrizeNumber value={prizes.second} />
        </div>
        <div className="rounded-xl bg-zinc-800/80 p-3">
          <p className="mb-1 text-xs uppercase text-zinc-500">3rd</p>
          <PrizeNumber value={prizes.third} />
        </div>
      </div>

      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="mt-4 w-full rounded-lg border border-zinc-700 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
      >
        {expanded ? "Hide" : "Show"} Special & Consolation ({prizes.specials.length + prizes.consolations.length})
      </button>

      {expanded && (
        <div className="mt-4 space-y-4">
          <div>
            <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-500">
              Special
            </h3>
            <div className="grid grid-cols-5 gap-2">
              {prizes.specials.map((num, i) => (
                <div
                  key={`s-${i}`}
                  className="rounded-lg bg-zinc-800/60 px-2 py-2 text-center"
                >
                  <PrizeNumber value={num} size="sm" />
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-500">
              Consolation
            </h3>
            <div className="grid grid-cols-5 gap-2">
              {prizes.consolations.map((num, i) => (
                <div
                  key={`c-${i}`}
                  className="rounded-lg bg-zinc-800/60 px-2 py-2 text-center"
                >
                  <PrizeNumber value={num} size="sm" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {result.error && (
        <p className="mt-3 text-xs text-amber-400">{result.error}</p>
      )}
    </article>
  );
}

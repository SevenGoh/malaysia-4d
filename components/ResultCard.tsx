"use client";

import { useState } from "react";
import type { NumberHit } from "@/lib/my-numbers";
import { hitsForDisplayedNumber } from "@/lib/my-numbers";
import type { DrawResult } from "@/lib/providers/types";
import { OPERATORS } from "@/lib/providers/types";

type ResultCardProps = {
  result: DrawResult;
  selectedDate?: string;
  hits: NumberHit[];
};

function PrizeNumber({
  value,
  size = "lg",
  hits = [],
}: {
  value: string;
  size?: "lg" | "sm";
  hits?: NumberHit[];
}) {
  const isHit = hits.length > 0;
  const sizeClass =
    size === "lg"
      ? "text-3xl font-bold tracking-widest"
      : "text-sm font-semibold tracking-wide";

  return (
    <div className="relative">
      <span
        className={`font-mono ${sizeClass} ${
          isHit
            ? "text-emerald-300"
            : value
              ? "text-white"
              : "text-zinc-500"
        }`}
      >
        {value || "----"}
      </span>
      {isHit && (
        <div className="mt-1 flex flex-wrap justify-center gap-1">
          {hits.map((hit, i) => (
            <span
              key={`${hit.number}-${hit.tier}-${i}`}
              className="rounded-full bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-medium text-emerald-300"
            >
              中 · {hit.tierLabel}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function prizeCellClass(hits: NumberHit[]): string {
  return hits.length > 0
    ? "rounded-xl bg-emerald-500/15 ring-1 ring-emerald-400/40 p-3"
    : "rounded-xl bg-zinc-800/80 p-3";
}

export function ResultCard({ result, selectedDate, hits }: ResultCardProps) {
  const [expanded, setExpanded] = useState(false);
  const meta = OPERATORS[result.operator];
  const { prizes } = result;
  const cardHits = hits.length;

  return (
    <article
      className={`rounded-2xl border-l-4 bg-zinc-900/60 p-5 shadow-lg backdrop-blur ${meta.accentClass}`}
    >
      <header className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-white">
            {meta.name}
            <span className="ml-2 text-base font-normal text-zinc-400">
              {meta.nameZh}
            </span>
          </h2>
          <p className="text-sm text-zinc-400">
            {result.drawId ? `Draw ${result.drawId}` : "Latest draw"}
            {meta.dailyDraw && (
              <span className="ml-2 text-xs text-emerald-400/90">每日开奖</span>
            )}
            {selectedDate && selectedDate !== result.drawDate && (
              <span className="block text-xs text-amber-400/90">
                Results from {result.drawDate}
              </span>
            )}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          {cardHits > 0 && (
            <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs font-medium text-emerald-300">
              中 {cardHits}
            </span>
          )}
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
        <div className={prizeCellClass(hitsForDisplayedNumber(hits, prizes.first))}>
          <p className="mb-1 text-xs uppercase text-zinc-500">1st 头奖</p>
          <PrizeNumber
            value={prizes.first}
            hits={hitsForDisplayedNumber(hits, prizes.first)}
          />
        </div>
        <div className={prizeCellClass(hitsForDisplayedNumber(hits, prizes.second))}>
          <p className="mb-1 text-xs uppercase text-zinc-500">2nd 二奖</p>
          <PrizeNumber
            value={prizes.second}
            hits={hitsForDisplayedNumber(hits, prizes.second)}
          />
        </div>
        <div className={prizeCellClass(hitsForDisplayedNumber(hits, prizes.third))}>
          <p className="mb-1 text-xs uppercase text-zinc-500">3rd 三奖</p>
          <PrizeNumber
            value={prizes.third}
            hits={hitsForDisplayedNumber(hits, prizes.third)}
          />
        </div>
      </div>

      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="mt-4 w-full rounded-lg border border-zinc-700 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
      >
        {expanded ? "Hide" : "Show"} Special & Consolation (
        {prizes.specials.length + prizes.consolations.length})
      </button>

      {expanded && (
        <div className="mt-4 space-y-4">
          <div>
            <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-500">
              Special 特别奖
            </h3>
            <div className="grid grid-cols-5 gap-2">
              {prizes.specials.map((num, i) => {
                const cellHits = hitsForDisplayedNumber(hits, num);
                return (
                  <div
                    key={`s-${i}`}
                    className={
                      cellHits.length > 0
                        ? "rounded-lg bg-emerald-500/15 px-2 py-2 text-center ring-1 ring-emerald-400/30"
                        : "rounded-lg bg-zinc-800/60 px-2 py-2 text-center"
                    }
                  >
                    <PrizeNumber value={num} size="sm" hits={cellHits} />
                  </div>
                );
              })}
            </div>
          </div>
          <div>
            <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-500">
              Consolation 安慰奖
            </h3>
            <div className="grid grid-cols-5 gap-2">
              {prizes.consolations.map((num, i) => {
                const cellHits = hitsForDisplayedNumber(hits, num);
                return (
                  <div
                    key={`c-${i}`}
                    className={
                      cellHits.length > 0
                        ? "rounded-lg bg-emerald-500/15 px-2 py-2 text-center ring-1 ring-emerald-400/30"
                        : "rounded-lg bg-zinc-800/60 px-2 py-2 text-center"
                    }
                  >
                    <PrizeNumber value={num} size="sm" hits={cellHits} />
                  </div>
                );
              })}
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

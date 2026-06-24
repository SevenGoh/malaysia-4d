"use client";

import { useCallback, useEffect, useState } from "react";
import { DatePicker } from "./DatePicker";
import { OperatorTabs } from "./OperatorTabs";
import { ResultCard } from "./ResultCard";
import { getTodayIso, isDrawDay, parseIsoDate } from "@/lib/dates";
import type { DrawResult, OperatorId } from "@/lib/providers/types";

const OPERATOR_ORDER: OperatorId[] = ["magnum", "damacai", "toto"];

export function ResultsDashboard({ initialDate }: { initialDate?: string }) {
  const [date, setDate] = useState(initialDate ?? getTodayIso());
  const [operator, setOperator] = useState<OperatorId | "all">("all");
  const [results, setResults] = useState<DrawResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadResults = useCallback(
    async (opts?: { refresh?: boolean }) => {
      setError(null);
      if (opts?.refresh) setRefreshing(true);
      else setLoading(true);

      try {
        const params = new URLSearchParams({ date });
        if (opts?.refresh) params.set("refresh", "true");
        if (operator !== "all") params.set("operator", operator);

        const response = await fetch(`/api/results?${params}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error ?? "Failed to load results");
        }

        const sorted = (data.results as DrawResult[]).sort(
          (a, b) =>
            OPERATOR_ORDER.indexOf(a.operator) - OPERATOR_ORDER.indexOf(b.operator)
        );
        setResults(sorted);
      } catch (err) {
        setError(String(err));
        setResults([]);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [date, operator]
  );

  useEffect(() => {
    loadResults();
  }, [loadResults]);

  useEffect(() => {
    const isToday = date === getTodayIso();
    const shouldPoll = isToday && isDrawDay(parseIsoDate(date));

    if (!shouldPoll) return;

    const interval = setInterval(() => {
      loadResults({ refresh: true });
    }, 60_000);

    return () => clearInterval(interval);
  }, [date, loadResults]);

  const visible =
    operator === "all"
      ? results
      : results.filter((r) => r.operator === operator);

  return (
    <div className="space-y-4">
      <DatePicker date={date} onChange={setDate} />

      <div className="flex items-center justify-between gap-3">
        <OperatorTabs selected={operator} onChange={setOperator} />
        <button
          type="button"
          onClick={() => loadResults({ refresh: true })}
          disabled={refreshing}
          className="shrink-0 rounded-lg bg-amber-500 px-3 py-2 text-sm font-medium text-zinc-900 hover:bg-amber-400 disabled:opacity-50"
        >
          {refreshing ? "…" : "Refresh"}
        </button>
      </div>

      {loading && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-8 text-center text-zinc-400">
          Loading results…
        </div>
      )}

      {error && !loading && (
        <div className="rounded-xl border border-red-900/50 bg-red-950/30 p-4 text-sm text-red-300">
          {error}
        </div>
      )}

      {!loading && !error && visible.length === 0 && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-8 text-center text-zinc-400">
          No results for this date. Draws run Wed, Sat & Sun — try another date or
          tap Refresh.
        </div>
      )}

      <div className="grid gap-4">
        {visible.map((result) => (
          <ResultCard
            key={`${result.operator}-${result.drawDate}`}
            result={result}
            selectedDate={date}
          />
        ))}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import {
  loadMyNumbers,
  normalizeNumber,
  saveMyNumbers,
  type MyNumberEntry,
} from "@/lib/my-numbers";
import { OPERATORS, OPERATOR_ORDER, type OperatorId } from "@/lib/providers/types";

type MyNumbersPanelProps = {
  onChange: (entries: MyNumberEntry[]) => void;
};

export function MyNumbersPanel({ onChange }: MyNumbersPanelProps) {
  const [open, setOpen] = useState(false);
  const [entries, setEntries] = useState<MyNumberEntry[]>([]);
  const [input, setInput] = useState("");
  const [scope, setScope] = useState<OperatorId | "all">("all");

  useEffect(() => {
    const stored = loadMyNumbers();
    setEntries(stored);
    onChange(stored);
  }, [onChange]);

  const persist = (next: MyNumberEntry[]) => {
    setEntries(next);
    saveMyNumbers(next);
    onChange(next);
  };

  const addNumber = () => {
    const normalized = normalizeNumber(input);
    if (!normalized) return;

    if (entries.some((e) => e.number === normalized && e.operator === (scope === "all" ? undefined : scope))) {
      setInput("");
      return;
    }

    const entry: MyNumberEntry = {
      number: normalized,
      ...(scope === "all" ? {} : { operator: scope }),
    };

    persist([...entries, entry]);
    setInput("");
  };

  const removeNumber = (index: number) => {
    persist(entries.filter((_, i) => i !== index));
  };

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
      >
        <div>
          <p className="text-sm font-medium text-white">我的号码 My Numbers</p>
          <p className="text-xs text-zinc-500">
            {entries.length > 0
              ? `${entries.length} 个号码已保存 · 开奖自动标中`
              : "保存你买的字，开奖后自动高亮"}
          </p>
        </div>
        <span className="text-zinc-400">{open ? "−" : "+"}</span>
      </button>

      {open && (
        <div className="border-t border-zinc-800 px-4 pb-4 pt-3">
          <div className="flex flex-wrap gap-2">
            <input
              type="text"
              inputMode="numeric"
              maxLength={4}
              value={input}
              onChange={(e) => setInput(e.target.value.replace(/\D/g, "").slice(0, 4))}
              onKeyDown={(e) => {
                if (e.key === "Enter") addNumber();
              }}
              placeholder="1234"
              className="w-24 rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 font-mono text-sm text-white placeholder:text-zinc-600"
            />
            <select
              value={scope}
              onChange={(e) => setScope(e.target.value as OperatorId | "all")}
              className="min-w-0 flex-1 rounded-lg border border-zinc-700 bg-zinc-950 px-2 py-2 text-sm text-zinc-200"
            >
              <option value="all">全部彩种</option>
              {OPERATOR_ORDER.map((id) => (
                <option key={id} value={id}>
                  {OPERATORS[id].shortNameZh} {OPERATORS[id].shortName}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={addNumber}
              disabled={input.length !== 4}
              className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-40"
            >
              添加
            </button>
          </div>

          {entries.length > 0 ? (
            <ul className="mt-3 flex flex-wrap gap-2">
              {entries.map((entry, index) => (
                <li
                  key={`${entry.number}-${entry.operator ?? "all"}-${index}`}
                  className="flex items-center gap-2 rounded-full bg-zinc-800 px-3 py-1.5 text-sm"
                >
                  <span className="font-mono font-semibold text-white">{entry.number}</span>
                  <span className="text-xs text-zinc-400">
                    {entry.operator
                      ? OPERATORS[entry.operator].shortNameZh
                      : "全部"}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeNumber(index)}
                    className="text-zinc-500 hover:text-red-400"
                    aria-label="Remove number"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-xs text-zinc-500">号码只保存在本机，不会上传服务器。</p>
          )}
        </div>
      )}
    </section>
  );
}

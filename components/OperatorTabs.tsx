"use client";

import type { OperatorId } from "@/lib/providers/types";
import { OPERATORS } from "@/lib/providers/types";

type OperatorTabsProps = {
  selected: OperatorId | "all";
  onChange: (value: OperatorId | "all") => void;
};

const TABS: Array<{ id: OperatorId | "all"; label: string }> = [
  { id: "all", label: "All" },
  { id: "magnum", label: OPERATORS.magnum.shortName },
  { id: "damacai", label: OPERATORS.damacai.shortName },
  { id: "toto", label: OPERATORS.toto.shortName },
];

export function OperatorTabs({ selected, onChange }: OperatorTabsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
            selected === tab.id
              ? "bg-white text-zinc-900"
              : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

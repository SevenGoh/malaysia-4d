"use client";

import { OPERATORS, OPERATOR_ORDER, type OperatorId } from "@/lib/providers/types";

type OperatorTabsProps = {
  selected: OperatorId | "all";
  onChange: (value: OperatorId | "all") => void;
};

const TABS: Array<{ id: OperatorId | "all"; label: string }> = [
  { id: "all", label: "All" },
  ...OPERATOR_ORDER.map((id) => ({
    id,
    label: OPERATORS[id].tabAbbr,
  })),
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
          title={
            tab.id === "all"
              ? "All operators"
              : `${OPERATORS[tab.id].name} · ${OPERATORS[tab.id].nameZh}`
          }
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

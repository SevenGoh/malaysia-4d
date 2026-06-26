import type { DrawPrizes, DrawResult, OperatorId } from "./providers/types";

const STORAGE_KEY = "malaysia-4d-my-numbers";

export type PrizeTier = "first" | "second" | "third" | "special" | "consolation";

export type MyNumberEntry = {
  number: string;
  /** When set, only checked against this operator. */
  operator?: OperatorId;
};

export type NumberHit = {
  number: string;
  tier: PrizeTier;
  tierLabel: string;
};

export const PRIZE_TIER_LABELS: Record<PrizeTier, string> = {
  first: "头奖",
  second: "二奖",
  third: "三奖",
  special: "特别奖",
  consolation: "安慰奖",
};

export function normalizeNumber(value: string): string | null {
  const digits = value.replace(/\D/g, "");
  if (digits.length !== 4) return null;
  return digits;
}

export function loadMyNumbers(): MyNumberEntry[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as MyNumberEntry[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (entry) => typeof entry.number === "string" && entry.number.length === 4
    );
  } catch {
    return [];
  }
}

export function saveMyNumbers(entries: MyNumberEntry[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function tiersForNumber(
  number: string,
  prizes: DrawPrizes
): Array<{ tier: PrizeTier; tierLabel: string }> {
  const hits: Array<{ tier: PrizeTier; tierLabel: string }> = [];

  if (prizes.first === number) {
    hits.push({ tier: "first", tierLabel: PRIZE_TIER_LABELS.first });
  }
  if (prizes.second === number) {
    hits.push({ tier: "second", tierLabel: PRIZE_TIER_LABELS.second });
  }
  if (prizes.third === number) {
    hits.push({ tier: "third", tierLabel: PRIZE_TIER_LABELS.third });
  }
  if (prizes.specials.includes(number)) {
    hits.push({ tier: "special", tierLabel: PRIZE_TIER_LABELS.special });
  }
  if (prizes.consolations.includes(number)) {
    hits.push({ tier: "consolation", tierLabel: PRIZE_TIER_LABELS.consolation });
  }

  return hits;
}

export function matchMyNumbers(
  entries: MyNumberEntry[],
  result: DrawResult
): NumberHit[] {
  const hits: NumberHit[] = [];

  for (const entry of entries) {
    if (entry.operator && entry.operator !== result.operator) continue;

    for (const match of tiersForNumber(entry.number, result.prizes)) {
      hits.push({ number: entry.number, ...match });
    }
  }

  return hits;
}

export function hitsForDisplayedNumber(
  hits: NumberHit[],
  displayedNumber: string
): NumberHit[] {
  if (!displayedNumber) return [];
  return hits.filter((hit) => hit.number === displayedNumber);
}

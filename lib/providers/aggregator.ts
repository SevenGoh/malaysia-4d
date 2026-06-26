import { fetchJson } from "../http";
import type { DrawPrizes, DrawResult, OperatorId } from "./types";

const AGGREGATOR_URL = "https://4dresult88.com/api/v2/fetchall";

type AggregatorPrizeBlock = {
  P1?: string;
  P2?: string;
  P3?: string;
  S1?: string;
  S2?: string;
  S3?: string;
  S4?: string;
  S5?: string;
  S6?: string;
  S7?: string;
  S8?: string;
  S9?: string;
  S10?: string;
  S11?: string;
  S12?: string;
  S13?: string;
  C1?: string;
  C2?: string;
  C3?: string;
  C4?: string;
  C5?: string;
  C6?: string;
  C7?: string;
  C8?: string;
  C9?: string;
  C10?: string;
  DD?: string;
  DN?: string;
  date?: string;
  COMPLETE4D?: number | string;
};

type AggregatorResponse = {
  M4D?: AggregatorPrizeBlock;
  DMC4D?: AggregatorPrizeBlock;
  TT?: AggregatorPrizeBlock;
  GD?: AggregatorPrizeBlock;
};

const OPERATOR_KEY: Record<OperatorId, keyof AggregatorResponse> = {
  magnum: "M4D",
  damacai: "DMC4D",
  toto: "TT",
  granddragon: "GD",
};

function clean(value?: string): string {
  if (!value) return "";
  const trimmed = value.trim();
  if (!trimmed || trimmed === "----" || trimmed === "****") return "";
  return trimmed;
}

function collectRange(
  block: AggregatorPrizeBlock,
  prefix: "S" | "C",
  count: number
): string[] {
  const items: string[] = [];
  for (let i = 1; i <= count; i++) {
    const val = clean(block[`${prefix}${i}` as keyof AggregatorPrizeBlock] as string);
    if (val) items.push(val);
  }
  return items;
}

function parseDrawDate(block: AggregatorPrizeBlock): string {
  if (block.date) {
    return block.date.slice(0, 10);
  }

  const dd = block.DD ?? "";
  const match = dd.match(/(\d{2})-(\d{2})-(\d{4})/);
  if (match) {
    return `${match[3]}-${match[2]}-${match[1]}`;
  }

  const slashMatch = dd.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (slashMatch) {
    const [, day, month, year] = slashMatch;
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }

  return new Date().toISOString().slice(0, 10);
}

function toPrizes(block: AggregatorPrizeBlock): DrawPrizes {
  return {
    first: clean(block.P1),
    second: clean(block.P2),
    third: clean(block.P3),
    specials: collectRange(block, "S", 13).slice(0, 10),
    consolations: collectRange(block, "C", 10),
  };
}

function toDrawResult(operator: OperatorId, block: AggregatorPrizeBlock): DrawResult {
  return {
    operator,
    drawDate: parseDrawDate(block),
    drawId: clean(block.DN),
    prizes: toPrizes(block),
    fetchedAt: new Date().toISOString(),
    stale: false,
  };
}

let cachedPayload: AggregatorResponse | null = null;
let cachedAt = 0;
const CACHE_TTL_MS = 30_000;

async function getAggregatorData(): Promise<AggregatorResponse> {
  const now = Date.now();
  if (cachedPayload && now - cachedAt < CACHE_TTL_MS) {
    return cachedPayload;
  }

  const data = await fetchJson<AggregatorResponse>(AGGREGATOR_URL, {
    headers: { Referer: "https://4dresult88.com/" },
  });

  cachedPayload = data;
  cachedAt = now;
  return data;
}

export async function fetchAggregatorOperator(
  operator: OperatorId
): Promise<DrawResult | null> {
  const data = await getAggregatorData();
  const key = OPERATOR_KEY[operator];
  const block = data[key];
  if (!block) return null;

  const prizes = toPrizes(block);
  if (!prizes.first && !prizes.second && !prizes.third) {
    return null;
  }

  return toDrawResult(operator, block);
}

export async function fetchAllFromAggregator(): Promise<DrawResult[]> {
  const data = await getAggregatorData();
  const results: DrawResult[] = [];

  for (const operator of [
    "magnum",
    "damacai",
    "toto",
    "granddragon",
  ] as OperatorId[]) {
    const key = OPERATOR_KEY[operator];
    const block = data[key];
    if (!block) continue;
    const prizes = toPrizes(block);
    if (!prizes.first) continue;
    results.push(toDrawResult(operator, block));
  }

  return results;
}

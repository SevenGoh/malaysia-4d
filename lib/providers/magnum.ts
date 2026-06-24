import { fetchJson, fetchText } from "../http";
import { fromSlashDate } from "../dates";
import type { DrawPrizes, DrawResult, ResultProvider } from "./types";

const BASE = "https://www.magnum4d.my";

type MagnumLiveResponse = {
  Data?: {
    Results?: Record<string, string>;
  };
};

type MagnumPastDraw = {
  DrawDate: string;
  DrawID: string;
  FirstPrize: string;
  SecondPrize: string;
  ThirdPrize: string;
  Special1: string;
  Special2: string;
  Special3: string;
  Special4: string;
  Special5: string;
  Special6: string;
  Special7: string;
  Special8: string;
  Special9: string;
  Special10: string;
  Console1: string;
  Console2: string;
  Console3: string;
  Console4: string;
  Console5: string;
  Console6: string;
  Console7: string;
  Console8: string;
  Console9: string;
  Console10: string;
};

function alphaToSlot(value?: string): number {
  if (!value || value.length !== 1) return -1;
  return value.charCodeAt(0) - 64;
}

function cleanNumber(value?: string): string {
  if (!value) return "";
  const trimmed = value.trim();
  if (!trimmed || trimmed === "?" || trimmed === "----") return "";
  return trimmed;
}

function collectSpecials(
  result: Record<string, string>,
  excludeSlots: number[]
): string[] {
  const specials: string[] = [];
  for (let i = 1; i <= 13; i++) {
    const slot = i;
    const key = `S${String(slot).padStart(2, "0")}`;
    const val = cleanNumber(result[key]);
    if (!val || excludeSlots.includes(slot)) continue;
    if (["1st", "2nd", "3rd"].includes(val)) continue;
    specials.push(val);
  }
  return specials.slice(0, 10);
}

function collectConsolations(result: Record<string, string>): string[] {
  const items: string[] = [];
  for (let i = 1; i <= 10; i++) {
    const key = `C${String(i).padStart(2, "0")}`;
    const val = cleanNumber(result[key]);
    if (val) items.push(val);
  }
  return items;
}

function fromLiveResult(raw: Record<string, string>): DrawPrizes {
  const firstSlot = alphaToSlot(raw.T1);
  const secondSlot = alphaToSlot(raw.T2);
  const thirdSlot = alphaToSlot(raw.T3);

  const getSlotValue = (slot: number) => {
    if (slot < 1) return "";
    return cleanNumber(raw[`S${String(slot).padStart(2, "0")}`]);
  };

  return {
    first: getSlotValue(firstSlot),
    second: getSlotValue(secondSlot),
    third: getSlotValue(thirdSlot),
    specials: collectSpecials(raw, [firstSlot, secondSlot, thirdSlot]),
    consolations: collectConsolations(raw),
  };
}

function fromPastDraw(draw: MagnumPastDraw): DrawPrizes {
  const specials = [
    draw.Special1,
    draw.Special2,
    draw.Special3,
    draw.Special4,
    draw.Special5,
    draw.Special6,
    draw.Special7,
    draw.Special8,
    draw.Special9,
    draw.Special10,
  ]
    .map(cleanNumber)
    .filter(Boolean);

  const consolations = [
    draw.Console1,
    draw.Console2,
    draw.Console3,
    draw.Console4,
    draw.Console5,
    draw.Console6,
    draw.Console7,
    draw.Console8,
    draw.Console9,
    draw.Console10,
  ]
    .map(cleanNumber)
    .filter(Boolean);

  return {
    first: cleanNumber(draw.FirstPrize),
    second: cleanNumber(draw.SecondPrize),
    third: cleanNumber(draw.ThirdPrize),
    specials,
    consolations,
  };
}

function buildResult(
  drawDate: string,
  drawId: string | undefined,
  prizes: DrawPrizes
): DrawResult {
  return {
    operator: "magnum",
    drawDate,
    drawId,
    prizes,
    fetchedAt: new Date().toISOString(),
  };
}

async function fetchLive(): Promise<DrawResult | null> {
  const data = await fetchJson<MagnumLiveResponse>(`${BASE}/live-draw`);
  const raw = data.Data?.Results;
  if (!raw?.DrawDate) return null;

  const drawDate = fromSlashDate(raw.DrawDate);
  const prizes = fromLiveResult(raw);

  if (!prizes.first && !prizes.second && !prizes.third) {
    return null;
  }

  return buildResult(drawDate, raw.DrawID, prizes);
}

async function fetchPastByDate(isoDate: string): Promise<DrawResult | null> {
  const draws = await fetchJson<MagnumPastDraw[]>(
    `${BASE}/results/past/between-dates/null/${isoDate}/5`
  );

  const match = draws.find((draw) => fromSlashDate(draw.DrawDate) === isoDate);
  if (match) {
    return buildResult(
      fromSlashDate(match.DrawDate),
      match.DrawID,
      fromPastDraw(match)
    );
  }

  return null;
}

export const magnumProvider: ResultProvider = {
  id: "magnum",

  async fetchLatest() {
    return fetchLive();
  },

  async fetchByDate(date: string) {
    const live = await fetchLive();
    if (live?.drawDate === date) return live;
    return fetchPastByDate(date);
  },
};

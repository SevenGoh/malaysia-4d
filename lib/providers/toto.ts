import * as cheerio from "cheerio";
import { fromSlashDate, toDamacaiDate } from "../dates";
import { fetchText } from "../http";
import type { DrawPrizes, DrawResult, ResultProvider } from "./types";
import { fetchAggregatorOperator } from "./aggregator";

const TOTO_INDEX = "https://www.sportstoto.com.my/index.asp?sc=1";
const TOTO_PAST = "https://www.sportstoto.com.my/results_past.asp";

const SPORTSTOTO_HEADERS = {
  Referer: "https://www.sportstoto.com.my/cn/index.asp",
  "Accept-Language": "en-MY,en;q=0.9",
};

function cleanFourDigit(value: string): string | null {
  const trimmed = value.trim();
  return /^\d{4}$/.test(trimmed) ? trimmed : null;
}

function collectFourDigitNumbers(html: string): string[] {
  const $ = cheerio.load(html);
  const numbers: string[] = [];

  $("td, div").each((_, element) => {
    const value = cleanFourDigit($(element).text());
    if (value) numbers.push(value);
  });

  return numbers;
}

function sliceToto4dSection(html: string): string | null {
  const start = html.search(/TOTO\s*4D/i);
  if (start < 0) return null;

  const endMarkers = [
    html.indexOf("TOTO 4D ZODIAC", start + 1),
    html.indexOf("TOTO 4D JACKPOT", start + 1),
    html.indexOf("TOTO 4D FIREBALL", start + 1),
    html.indexOf("TOTO  4D JACKPOT", start + 1),
  ].filter((index) => index > start);

  const end = endMarkers.length > 0 ? Math.min(...endMarkers) : start + 8000;
  return html.slice(start, end);
}

function numbersToPrizes(numbers: string[]): DrawPrizes | null {
  if (numbers.length < 23) return null;

  return {
    first: numbers[0],
    second: numbers[1],
    third: numbers[2],
    specials: numbers.slice(3, 13),
    consolations: numbers.slice(13, 23),
  };
}

function parseToto4dSection(section: string): DrawPrizes | null {
  return numbersToPrizes(collectFourDigitNumbers(section));
}

function parseDrawMeta(html: string): { drawDate: string; drawId?: string } {
  const drawIdMatch = html.match(/Draw\s*No\.?\s*:?\s*(\d+\/\d+)/i);
  const drawDateMatch =
    html.match(/Draw\s*Date\s*:?\s*(\d{1,2}\/\d{1,2}\/\d{4})/i) ??
    html.match(
      /(\d{1,2}\/\d{1,2}\/\d{4}),?\s*(?:Sunday|Saturday|Wednesday|Mon|Tue|Wed|Thu|Fri|Sat|Sun)/i
    );

  const drawDate = drawDateMatch
    ? fromSlashDate(drawDateMatch[1])
    : new Date().toISOString().slice(0, 10);

  return {
    drawDate,
    drawId: drawIdMatch?.[1],
  };
}

function buildResult(
  drawDate: string,
  drawId: string | undefined,
  prizes: DrawPrizes,
  stale?: boolean
): DrawResult {
  return {
    operator: "toto",
    drawDate,
    drawId,
    prizes,
    fetchedAt: new Date().toISOString(),
    stale,
  };
}

function datePatterns(isoDate: string): string[] {
  const slash = toDamacaiDate(isoDate);
  const [year, month, day] = isoDate.split("-");
  const variants = new Set([
    slash,
    `${parseInt(day, 10)}/${parseInt(month, 10)}/${year}`,
    `${day}/${month}/${year}`,
  ]);
  return [...variants];
}

async function fetchOfficialLatest(): Promise<DrawResult | null> {
  const html = await fetchText(TOTO_INDEX, { headers: SPORTSTOTO_HEADERS });
  if (html.includes("Access Denied")) return null;

  const section = sliceToto4dSection(html);
  if (!section) return null;

  const prizes = parseToto4dSection(section);
  if (!prizes?.first) return null;

  const meta = parseDrawMeta(html);
  return buildResult(meta.drawDate, meta.drawId, prizes);
}

async function fetchOfficialByDate(isoDate: string): Promise<DrawResult | null> {
  const latest = await fetchOfficialLatest();
  if (latest?.drawDate === isoDate) return latest;

  const html = await fetchText(TOTO_PAST, { headers: SPORTSTOTO_HEADERS });
  if (html.includes("Access Denied")) return null;

  const patterns = datePatterns(isoDate);
  let start = -1;

  for (const pattern of patterns) {
    start = html.indexOf(pattern);
    if (start >= 0) break;
  }

  if (start < 0) return null;

  const section = sliceToto4dSection(html.slice(start, start + 12000));
  if (!section) return null;

  const prizes = parseToto4dSection(section);
  if (!prizes?.first) return null;

  const drawIdMatch = html
    .slice(Math.max(0, start - 500), start + 500)
    .match(/Draw\s*No\.?\s*:?\s*(\d+\/\d+)/i);

  return buildResult(isoDate, drawIdMatch?.[1], prizes);
}

export const totoProvider: ResultProvider = {
  id: "toto",

  async fetchLatest() {
    try {
      const official = await fetchOfficialLatest();
      if (official?.prizes.first) return official;
    } catch {
      // fall through to aggregator
    }

    return fetchAggregatorOperator("toto");
  },

  async fetchByDate(date: string) {
    try {
      const official = await fetchOfficialByDate(date);
      if (official?.prizes.first) return official;
    } catch {
      // fall through
    }

    const aggregated = await fetchAggregatorOperator("toto");
    if (aggregated?.drawDate === date) return aggregated;

    return null;
  },
};

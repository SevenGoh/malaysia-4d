import { fetchJson, fetchText } from "../http";
import { fromSlashDate, toDamacaiDate } from "../dates";
import type { DrawPrizes, DrawResult, ResultProvider } from "./types";
import { fetchAggregatorOperator } from "./aggregator";

const BASE = "https://www.damacai.com.my";

type DamacaiLinkResponse = {
  link?: string;
};

type DamacaiDrawJson = {
  drawDate?: string;
  drawNo?: string;
  p1?: number | string;
  p2?: number | string;
  p3?: number | string;
  starterList?: Array<number | string>;
  consolationList?: Array<number | string>;
};

function pad4(value: number | string | undefined): string {
  if (value === undefined || value === null || value === "") return "";
  return String(value).padStart(4, "0");
}

function fromDamacaiJson(draw: DamacaiDrawJson): DrawPrizes {
  const specials = (draw.starterList ?? [])
    .map(pad4)
    .filter((n) => n.length === 4);
  const consolations = (draw.consolationList ?? [])
    .map(pad4)
    .filter((n) => n.length === 4);

  return {
    first: pad4(draw.p1),
    second: pad4(draw.p2),
    third: pad4(draw.p3),
    specials,
    consolations,
  };
}

function buildResult(
  drawDate: string,
  drawId: string | undefined,
  prizes: DrawPrizes,
  stale?: boolean
): DrawResult {
  return {
    operator: "damacai",
    drawDate,
    drawId,
    prizes,
    fetchedAt: new Date().toISOString(),
    stale,
  };
}

async function fetchOfficialByDate(isoDate: string): Promise<DrawResult | null> {
  const pastDate = toDamacaiDate(isoDate);
  const linkResponse = await fetchJson<DamacaiLinkResponse>(
    `${BASE}/callpassresult?pastdate=${encodeURIComponent(pastDate)}`,
    {
      headers: {
        cookiesession: "403",
        Referer: `${BASE}/past-draw-result`,
      },
    }
  );

  if (!linkResponse.link) return null;

  const raw = await fetchText(linkResponse.link, {
    headers: { Referer: `${BASE}/past-draw-result` },
  });

  if (raw.includes("BlobNotFound") || raw.startsWith("<?xml")) {
    return null;
  }

  const draw = JSON.parse(raw.replace(/^\uFEFF/, "")) as DamacaiDrawJson;
  if (!draw.drawDate && !draw.p1) return null;

  const drawDate = draw.drawDate
    ? fromSlashDate(String(draw.drawDate).split(" ")[0])
    : isoDate;

  return buildResult(drawDate, draw.drawNo, fromDamacaiJson(draw));
}

export const damacaiProvider: ResultProvider = {
  id: "damacai",

  async fetchLatest() {
    try {
      const official = await fetchOfficialByDate(
        new Date().toISOString().slice(0, 10)
      );
      if (official?.prizes.first) return official;
    } catch {
      // fall through to aggregator
    }

    const aggregated = await fetchAggregatorOperator("damacai");
    if (!aggregated) return null;
    return { ...aggregated, stale: false };
  },

  async fetchByDate(date: string) {
    try {
      const official = await fetchOfficialByDate(date);
      if (official?.prizes.first) return official;
    } catch {
      // fall through
    }

    const aggregated = await fetchAggregatorOperator("damacai");
    if (aggregated?.drawDate === date) return aggregated;

    return null;
  },
};

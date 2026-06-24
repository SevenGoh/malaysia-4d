import { getCachedResult, hasCachedResult, saveResult } from "./db";
import { getTodayIso, isDrawDay, parseIsoDate } from "./dates";
import { sleep } from "./http";
import { providers, type DrawResult, type OperatorId } from "./providers";

export type FetchAllOptions = {
  date?: string;
  force?: boolean;
};

async function fetchForProvider(
  operator: OperatorId,
  date?: string
): Promise<DrawResult | null> {
  const provider = providers.find((p) => p.id === operator);
  if (!provider) return null;

  if (date) {
    if (!(await hasCachedResult(operator, date))) {
      const result = await provider.fetchByDate(date);
      if (result) {
        await saveResult(result);
        return result;
      }
    }
    return getCachedResult(operator, date);
  }

  const result = await provider.fetchLatest();
  if (result) {
    await saveResult(result);
  }
  return result;
}

export async function fetchAll(options: FetchAllOptions = {}): Promise<DrawResult[]> {
  const { date, force = false } = options;
  const results: DrawResult[] = [];

  for (const provider of providers) {
    if (date && !force && (await hasCachedResult(provider.id, date))) {
      const cached = await getCachedResult(provider.id, date);
      if (cached) {
        results.push(cached);
        continue;
      }
    }

    try {
      const result = date
        ? await provider.fetchByDate(date)
        : await provider.fetchLatest();

      if (result) {
        if (!force && date && (await hasCachedResult(provider.id, date))) {
          const cached = await getCachedResult(provider.id, date);
          if (cached) {
            results.push(cached);
            continue;
          }
        }

        await saveResult(result);
        results.push(result);
      } else if (date) {
        const cached = await getCachedResult(provider.id, date);
        if (cached) results.push(cached);
      }
    } catch (error) {
      const cached = date ? await getCachedResult(provider.id, date) : null;
      if (cached) {
        results.push({ ...cached, stale: true, error: String(error) });
      }
    }

    await sleep(400);
  }

  return results;
}

export async function getResultsForDate(
  date: string,
  operator?: OperatorId,
  options?: { latestFallback?: boolean }
): Promise<DrawResult[]> {
  const latestFallback = options?.latestFallback ?? true;

  if (operator) {
    const cached = await getCachedResult(operator, date);
    if (cached) return [cached];

    const result = await fetchForProvider(operator, date);
    if (result) return [result];

    if (latestFallback) {
      const latest = await fetchForProvider(operator);
      if (latest) return [latest];
    }

    return [];
  }

  const cached = (
    await Promise.all(providers.map((p) => getCachedResult(p.id, date)))
  ).filter((r): r is DrawResult => r !== null);

  if (cached.length === providers.length) {
    return cached;
  }

  const fetched = await fetchAll({ date });
  const byOperator = new Map(fetched.map((r) => [r.operator, r]));

  for (const result of cached) {
    if (!byOperator.has(result.operator)) {
      byOperator.set(result.operator, result);
    }
  }

  let results = Array.from(byOperator.values());

  const shouldUseLatest =
    latestFallback &&
    (results.length === 0 ||
      (date === getTodayIso() && !isDrawDay(parseIsoDate(date))));

  if (shouldUseLatest) {
    const latestResults = await fetchAll();
    const latestMap = new Map(latestResults.map((r) => [r.operator, r]));

    for (const provider of providers) {
      if (!latestMap.has(provider.id)) continue;
      const existing = results.find((r) => r.operator === provider.id);
      if (!existing || existing.drawDate !== date) {
        latestMap.set(provider.id, latestMap.get(provider.id)!);
      }
    }

    results = providers
      .map((p) => {
        const exact = results.find(
          (r) => r.operator === p.id && r.drawDate === date
        );
        if (exact) return exact;
        return latestMap.get(p.id) ?? results.find((r) => r.operator === p.id);
      })
      .filter((r): r is DrawResult => r !== undefined);
  }

  return results;
}

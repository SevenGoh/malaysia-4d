import { fetchAggregatorOperator } from "./aggregator";
import type { DrawResult, ResultProvider } from "./types";

export const granddragonProvider: ResultProvider = {
  id: "granddragon",

  async fetchLatest(): Promise<DrawResult | null> {
    return fetchAggregatorOperator("granddragon");
  },

  async fetchByDate(_date: string): Promise<DrawResult | null> {
    const latest = await fetchAggregatorOperator("granddragon");
    if (!latest) return null;
    if (latest.drawDate === _date) return latest;
    return null;
  },
};

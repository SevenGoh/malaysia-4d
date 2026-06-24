export type OperatorId = "magnum" | "damacai" | "toto";

export type DrawPrizes = {
  first: string;
  second: string;
  third: string;
  specials: string[];
  consolations: string[];
};

export type DrawResult = {
  operator: OperatorId;
  drawDate: string;
  drawId?: string;
  prizes: DrawPrizes;
  fetchedAt: string;
  stale?: boolean;
  error?: string;
};

export type OperatorMeta = {
  id: OperatorId;
  name: string;
  shortName: string;
  accentClass: string;
  officialUrl: string;
};

export const OPERATORS: Record<OperatorId, OperatorMeta> = {
  magnum: {
    id: "magnum",
    name: "Magnum 4D",
    shortName: "Magnum",
    accentClass: "border-amber-400",
    officialUrl: "https://www.magnum4d.my/results/draw-results",
  },
  damacai: {
    id: "damacai",
    name: "Da Ma Cai",
    shortName: "Damacai",
    accentClass: "border-red-500",
    officialUrl: "https://www.damacai.com.my/past-draw-result",
  },
  toto: {
    id: "toto",
    name: "Sports Toto",
    shortName: "Toto",
    accentClass: "border-blue-500",
    officialUrl: "https://www.sportstoto.com.my/",
  },
};

export interface ResultProvider {
  id: OperatorId;
  fetchLatest(): Promise<DrawResult | null>;
  fetchByDate(date: string): Promise<DrawResult | null>;
}

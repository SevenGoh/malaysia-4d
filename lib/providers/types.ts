export type OperatorId = "magnum" | "damacai" | "toto" | "granddragon";

export const OPERATOR_ORDER: OperatorId[] = [
  "magnum",
  "damacai",
  "toto",
  "granddragon",
];

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
  nameZh: string;
  shortName: string;
  shortNameZh: string;
  /** Short English label for tabs, e.g. M4D, DMC. */
  tabAbbr: string;
  accentClass: string;
  officialUrl: string;
  /** Draws every calendar day (e.g. Grand Dragon). */
  dailyDraw?: boolean;
};

export const OPERATORS: Record<OperatorId, OperatorMeta> = {
  magnum: {
    id: "magnum",
    name: "Magnum 4D",
    nameZh: "万能",
    shortName: "Magnum",
    shortNameZh: "万能",
    tabAbbr: "M4D",
    accentClass: "border-amber-400",
    officialUrl: "https://www.magnum4d.my/results/draw-results",
  },
  damacai: {
    id: "damacai",
    name: "Da Ma Cai",
    nameZh: "大马彩",
    shortName: "Damacai",
    shortNameZh: "大马彩",
    tabAbbr: "DMC",
    accentClass: "border-red-500",
    officialUrl: "https://www.damacai.com.my/past-draw-result",
  },
  toto: {
    id: "toto",
    name: "Sports Toto",
    nameZh: "多多",
    shortName: "Toto",
    shortNameZh: "多多",
    tabAbbr: "ST",
    accentClass: "border-blue-500",
    officialUrl: "https://www.sportstoto.com.my/",
  },
  granddragon: {
    id: "granddragon",
    name: "Grand Dragon",
    nameZh: "金龙",
    shortName: "GD",
    shortNameZh: "金龙",
    tabAbbr: "GD",
    accentClass: "border-emerald-400",
    officialUrl: "https://gdlotto.com/",
    dailyDraw: true,
  },
};

export interface ResultProvider {
  id: OperatorId;
  fetchLatest(): Promise<DrawResult | null>;
  fetchByDate(date: string): Promise<DrawResult | null>;
}

import { damacaiProvider } from "./damacai";
import { granddragonProvider } from "./granddragon";
import { magnumProvider } from "./magnum";
import { totoProvider } from "./toto";
import type { OperatorId, ResultProvider } from "./types";

export const providers: ResultProvider[] = [
  magnumProvider,
  damacaiProvider,
  totoProvider,
  granddragonProvider,
];

export const providerMap: Record<OperatorId, ResultProvider> = {
  magnum: magnumProvider,
  damacai: damacaiProvider,
  toto: totoProvider,
  granddragon: granddragonProvider,
};

export function getProvider(id: OperatorId): ResultProvider {
  return providerMap[id];
}

export * from "./types";
export { magnumProvider } from "./magnum";
export { damacaiProvider } from "./damacai";
export { granddragonProvider } from "./granddragon";
export { totoProvider } from "./toto";

/** AdSense / AdMob web ad configuration (same Google publisher account). */

export const ADSENSE_CLIENT_ID =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID?.trim() ?? "";

export const ADSENSE_PUBLISHER_ID =
  process.env.ADSENSE_PUBLISHER_ID?.trim() ??
  ADSENSE_CLIENT_ID.replace(/^ca-/, "pub-");

export const AD_SLOTS = {
  footer: process.env.NEXT_PUBLIC_ADSENSE_SLOT_FOOTER?.trim() ?? "",
  content: process.env.NEXT_PUBLIC_ADSENSE_SLOT_CONTENT?.trim() ?? "",
} as const;

export function isAdsEnabled(): boolean {
  if (!ADSENSE_CLIENT_ID) return false;
  if (process.env.NEXT_PUBLIC_ADS_ENABLED === "true") return true;
  return process.env.NODE_ENV === "production";
}

export function hasAdSlot(slot: keyof typeof AD_SLOTS): boolean {
  return isAdsEnabled() && Boolean(AD_SLOTS[slot]);
}

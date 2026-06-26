"use client";

import { useEffect, useRef } from "react";
import { ADSENSE_CLIENT_ID, AD_SLOTS, hasAdSlot, isAdsEnabled } from "@/lib/ads";

type AdBannerProps = {
  slot: keyof typeof AD_SLOTS;
  className?: string;
};

export function AdBanner({ slot, className = "" }: AdBannerProps) {
  const pushed = useRef(false);
  const slotId = AD_SLOTS[slot];

  useEffect(() => {
    if (!hasAdSlot(slot) || pushed.current) return;
    pushed.current = true;
    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    } catch {
      // Ad blockers or script not loaded yet
    }
  }, [slot]);

  if (!isAdsEnabled() || !slotId) return null;

  return (
    <div
      className={`overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-900/40 ${className}`}
      aria-label="Advertisement"
    >
      <p className="px-2 pt-1 text-center text-[10px] uppercase tracking-wide text-zinc-600">
        Ad
      </p>
      <ins
        className="adsbygoogle block min-h-[50px] w-full"
        style={{ display: "block" }}
        data-ad-client={ADSENSE_CLIENT_ID}
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}

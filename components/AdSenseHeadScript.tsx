import { ADSENSE_CLIENT_ID, isAdsEnabled } from "@/lib/ads";

/**
 * Raw AdSense snippet in initial HTML for Google site verification crawlers.
 */
export function AdSenseHeadScript() {
  if (!isAdsEnabled() || !ADSENSE_CLIENT_ID) return null;

  return (
    <script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
      crossOrigin="anonymous"
      suppressHydrationWarning
    />
  );
}

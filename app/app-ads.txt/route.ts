import { NextResponse } from "next/server";
import { ADSENSE_PUBLISHER_ID } from "@/lib/ads";

export const dynamic = "force-dynamic";

/** Required by AdMob / AdSense for in-app and web monetization. */
export async function GET() {
  const pubId = ADSENSE_PUBLISHER_ID;

  if (!pubId || pubId === "pub-") {
    return new NextResponse(
      "# Set ADSENSE_PUBLISHER_ID or NEXT_PUBLIC_ADSENSE_CLIENT_ID in Vercel\n",
      {
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      }
    );
  }

  const normalized = pubId.startsWith("pub-") ? pubId : `pub-${pubId}`;

  const body = `google.com, ${normalized}, DIRECT, f08c47fec0942fa0\n`;

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}

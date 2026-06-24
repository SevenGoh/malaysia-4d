import { NextRequest, NextResponse } from "next/server";
import { isDrawDay } from "@/lib/dates";
import { fetchAll } from "@/lib/fetch-all";

export const dynamic = "force-dynamic";

function isDrawNightMyt(now = new Date()): boolean {
  const myt = new Date(
    now.toLocaleString("en-US", { timeZone: "Asia/Kuala_Lumpur" })
  );
  const hour = myt.getHours();
  const minute = myt.getMinutes();
  const timeValue = hour * 60 + minute;
  return timeValue >= 19 * 60 + 5 && timeValue <= 19 * 60 + 35;
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret) {
    const authorized =
      authHeader === `Bearer ${cronSecret}` ||
      request.headers.get("x-vercel-cron") === "1";
    if (!authorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const force = request.nextUrl.searchParams.get("force") === "true";
  const now = new Date();
  const myt = new Date(
    now.toLocaleString("en-US", { timeZone: "Asia/Kuala_Lumpur" })
  );

  if (!force && (!isDrawDay(myt) || !isDrawNightMyt(now))) {
    return NextResponse.json({
      skipped: true,
      reason: "Outside draw-night window (Wed/Sat/Sun 7:05–7:35 PM MYT)",
    });
  }

  try {
    const results = await fetchAll({ force: true });
    return NextResponse.json({
      fetched: results.length,
      operators: results.map((r) => ({
        operator: r.operator,
        drawDate: r.drawDate,
        drawId: r.drawId,
      })),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Cron fetch failed", details: String(error) },
      { status: 502 }
    );
  }
}

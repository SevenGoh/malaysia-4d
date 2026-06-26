import { NextRequest, NextResponse } from "next/server";
import { getTodayIso, isDrawDay, parseIsoDate } from "@/lib/dates";
import { fetchAll, getResultsForDate } from "@/lib/fetch-all";
import type { DrawResult, OperatorId } from "@/lib/providers/types";

export const dynamic = "force-dynamic";

const VALID_OPERATORS = new Set<OperatorId>([
  "magnum",
  "damacai",
  "toto",
  "granddragon",
]);

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const date = searchParams.get("date") ?? getTodayIso();
  const operator = searchParams.get("operator") as OperatorId | null;
  const refresh = searchParams.get("refresh") === "true";

  if (operator && !VALID_OPERATORS.has(operator)) {
    return NextResponse.json({ error: "Invalid operator" }, { status: 400 });
  }

  try {
    let results: DrawResult[];

    if (refresh) {
      const useLatestOnly =
        date === getTodayIso() && !isDrawDay(parseIsoDate(date));
      results = useLatestOnly
        ? await fetchAll({ force: true })
        : await fetchAll({ date, force: true });
    } else {
      results = await getResultsForDate(date, operator ?? undefined);
    }

    const filtered = operator
      ? results.filter((r) => r.operator === operator)
      : results;

    if (filtered.length === 0) {
      return NextResponse.json({
        date,
        results: [],
        message: "No results found for this date. Try refreshing on a draw day.",
      });
    }

    return NextResponse.json({ date, results: filtered });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to load results", details: String(error) },
      { status: 502 }
    );
  }
}

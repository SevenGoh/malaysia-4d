import { createClient, type Client } from "@libsql/client";
import fs from "fs";
import path from "path";
import type { DrawResult, OperatorId } from "./providers/types";

let client: Client | null = null;
let schemaReady: Promise<void> | null = null;

function getDatabaseUrl(): string {
  return process.env.TURSO_DATABASE_URL ?? "file:data/results.db";
}

function getClient(): Client {
  if (client) return client;

  const url = getDatabaseUrl();
  if (url.startsWith("file:")) {
    const filePath = url.replace(/^file:/, "");
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  const authToken = process.env.TURSO_AUTH_TOKEN;
  client = authToken
    ? createClient({ url, authToken })
    : createClient({ url });

  return client;
}

async function ensureSchema(): Promise<void> {
  if (!schemaReady) {
    schemaReady = getClient()
      .execute(`
        CREATE TABLE IF NOT EXISTS draw_results (
          operator TEXT NOT NULL,
          draw_date TEXT NOT NULL,
          draw_id TEXT,
          payload TEXT NOT NULL,
          fetched_at TEXT NOT NULL,
          PRIMARY KEY (operator, draw_date)
        )
      `)
      .then(() => undefined);
  }
  await schemaReady;
}

export async function saveResult(result: DrawResult): Promise<void> {
  await ensureSchema();
  await getClient().execute({
    sql: `INSERT INTO draw_results (operator, draw_date, draw_id, payload, fetched_at)
          VALUES (?, ?, ?, ?, ?)
          ON CONFLICT(operator, draw_date) DO UPDATE SET
            draw_id = excluded.draw_id,
            payload = excluded.payload,
            fetched_at = excluded.fetched_at`,
    args: [
      result.operator,
      result.drawDate,
      result.drawId ?? null,
      JSON.stringify(result),
      result.fetchedAt,
    ],
  });
}

export async function getCachedResult(
  operator: OperatorId,
  drawDate: string
): Promise<DrawResult | null> {
  await ensureSchema();
  const row = await getClient().execute({
    sql: `SELECT payload FROM draw_results WHERE operator = ? AND draw_date = ?`,
    args: [operator, drawDate],
  });

  const payload = row.rows[0]?.payload;
  if (typeof payload !== "string") return null;

  const result = JSON.parse(payload) as DrawResult;

  if (operator === "toto") {
    const ageMs = Date.now() - new Date(result.fetchedAt).getTime();
    if (ageMs > 6 * 60 * 60 * 1000) {
      return null;
    }
  }

  return result;
}

export async function getCachedResultsForDate(
  drawDate: string
): Promise<DrawResult[]> {
  await ensureSchema();
  const result = await getClient().execute({
    sql: `SELECT payload FROM draw_results WHERE draw_date = ?`,
    args: [drawDate],
  });

  return result.rows
    .map((row) => row.payload)
    .filter((payload): payload is string => typeof payload === "string")
    .map((payload) => JSON.parse(payload) as DrawResult);
}

export async function hasCachedResult(
  operator: OperatorId,
  drawDate: string
): Promise<boolean> {
  const cached = await getCachedResult(operator, drawDate);
  return cached !== null;
}

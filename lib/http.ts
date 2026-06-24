const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

export async function fetchText(
  url: string,
  init?: RequestInit & { headers?: Record<string, string> }
): Promise<string> {
  const response = await fetch(url, {
    ...init,
    headers: {
      "User-Agent": USER_AGENT,
      Accept: "application/json, text/html, */*",
      ...init?.headers,
    },
    next: { revalidate: 0 },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${url}`);
  }

  return response.text();
}

export async function fetchJson<T>(
  url: string,
  init?: RequestInit & { headers?: Record<string, string> }
): Promise<T> {
  const text = await fetchText(url, init);
  return JSON.parse(text) as T;
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

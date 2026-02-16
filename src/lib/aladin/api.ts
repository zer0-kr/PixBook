import type { AladinItem, AladinSearchResponse } from "./types";
import { logError } from "@/lib/logger";

interface SearchOptions {
  maxResults?: number;
  page?: number;
  queryType?: "Keyword" | "Title";
}

/**
 * Search the Aladin API for books matching the given query.
 * Returns an empty array if the API key is missing or the request fails.
 */
export async function searchAladin(
  query: string,
  options: SearchOptions = {}
): Promise<AladinItem[]> {
  const ttbKey = process.env.ALADIN_TTB_KEY;
  if (!ttbKey) return [];

  const { maxResults = 20, page = 1, queryType = "Keyword" } = options;

  const params = new URLSearchParams({
    TTBKey: ttbKey,
    Query: query,
    QueryType: queryType,
    MaxResults: String(maxResults),
    start: String(page),
    Cover: "Big",
    output: "js",
    Version: "20131101",
  });

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(
      `https://www.aladin.co.kr/ttb/api/ItemSearch.aspx?${params.toString()}`,
      { signal: controller.signal }
    );
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Aladin API responded with status ${response.status}`);
    }

    const text = await response.text();
    // Aladin API returns JSON with trailing semicolons
    const cleaned = text.replace(/;+$/, "");
    const data: AladinSearchResponse = JSON.parse(cleaned);

    return data.item ?? [];
  } catch (error) {
    clearTimeout(timeoutId);
    logError("Aladin API error:", error);
    return [];
  }
}

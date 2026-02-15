import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { AladinSearchResponse } from "@/lib/aladin/types";

const MOCK_SEARCH_RESPONSE: AladinSearchResponse = {
  version: "20131101",
  title: "알라딘 검색결과 (Mock)",
  link: "https://www.aladin.co.kr",
  pubDate: new Date().toISOString(),
  totalResults: 2,
  startIndex: 1,
  itemsPerPage: 20,
  query: "mock",
  searchCategoryId: 0,
  searchCategoryName: "전체",
  item: [
    {
      itemId: 1,
      title: "클린 코드 (Clean Code)",
      link: "https://www.aladin.co.kr/shop/wproduct.aspx?ItemId=34083680",
      author: "로버트 C. 마틴 (지은이), 박재호, 이해영 (옮긴이)",
      pubDate: "2013-12-24",
      description:
        "프로그래머, 소프트웨어 공학도, 프로젝트 관리자, 팀 리드, 시스템 분석가에게 추천하는 필독서.",
      isbn13: "9788966260959",
      cover:
        "https://image.aladin.co.kr/product/3408/36/cover500/8966260950_2.jpg",
      categoryName: "국내도서>컴퓨터/모바일>프로그래밍 언어",
      publisher: "인사이트",
    },
    {
      itemId: 2,
      title: "리팩터링 2판",
      link: "https://www.aladin.co.kr/shop/wproduct.aspx?ItemId=236186172",
      author: "마틴 파울러 (지은이), 개앞맵시, 남기혁 (옮긴이)",
      pubDate: "2020-04-01",
      description:
        "지난 20년간 전 세계 프로그래머에게 가장 많이 읽힌 소프트웨어 공학 분야의 바이블.",
      isbn13: "9791162242742",
      cover:
        "https://image.aladin.co.kr/product/23618/61/cover500/k582636305_1.jpg",
      categoryName: "국내도서>컴퓨터/모바일>프로그래밍 언어",
      publisher: "한빛미디어",
    },
  ],
};

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = request.nextUrl;
  const query = searchParams.get("query");
  const page = searchParams.get("page") || "1";
  const maxResults = searchParams.get("maxResults") || "20";

  if (!query) {
    return NextResponse.json(
      { error: "query parameter is required" },
      { status: 400 }
    );
  }

  if (query.length > 200) {
    return NextResponse.json(
      { error: "query is too long (max 200 characters)" },
      { status: 400 }
    );
  }

  const ttbKey = process.env.ALADIN_TTB_KEY;

  if (!ttbKey) {
    // Return mock data for development
    return NextResponse.json({
      ...MOCK_SEARCH_RESPONSE,
      query,
    });
  }

  try {
    const params = new URLSearchParams({
      TTBKey: ttbKey,
      Query: query,
      QueryType: "Keyword",
      MaxResults: maxResults,
      start: page,
      Cover: "Big",
      output: "js",
      Version: "20131101",
    });

    const response = await fetch(
      `https://www.aladin.co.kr/ttb/api/ItemSearch.aspx?${params.toString()}`
    );

    if (!response.ok) {
      throw new Error(`Aladin API responded with status ${response.status}`);
    }

    const text = await response.text();
    // Aladin API returns JSON with trailing semicolons
    const cleaned = text.replace(/;+$/, "");
    const data: AladinSearchResponse = JSON.parse(cleaned);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Aladin search API error:", error);
    return NextResponse.json(
      { error: "Failed to search books" },
      { status: 500 }
    );
  }
}

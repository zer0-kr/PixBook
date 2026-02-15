import { NextRequest, NextResponse } from "next/server";
import type { AladinSearchResponse } from "@/lib/aladin/types";

const MOCK_LOOKUP_RESPONSE: AladinSearchResponse = {
  version: "20131101",
  title: "알라딘 상품 조회 (Mock)",
  link: "https://www.aladin.co.kr",
  pubDate: new Date().toISOString(),
  totalResults: 1,
  startIndex: 1,
  itemsPerPage: 1,
  query: "",
  searchCategoryId: 0,
  searchCategoryName: "",
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
      subInfo: {
        itemPage: 464,
      },
    },
  ],
};

export const revalidate = 86400; // 24 hours cache

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ isbn: string }> }
) {
  const { isbn } = await params;

  if (!isbn) {
    return NextResponse.json(
      { error: "isbn parameter is required" },
      { status: 400 }
    );
  }

  const ttbKey = process.env.ALADIN_TTB_KEY;

  if (!ttbKey) {
    // Return mock data for development
    return NextResponse.json({
      ...MOCK_LOOKUP_RESPONSE,
      item: MOCK_LOOKUP_RESPONSE.item.map((item) => ({
        ...item,
        isbn13: isbn,
      })),
    });
  }

  try {
    const searchParams = new URLSearchParams({
      TTBKey: ttbKey,
      ItemId: isbn,
      ItemIdType: "ISBN13",
      Cover: "Big",
      output: "js",
      Version: "20131101",
      OptResult: "subInfo",
    });

    const response = await fetch(
      `https://www.aladin.co.kr/ttb/api/ItemLookUp.aspx?${searchParams.toString()}`
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
    console.error("Aladin lookup API error:", error);
    return NextResponse.json(
      { error: "Failed to lookup book" },
      { status: 500 }
    );
  }
}

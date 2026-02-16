import { NextRequest, NextResponse } from "next/server";
import { withAuthAndRateLimit } from "@/lib/api/auth";
import { searchAladin } from "@/lib/aladin/api";
import type { AladinSearchResponse } from "@/lib/aladin/types";

export async function GET(request: NextRequest) {
  return withAuthAndRateLimit(
    async () => {
      const { searchParams } = request.nextUrl;
      const query = searchParams.get("query");
      const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);
      const maxResults = Math.min(50, Math.max(1, parseInt(searchParams.get("maxResults") || "20", 10) || 20));

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

      if (!process.env.ALADIN_TTB_KEY) {
        if (process.env.NODE_ENV === "development") {
          const mockResponse: AladinSearchResponse = {
            version: "20131101",
            title: "알라딘 검색결과 (Mock)",
            link: "https://www.aladin.co.kr",
            pubDate: new Date().toISOString(),
            totalResults: 2,
            startIndex: 1,
            itemsPerPage: 20,
            query,
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
          return NextResponse.json(mockResponse);
        }
        return NextResponse.json(
          { error: "Book service temporarily unavailable" },
          { status: 503 }
        );
      }

      const items = await searchAladin(query, { maxResults, page });

      const data: AladinSearchResponse = {
        version: "20131101",
        title: `알라딘 검색결과 - ${query}`,
        link: "https://www.aladin.co.kr",
        pubDate: new Date().toISOString(),
        totalResults: items.length,
        startIndex: page,
        itemsPerPage: maxResults,
        query,
        searchCategoryId: 0,
        searchCategoryName: "전체",
        item: items,
      };

      return NextResponse.json(data);
    },
    { key: "search", limit: 30, windowSeconds: 60 }
  );
}

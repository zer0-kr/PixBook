import { NextRequest, NextResponse } from "next/server";
import { withAuthAndRateLimit } from "@/lib/api/auth";
import { lookupAladin } from "@/lib/aladin/api";
import type { AladinSearchResponse } from "@/lib/aladin/types";

export const revalidate = 86400; // 24 hours cache

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ isbn: string }> }
) {
  return withAuthAndRateLimit(
    async () => {
      const { isbn } = await params;

      if (!isbn) {
        return NextResponse.json(
          { error: "isbn parameter is required" },
          { status: 400 }
        );
      }

      if (!/^\d{13}$/.test(isbn)) {
        return NextResponse.json(
          { error: "Invalid ISBN13 format" },
          { status: 400 }
        );
      }

      const ttbKey = process.env.ALADIN_TTB_KEY;

      if (!ttbKey) {
        if (process.env.NODE_ENV === "development") {
          // Mock data only available in development
          const mockResponse: AladinSearchResponse = {
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
                isbn13: isbn,
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
          return NextResponse.json(mockResponse);
        }
        return NextResponse.json(
          { error: "Book service temporarily unavailable" },
          { status: 503 }
        );
      }

      const item = await lookupAladin(isbn);
      if (!item) {
        return NextResponse.json(
          { error: "No book found" },
          { status: 404 }
        );
      }

      const data: AladinSearchResponse = {
        version: "20131101",
        title: "",
        link: "",
        pubDate: "",
        totalResults: 1,
        startIndex: 1,
        itemsPerPage: 1,
        query: "",
        searchCategoryId: 0,
        searchCategoryName: "",
        item: [item],
      };
      return NextResponse.json(data);
    },
    { key: "isbn", limit: 30, windowSeconds: 60 }
  );
}

import { NextRequest, NextResponse } from "next/server";
import { authenticateApiRequest } from "@/lib/api/auth";
import { checkRateLimit } from "@/lib/rate-limit";

interface ExportRow {
  제목: string;
  저자: string;
  ISBN: string;
  페이지수: number;
  상태: string;
  평점: number | null;
  한줄평: string;
  시작일: string;
  완료일: string;
}

function escapeCsvFormula(str: string): string {
  if (/^[=+\-@\t\r]/.test(str)) return `'${str}`;
  return str;
}

const STATUS_LABELS: Record<string, string> = {
  want_to_read: "읽고 싶은",
  reading: "읽는 중",
  completed: "완독",
  dropped: "중단",
};

export async function GET(request: NextRequest) {
  const auth = await authenticateApiRequest();
  if (auth.response) return auth.response;

  const { allowed } = checkRateLimit(`export:${auth.user.id}`, {
    limit: 5,
    windowSeconds: 60,
  });
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: { "Retry-After": "60" } }
    );
  }

  const format = request.nextUrl.searchParams.get("format") ?? "json";

  if (format !== "csv" && format !== "json") {
    return NextResponse.json(
      { error: "Invalid format. Use csv or json." },
      { status: 400 }
    );
  }

  // Fetch all user_books with book data
  const { data, error } = await auth.supabase
    .from("user_books")
    .select("*, book:books(*)")
    .eq("user_id", auth.user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }

  const rows: ExportRow[] = (data ?? []).map((row) => {
    const book = row.book as {
      title?: string;
      author?: string;
      isbn13?: string;
      page_count?: number;
    } | null;

    return {
      제목: book?.title ?? "",
      저자: book?.author ?? "",
      ISBN: book?.isbn13 ?? "",
      페이지수: book?.page_count ?? 0,
      상태: STATUS_LABELS[row.reading_status] ?? row.reading_status,
      평점: row.rating,
      한줄평: row.one_line_review ?? "",
      시작일: row.start_date ?? "",
      완료일: row.end_date ?? "",
    };
  });

  if (format === "json") {
    return new NextResponse(JSON.stringify(rows, null, 2), {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Disposition": `attachment; filename="booklog-export-${new Date().toISOString().split("T")[0]}.json"`,
      },
    });
  }

  // CSV format
  const headers = [
    "제목",
    "저자",
    "ISBN",
    "페이지수",
    "상태",
    "평점",
    "한줄평",
    "시작일",
    "완료일",
  ];

  const csvRows = [
    headers.join(","),
    ...rows.map((row) =>
      headers
        .map((h) => {
          const value = row[h as keyof ExportRow];
          const raw = value === null || value === undefined ? "" : String(value);
          const str = escapeCsvFormula(raw);
          // Escape quotes and wrap in quotes if contains comma, quote, or newline
          if (str.includes(",") || str.includes('"') || str.includes("\n") || str.includes("\t") || str.includes("\r")) {
            return `"${str.replace(/"/g, '""')}"`;
          }
          return str;
        })
        .join(",")
    ),
  ];

  // Add BOM for Excel UTF-8 compatibility
  const bom = "\uFEFF";
  const csvContent = bom + csvRows.join("\n");

  return new NextResponse(csvContent, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="booklog-export-${new Date().toISOString().split("T")[0]}.csv"`,
    },
  });
}

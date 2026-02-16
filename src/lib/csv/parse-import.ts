export interface ImportRow {
  title: string;
  author: string;
  publisher: string;
  status: string;
  createdAt: string;
  startDate: string;
  endDate: string;
  droppedDate: string;
  rating: number;
}

export interface ImportSummary {
  total: number;
  completed: number;
  reading: number;
  wantToRead: number;
  dropped: number;
}

function parseCsvLine(line: string): string[] {
  const fields: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"' && line[i + 1] === '"') {
        current += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        current += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ",") {
        fields.push(current);
        current = "";
      } else {
        current += ch;
      }
    }
  }
  fields.push(current);
  return fields;
}

export function parseBooklogCsv(text: string): ImportRow[] {
  // Remove BOM
  const clean = text.replace(/^\uFEFF/, "");
  const lines = clean.split(/\r?\n/).filter((l) => l.trim());

  if (lines.length < 2) return [];

  // Validate header
  const header = lines[0];
  if (!header.includes("제목") || !header.includes("독서상태")) {
    throw new Error("북적북적 CSV 형식이 아닙니다.");
  }

  const rows: ImportRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const fields = parseCsvLine(lines[i]);
    if (fields.length < 10) continue;

    const title = fields[1]?.trim();
    if (!title) continue;

    rows.push({
      title,
      author: fields[2]?.trim() || "",
      publisher: fields[3]?.trim() || "",
      status: fields[4]?.trim() || "",
      createdAt: fields[5]?.trim() || "",
      startDate: fields[6]?.trim() || "",
      endDate: fields[7]?.trim() || "",
      droppedDate: fields[8]?.trim() || "",
      rating: parseFloat(fields[9]) || 0,
    });
  }

  return rows;
}

export function summarizeImport(rows: ImportRow[]): ImportSummary {
  let completed = 0;
  let reading = 0;
  let wantToRead = 0;
  let dropped = 0;

  for (const row of rows) {
    if (row.droppedDate) {
      dropped++;
    } else if (row.status === "읽은 책") {
      completed++;
    } else if (row.status === "읽고 있는 책") {
      reading++;
    } else if (row.status === "읽고 싶은 책") {
      wantToRead++;
    }
  }

  return { total: rows.length, completed, reading, wantToRead, dropped };
}

"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { PixelCard, PixelButton } from "@/components/ui";
import { useToast } from "@/components/ui/PixelToast";
import { logError } from "@/lib/logger";
import {
  parseBooklogCsv,
  summarizeImport,
  type ImportRow,
  type ImportSummary,
} from "@/lib/csv/parse-import";

export default function DataImportSection() {
  const [importRows, setImportRows] = useState<ImportRow[] | null>(null);
  const [importSummary, setImportSummary] = useState<ImportSummary | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const router = useRouter();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const text = ev.target?.result as string;
        const rows = parseBooklogCsv(text);
        if (rows.length === 0) {
          toast("error", "가져올 데이터가 없습니다");
          return;
        }
        setImportRows(rows);
        setImportSummary(summarizeImport(rows));
      } catch (err) {
        logError("CSV parse error:", err);
        toast("error", "CSV 파일을 읽을 수 없습니다");
      }
    };
    reader.onerror = () => {
      toast("error", "파일을 읽을 수 없습니다");
    };
    reader.readAsText(file, "utf-8");
    // Reset so same file can be selected again
    e.target.value = "";
  };

  const handleImport = async () => {
    if (!importRows) return;
    setIsImporting(true);
    try {
      const res = await fetch("/api/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rows: importRows }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast("error", data.error || "가져오기 실패");
        return;
      }
      toast(
        "success",
        `가져오기 완료: ${data.imported}권 추가, ${data.skipped}권 건너뜀`
      );
      setImportRows(null);
      setImportSummary(null);
      router.refresh();
    } catch (err) {
      logError("Import error:", err);
      toast("error", "가져오기 중 오류가 발생했습니다");
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <PixelCard hoverable={false}>
      <h3 className="font-pixel text-xs text-brown mb-4">데이터 가져오기</h3>
      <p className="text-xs text-brown-lighter mb-3">
        북적북적 등 다른 서비스에서 내보낸 CSV 파일을 가져올 수 있습니다.
      </p>
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={handleFileSelect}
        className="hidden"
      />
      {!importSummary ? (
        <PixelButton
          variant="secondary"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
        >
          CSV 파일 선택
        </PixelButton>
      ) : (
        <div className="space-y-3">
          <div className="pixel-border bg-cream-dark p-3 text-xs text-brown space-y-1">
            <div className="font-bold">총 {importSummary.total}권</div>
            <div className="text-brown-lighter">
              완독 {importSummary.completed} / 읽는중 {importSummary.reading} / 읽고싶은 {importSummary.wantToRead}
              {importSummary.dropped > 0 && ` / 중단 ${importSummary.dropped}`}
            </div>
          </div>
          <div className="flex gap-2">
            <PixelButton
              size="sm"
              onClick={handleImport}
              disabled={isImporting}
            >
              {isImporting ? "가져오는 중..." : "가져오기"}
            </PixelButton>
            <PixelButton
              variant="secondary"
              size="sm"
              onClick={() => {
                setImportRows(null);
                setImportSummary(null);
              }}
              disabled={isImporting}
            >
              취소
            </PixelButton>
          </div>
        </div>
      )}
    </PixelCard>
  );
}

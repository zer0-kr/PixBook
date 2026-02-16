"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { PixelCard, PixelInput, PixelButton } from "@/components/ui";
import { useToast } from "@/components/ui/PixelToast";
import { createClient } from "@/lib/supabase/client";
import { logError } from "@/lib/logger";
import { formatHeight } from "@/lib/tower/calculator";
import {
  parseBooklogCsv,
  summarizeImport,
  type ImportRow,
  type ImportSummary,
} from "@/lib/csv/parse-import";
import type { Profile, Character } from "@/types";

interface ProfilePageViewProps {
  profile: Profile;
  email: string;
  activeCharacter: Character | null;
}

export default function ProfilePageView({
  profile,
  email,
  activeCharacter,
}: ProfilePageViewProps) {
  const [nickname, setNickname] = useState(profile.nickname ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [importRows, setImportRows] = useState<ImportRow[] | null>(null);
  const [importSummary, setImportSummary] = useState<ImportSummary | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const router = useRouter();

  const handleSaveNickname = async () => {
    if (!nickname.trim()) {
      toast("error", "닉네임을 입력해주세요");
      return;
    }

    setIsSaving(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("profiles")
        .update({ nickname: nickname.trim() })
        .eq("id", profile.id);

      if (error) throw error;
      toast("success", "닉네임이 저장되었습니다");
      router.refresh();
    } catch (err) {
      logError("Error saving nickname:", err);
      toast("error", "닉네임 저장에 실패했습니다");
    } finally {
      setIsSaving(false);
    }
  };

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

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/login");
    } catch (err) {
      logError("Logout error:", err);
      toast("error", "로그아웃에 실패했습니다");
      setIsLoggingOut(false);
    }
  };

  const joinedDate = new Date(profile.created_at).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-6">
      {/* Nickname Section */}
      <PixelCard hoverable={false}>
        <h3 className="font-pixel text-xs text-brown mb-4">닉네임</h3>
        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <PixelInput
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="닉네임을 입력하세요"
              maxLength={20}
            />
          </div>
          <PixelButton
            onClick={handleSaveNickname}
            disabled={isSaving}
            size="md"
          >
            {isSaving ? "저장 중..." : "저장"}
          </PixelButton>
        </div>
      </PixelCard>

      {/* Account Info */}
      <PixelCard hoverable={false}>
        <h3 className="font-pixel text-xs text-brown mb-4">계정 정보</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-brown-lighter">이메일</span>
            <span className="text-brown font-bold">{email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-brown-lighter">가입일</span>
            <span className="text-brown font-bold">{joinedDate}</span>
          </div>
        </div>
      </PixelCard>

      {/* Tower Stats Summary */}
      <PixelCard hoverable={false}>
        <h3 className="font-pixel text-xs text-brown mb-4">독서 현황</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-pixel text-pixel-green">
              {formatHeight(profile.tower_height_cm)}
            </div>
            <div className="text-[10px] text-brown-lighter mt-1">탑 높이</div>
          </div>
          <div>
            <div className="text-lg font-pixel text-pixel-blue">
              {profile.total_books_completed}권
            </div>
            <div className="text-[10px] text-brown-lighter mt-1">완독</div>
          </div>
          <div>
            <div className="text-lg font-pixel text-pixel-purple">
              {profile.total_pages_read.toLocaleString()}p
            </div>
            <div className="text-[10px] text-brown-lighter mt-1">
              총 페이지
            </div>
          </div>
        </div>
      </PixelCard>

      {/* Active Character */}
      {activeCharacter && (
        <PixelCard hoverable={false}>
          <h3 className="font-pixel text-xs text-brown mb-4">활성 캐릭터</h3>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 border-3 border-brown bg-cream-dark flex items-center justify-center pixel-art">
              {activeCharacter.sprite_url ? (
                <img
                  src={activeCharacter.sprite_url}
                  alt={activeCharacter.name}
                  className="w-12 h-12 pixel-art"
                />
              ) : (
                <span className="text-2xl">🐾</span>
              )}
            </div>
            <div>
              <div className="font-bold text-brown">
                {activeCharacter.name}
              </div>
              <div className="text-xs text-brown-lighter">
                {activeCharacter.description}
              </div>
            </div>
          </div>
        </PixelCard>
      )}

      {/* Data Import */}
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

      {/* Data Export */}
      <PixelCard hoverable={false}>
        <h3 className="font-pixel text-xs text-brown mb-4">데이터 내보내기</h3>
        <p className="text-xs text-brown-lighter mb-3">
          내 서재 데이터를 CSV 또는 JSON 형식으로 내보낼 수 있습니다.
        </p>
        <div className="flex gap-2">
          <PixelButton
            variant="secondary"
            size="sm"
            onClick={() => window.open("/api/export?format=csv", "_blank")}
          >
            CSV 다운로드
          </PixelButton>
          <PixelButton
            variant="secondary"
            size="sm"
            onClick={() => window.open("/api/export?format=json", "_blank")}
          >
            JSON 다운로드
          </PixelButton>
        </div>
      </PixelCard>

      {/* Logout */}
      <div className="flex justify-center pt-4">
        <PixelButton
          variant="danger"
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          {isLoggingOut ? "로그아웃 중..." : "로그아웃"}
        </PixelButton>
      </div>
    </div>
  );
}

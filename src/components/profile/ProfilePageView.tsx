"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PixelCard, PixelInput, PixelButton, PixelModal } from "@/components/ui";
import { useToast } from "@/components/ui/PixelToast";
import { createClient } from "@/lib/supabase/client";
import { logError } from "@/lib/logger";
import EnrichmentProgress from "./EnrichmentProgress";
import DataImportSection from "./DataImportSection";
import type { Profile } from "@/types";

interface ProfilePageViewProps {
  profile: Profile;
  email: string;
}

export default function ProfilePageView({
  profile,
  email,
}: ProfilePageViewProps) {
  const [nickname, setNickname] = useState(profile.nickname ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
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

  const handleDeleteAll = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch("/api/library/delete-all", { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "삭제 실패");
      }
      toast("success", "서재 데이터가 모두 삭제되었습니다");
      setIsDeleteModalOpen(false);
      router.refresh();
    } catch (err) {
      logError("Error deleting all library data:", err);
      toast("error", "서재 데이터 삭제에 실패했습니다");
    } finally {
      setIsDeleting(false);
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

      {/* Data Import */}
      <DataImportSection />

      {/* Cover Enrichment */}
      <PixelCard hoverable={false}>
        <h3 className="font-pixel text-xs text-brown mb-4">표지 보강</h3>
        <p className="text-xs text-brown-lighter mb-3">
          CSV로 가져온 책 중 표지가 없는 항목을 알라딘에서 검색하여 보강합니다.
        </p>
        <EnrichmentProgress />
      </PixelCard>

      {/* Data Delete */}
      <PixelCard hoverable={false}>
        <h3 className="font-pixel text-xs text-brown mb-4">데이터 삭제</h3>
        <p className="text-xs text-brown-lighter mb-3">
          서재에 등록된 모든 책과 메모를 삭제합니다. 이 작업은 되돌릴 수 없습니다.
        </p>
        <PixelButton
          variant="danger"
          size="sm"
          onClick={() => setIsDeleteModalOpen(true)}
        >
          서재 데이터 전체 삭제
        </PixelButton>
      </PixelCard>

      <PixelModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="서재 데이터 전체 삭제"
      >
        <div className="space-y-4">
          <p className="text-sm text-brown">
            등록된 모든 책, 메모, 독서 기록이 삭제됩니다. 이 작업은 되돌릴 수
            없습니다.
          </p>
          <p className="text-sm text-brown font-bold">
            정말 삭제하시겠습니까?
          </p>
          <div className="flex gap-2 justify-end">
            <PixelButton
              variant="secondary"
              size="sm"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={isDeleting}
            >
              취소
            </PixelButton>
            <PixelButton
              variant="danger"
              size="sm"
              onClick={handleDeleteAll}
              disabled={isDeleting}
            >
              {isDeleting ? "삭제 중..." : "전체 삭제"}
            </PixelButton>
          </div>
        </div>
      </PixelModal>

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

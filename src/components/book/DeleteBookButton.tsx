"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { PixelButton, PixelModal } from "@/components/ui";
import { useToast } from "@/components/ui/PixelToast";
import { createClient } from "@/lib/supabase/client";
import { logError } from "@/lib/logger";

interface DeleteBookButtonProps {
  userBookId: string;
}

export default function DeleteBookButton({ userBookId }: DeleteBookButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleDelete = useCallback(async () => {
    setIsDeleting(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("user_books")
        .delete()
        .eq("id", userBookId);

      if (error) throw error;

      toast("success", "서재에서 삭제되었습니다");
      router.push("/library");
    } catch (err) {
      logError("Error deleting book:", err);
      toast("error", "삭제에 실패했습니다");
      setIsDeleting(false);
    }
  }, [userBookId, router, toast]);

  return (
    <>
      <PixelButton
        variant="danger"
        size="sm"
        onClick={() => setIsOpen(true)}
      >
        서재에서 삭제
      </PixelButton>

      <PixelModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="책 삭제"
      >
        <div className="space-y-4">
          <p className="text-sm text-brown">
            정말 삭제하시겠습니까? 이 책에 대한 모든 메모도 함께 삭제됩니다.
          </p>
          <div className="flex gap-2 justify-end">
            <PixelButton
              variant="secondary"
              size="sm"
              onClick={() => setIsOpen(false)}
              disabled={isDeleting}
            >
              취소
            </PixelButton>
            <PixelButton
              variant="danger"
              size="sm"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "삭제 중..." : "삭제"}
            </PixelButton>
          </div>
        </div>
      </PixelModal>
    </>
  );
}

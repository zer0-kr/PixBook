"use client";

import { useState, useCallback } from "react";
import { PixelButton } from "@/components/ui";
import { useToast } from "@/components/ui/PixelToast";
import { createClient } from "@/lib/supabase/client";
import type { ReadingNote } from "@/types";

function parsePageNumber(value: string): number | null {
  if (!value.trim()) return null;
  const parsed = parseInt(value, 10);
  if (Number.isNaN(parsed) || parsed < 1) return null;
  return parsed;
}

interface ReadingNotesProps {
  userBookId: string;
  initialNotes: ReadingNote[];
}

export default function ReadingNotes({
  userBookId,
  initialNotes,
}: ReadingNotesProps) {
  const [notes, setNotes] = useState<ReadingNote[]>(initialNotes);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form state for new note
  const [newContent, setNewContent] = useState("");
  const [newPageNumber, setNewPageNumber] = useState("");

  // Form state for editing note
  const [editContent, setEditContent] = useState("");
  const [editPageNumber, setEditPageNumber] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { toast } = useToast();

  // Add note
  const handleAddNote = useCallback(async () => {
    if (!newContent.trim()) {
      toast("error", "메모 내용을 입력해주세요");
      return;
    }

    setIsSubmitting(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("reading_notes")
        .insert({
          user_book_id: userBookId,
          content: newContent.trim(),
          page_number: parsePageNumber(newPageNumber),
        })
        .select()
        .single();

      if (error) throw error;

      setNotes((prev) => [data, ...prev]);
      setNewContent("");
      setNewPageNumber("");
      setIsAdding(false);
      toast("success", "메모가 추가되었습니다");
    } catch {
      toast("error", "메모 추가에 실패했습니다");
    } finally {
      setIsSubmitting(false);
    }
  }, [userBookId, newContent, newPageNumber, toast]);

  // Start editing
  const handleStartEdit = useCallback((note: ReadingNote) => {
    setEditingId(note.id);
    setEditContent(note.content);
    setEditPageNumber(note.page_number?.toString() ?? "");
  }, []);

  // Save edit
  const handleSaveEdit = useCallback(
    async (noteId: string) => {
      if (!editContent.trim()) {
        toast("error", "메모 내용을 입력해주세요");
        return;
      }

      setIsSubmitting(true);
      try {
        const supabase = createClient();
        const { error } = await supabase
          .from("reading_notes")
          .update({
            content: editContent.trim(),
            page_number: parsePageNumber(editPageNumber),
          })
          .eq("id", noteId);

        if (error) throw error;

        setNotes((prev) =>
          prev.map((n) =>
            n.id === noteId
              ? {
                  ...n,
                  content: editContent.trim(),
                  page_number: parsePageNumber(editPageNumber),
                }
              : n
          )
        );
        setEditingId(null);
        toast("success", "메모가 수정되었습니다");
      } catch {
        toast("error", "메모 수정에 실패했습니다");
      } finally {
        setIsSubmitting(false);
      }
    },
    [editContent, editPageNumber, toast]
  );

  // Delete note
  const handleDelete = useCallback(
    async (noteId: string) => {
      setIsSubmitting(true);
      try {
        const supabase = createClient();
        const { error } = await supabase
          .from("reading_notes")
          .delete()
          .eq("id", noteId);

        if (error) throw error;

        setNotes((prev) => prev.filter((n) => n.id !== noteId));
        setDeletingId(null);
        toast("success", "메모가 삭제되었습니다");
      } catch {
        toast("error", "메모 삭제에 실패했습니다");
      } finally {
        setIsSubmitting(false);
      }
    },
    [toast]
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-pixel text-xs text-brown">
          독서 메모 ({notes.length})
        </h3>
        {!isAdding && (
          <PixelButton
            size="sm"
            variant="primary"
            onClick={() => setIsAdding(true)}
          >
            메모 추가
          </PixelButton>
        )}
      </div>

      {/* Add note form */}
      {isAdding && (
        <div className="pixel-card-static p-4 mb-4">
          <div className="space-y-3">
            <div>
              <label
                htmlFor="new-note-content"
                className="block text-sm font-bold text-brown mb-1"
              >
                내용
              </label>
              <textarea
                id="new-note-content"
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="메모를 입력하세요..."
                className="pixel-input w-full text-sm text-brown resize-none"
                rows={3}
              />
            </div>
            <div>
              <label
                htmlFor="new-note-page"
                className="block text-sm font-bold text-brown mb-1"
              >
                페이지 (선택)
              </label>
              <input
                id="new-note-page"
                type="number"
                value={newPageNumber}
                onChange={(e) => setNewPageNumber(e.target.value)}
                placeholder="페이지 번호"
                className="pixel-input w-24 text-sm text-brown"
                min={1}
              />
            </div>
            <div className="flex gap-2">
              <PixelButton
                size="sm"
                variant="primary"
                onClick={handleAddNote}
                disabled={isSubmitting}
              >
                {isSubmitting ? "저장 중..." : "저장"}
              </PixelButton>
              <PixelButton
                size="sm"
                variant="secondary"
                onClick={() => {
                  setIsAdding(false);
                  setNewContent("");
                  setNewPageNumber("");
                }}
              >
                취소
              </PixelButton>
            </div>
          </div>
        </div>
      )}

      {/* Notes list */}
      {notes.length === 0 ? (
        <p className="text-sm text-brown-lighter text-center py-8">
          아직 메모가 없습니다.
        </p>
      ) : (
        <div className="space-y-3">
          {notes.map((note) => (
            <div key={note.id} className="pixel-card-static p-3">
              {editingId === note.id ? (
                /* Edit form */
                <div className="space-y-3">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="pixel-input w-full text-sm text-brown resize-none"
                    rows={3}
                  />
                  <input
                    type="number"
                    value={editPageNumber}
                    onChange={(e) => setEditPageNumber(e.target.value)}
                    placeholder="페이지 번호"
                    className="pixel-input w-24 text-sm text-brown"
                    min={1}
                  />
                  <div className="flex gap-2">
                    <PixelButton
                      size="sm"
                      variant="primary"
                      onClick={() => handleSaveEdit(note.id)}
                      disabled={isSubmitting}
                    >
                      저장
                    </PixelButton>
                    <PixelButton
                      size="sm"
                      variant="secondary"
                      onClick={() => setEditingId(null)}
                    >
                      취소
                    </PixelButton>
                  </div>
                </div>
              ) : deletingId === note.id ? (
                /* Delete confirmation */
                <div>
                  <p className="text-sm text-brown mb-3">
                    정말 이 메모를 삭제하시겠습니까?
                  </p>
                  <div className="flex gap-2">
                    <PixelButton
                      size="sm"
                      variant="danger"
                      onClick={() => handleDelete(note.id)}
                      disabled={isSubmitting}
                    >
                      삭제
                    </PixelButton>
                    <PixelButton
                      size="sm"
                      variant="secondary"
                      onClick={() => setDeletingId(null)}
                    >
                      취소
                    </PixelButton>
                  </div>
                </div>
              ) : (
                /* Display mode */
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm text-brown whitespace-pre-wrap flex-1">
                      {note.content}
                    </p>
                    <div className="flex gap-1 shrink-0">
                      <button
                        onClick={() => handleStartEdit(note)}
                        className="text-xs text-pixel-blue hover:underline font-bold"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => setDeletingId(note.id)}
                        className="text-xs text-pixel-red hover:underline font-bold"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-2 text-xs text-brown-lighter">
                    {note.page_number && (
                      <span>p.{note.page_number}</span>
                    )}
                    <span>
                      {new Date(note.created_at).toLocaleDateString("ko-KR")}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

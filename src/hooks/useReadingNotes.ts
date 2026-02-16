import { useState, useCallback } from "react";
import { useToast } from "@/components/ui/PixelToast";
import { createClient } from "@/lib/supabase/client";
import { logError } from "@/lib/logger";
import type { ReadingNote } from "@/types";

const MAX_PAGE_NUMBER = 99999;

function parsePageNumber(value: string): number | null {
  if (!value.trim()) return null;
  const parsed = parseInt(value, 10);
  if (Number.isNaN(parsed) || parsed < 1 || parsed > MAX_PAGE_NUMBER) return null;
  return parsed;
}

interface UseReadingNotesParams {
  userBookId: string;
  initialNotes: ReadingNote[];
}

export function useReadingNotes({ userBookId, initialNotes }: UseReadingNotesParams) {
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

  const openAddForm = useCallback(() => setIsAdding(true), []);

  const cancelAdd = useCallback(() => {
    setIsAdding(false);
    setNewContent("");
    setNewPageNumber("");
  }, []);

  const cancelEdit = useCallback(() => setEditingId(null), []);

  const startDelete = useCallback((noteId: string) => setDeletingId(noteId), []);

  const cancelDelete = useCallback(() => setDeletingId(null), []);

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
    } catch (err) {
      logError("Error adding note:", err);
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
      } catch (err) {
        logError("Error saving note edit:", err);
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
      } catch (err) {
        logError("Error deleting note:", err);
        toast("error", "메모 삭제에 실패했습니다");
      } finally {
        setIsSubmitting(false);
      }
    },
    [toast]
  );

  return {
    notes,
    isSubmitting,
    // Add
    isAdding,
    newContent,
    newPageNumber,
    setNewContent,
    setNewPageNumber,
    openAddForm,
    cancelAdd,
    handleAddNote,
    // Edit
    editingId,
    editContent,
    editPageNumber,
    setEditContent,
    setEditPageNumber,
    handleStartEdit,
    handleSaveEdit,
    cancelEdit,
    // Delete
    deletingId,
    startDelete,
    cancelDelete,
    handleDelete,
  };
}

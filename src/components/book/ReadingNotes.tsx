"use client";

import { PixelButton } from "@/components/ui";
import { useReadingNotes } from "@/hooks/useReadingNotes";
import NoteItem from "./NoteItem";
import type { ReadingNote } from "@/types";

interface ReadingNotesProps {
  userBookId: string;
  initialNotes: ReadingNote[];
}

export default function ReadingNotes({
  userBookId,
  initialNotes,
}: ReadingNotesProps) {
  const {
    notes,
    isSubmitting,
    isAdding,
    newContent,
    newPageNumber,
    setNewContent,
    setNewPageNumber,
    openAddForm,
    cancelAdd,
    handleAddNote,
    editingId,
    editContent,
    editPageNumber,
    setEditContent,
    setEditPageNumber,
    handleStartEdit,
    handleSaveEdit,
    cancelEdit,
    deletingId,
    startDelete,
    cancelDelete,
    handleDelete,
  } = useReadingNotes({ userBookId, initialNotes });

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
            onClick={openAddForm}
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
                maxLength={2000}
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
                onClick={cancelAdd}
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
            <NoteItem
              key={note.id}
              note={note}
              isEditing={editingId === note.id}
              isDeleting={deletingId === note.id}
              isSubmitting={isSubmitting}
              editContent={editContent}
              editPageNumber={editPageNumber}
              onEditContentChange={setEditContent}
              onEditPageNumberChange={setEditPageNumber}
              onStartEdit={() => handleStartEdit(note)}
              onSaveEdit={() => handleSaveEdit(note.id)}
              onCancelEdit={cancelEdit}
              onStartDelete={() => startDelete(note.id)}
              onConfirmDelete={() => handleDelete(note.id)}
              onCancelDelete={cancelDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

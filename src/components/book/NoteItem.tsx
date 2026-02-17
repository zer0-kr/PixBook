import { PixelButton } from "@/components/ui";
import type { ReadingNote } from "@/types";

interface NoteItemProps {
  note: ReadingNote;
  isEditing: boolean;
  isDeleting: boolean;
  isSubmitting: boolean;
  editContent: string;
  editPageNumber: string;
  onEditContentChange: (value: string) => void;
  onEditPageNumberChange: (value: string) => void;
  onStartEdit: () => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onStartDelete: () => void;
  onConfirmDelete: () => void;
  onCancelDelete: () => void;
}

export default function NoteItem({
  note,
  isEditing,
  isDeleting,
  isSubmitting,
  editContent,
  editPageNumber,
  onEditContentChange,
  onEditPageNumberChange,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onStartDelete,
  onConfirmDelete,
  onCancelDelete,
}: NoteItemProps) {
  if (isEditing) {
    return (
      <div className="pixel-card-static p-3">
        <div className="space-y-3">
          <textarea
            value={editContent}
            onChange={(e) => onEditContentChange(e.target.value)}
            className="pixel-input w-full text-sm text-brown resize-none"
            rows={3}
            maxLength={2000}
          />
          <input
            type="number"
            value={editPageNumber}
            onChange={(e) => onEditPageNumberChange(e.target.value)}
            placeholder="페이지 번호"
            className="pixel-input w-24 text-sm text-brown"
            min={1}
          />
          <div className="flex gap-2">
            <PixelButton
              size="sm"
              variant="primary"
              onClick={onSaveEdit}
              disabled={isSubmitting}
            >
              저장
            </PixelButton>
            <PixelButton
              size="sm"
              variant="secondary"
              onClick={onCancelEdit}
            >
              취소
            </PixelButton>
          </div>
        </div>
      </div>
    );
  }

  if (isDeleting) {
    return (
      <div className="pixel-card-static p-3">
        <p className="text-sm text-brown mb-3">
          정말 이 메모를 삭제하시겠습니까?
        </p>
        <div className="flex gap-2">
          <PixelButton
            size="sm"
            variant="danger"
            onClick={onConfirmDelete}
            disabled={isSubmitting}
          >
            삭제
          </PixelButton>
          <PixelButton
            size="sm"
            variant="secondary"
            onClick={onCancelDelete}
          >
            취소
          </PixelButton>
        </div>
      </div>
    );
  }

  return (
    <div className="pixel-card-static p-3">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm text-brown whitespace-pre-wrap break-words flex-1">
          {note.content}
        </p>
        <div className="flex gap-1 shrink-0">
          <button
            onClick={onStartEdit}
            className="text-xs text-pixel-blue hover:underline font-bold"
          >
            수정
          </button>
          <button
            onClick={onStartDelete}
            className="text-xs text-pixel-red hover:underline font-bold"
          >
            삭제
          </button>
        </div>
      </div>
      <div className="flex items-center gap-3 mt-2 text-xs text-brown-lighter">
        {note.page_number != null && (
          <span>p.{note.page_number}</span>
        )}
        <span>
          {new Date(note.created_at).toLocaleDateString("ko-KR")}
        </span>
      </div>
    </div>
  );
}

import { AdminDialogHeroEditor } from '@/components/admin/AdminDialogHeroEditor';
import type { HeroContentTable } from '@/components/content/ContentHeroImageEditor';

interface AdminContentCoverImageSectionProps {
  table: HeroContentTable;
  recordId: string;
  imageUrl: string | null;
  onImageUrlChange: (url: string | null) => void;
  onPersisted: () => void;
  title?: string;
  coverZoom?: number | null;
  coverFocusX?: number | null;
  coverFocusY?: number | null;
}

/** @deprecated Use AdminDialogHeroEditor — kept for existing imports. */
export function AdminContentCoverImageSection({
  table,
  recordId,
  imageUrl,
  onImageUrlChange,
  onPersisted,
  title = 'Content',
  coverZoom,
  coverFocusX,
  coverFocusY,
}: AdminContentCoverImageSectionProps) {
  return (
    <AdminDialogHeroEditor
      table={table}
      recordId={recordId}
      title={title}
      imageUrl={imageUrl}
      onImageUrlChange={onImageUrlChange}
      onPersisted={onPersisted}
      coverZoom={coverZoom}
      coverFocusX={coverFocusX}
      coverFocusY={coverFocusY}
    />
  );
}

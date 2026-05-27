import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  ContentHeroImageEditor,
  type HeroContentTable,
} from '@/components/content/ContentHeroImageEditor';

export interface AdminDialogHeroEditorProps {
  table: HeroContentTable;
  recordId: string;
  title: string;
  imageUrl: string | null;
  onImageUrlChange: (url: string | null) => void;
  onPersisted: () => void;
  coverZoom?: number | null;
  coverFocusX?: number | null;
  coverFocusY?: number | null;
  /** Optional paste URL — applied when the admin clicks Update on the parent form. */
  showUrlField?: boolean;
}

/**
 * Full hero block for admin Content Management edit dialogs — same upload/replace
 * experience as public detail pages, plus optional URL field for admins.
 */
export function AdminDialogHeroEditor({
  table,
  recordId,
  title,
  imageUrl,
  onImageUrlChange,
  onPersisted,
  coverZoom,
  coverFocusX,
  coverFocusY,
  showUrlField = true,
}: AdminDialogHeroEditorProps) {
  return (
    <div className="space-y-3" data-testid="admin-dialog-hero-editor">
      <ContentHeroImageEditor
        table={table}
        recordId={recordId}
        title={title}
        imageUrl={imageUrl}
        canEdit
        compact
        allowRemove
        coverZoom={coverZoom}
        coverFocusX={coverFocusX}
        coverFocusY={coverFocusY}
        onImageUrlChange={onImageUrlChange}
        onSaved={onPersisted}
        className="mb-0"
        emptyStateHint="Upload a cover image — it appears on the public detail page and in listings."
      />
      {showUrlField ? (
        <div className="rounded-lg border border-border bg-muted/30 px-3 py-3">
          <Label htmlFor={`admin-cover-url-${recordId}`} className="text-xs text-muted-foreground">
            Or paste image URL (saved when you click Update below)
          </Label>
          <Input
            id={`admin-cover-url-${recordId}`}
            type="url"
            className="mt-1 font-mono text-sm"
            placeholder="https://..."
            value={imageUrl ?? ''}
            onChange={(e) => onImageUrlChange(e.target.value.trim() || null)}
          />
        </div>
      ) : null}
    </div>
  );
}

import { useRef, useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { ImagePlus, Loader2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { uploadCoverImage } from '@/lib/coverImageUpload';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const MAX_BYTES = 10 * 1024 * 1024;

/** Matches DB check `events_cover_zoom_range` */
const ZOOM_MIN = 0.25;
const ZOOM_MAX = 3;

export type HeroContentTable = 'events' | 'business' | 'local_resources' | 'news';

function clamp(n: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, n));
}

export interface ContentHeroImageEditorProps {
  table: HeroContentTable;
  recordId: string;
  title: string;
  imageUrl: string | null | undefined;
  canEdit: boolean;
  /** React Query keys to invalidate after save (e.g. ['business', id]). */
  invalidateQueryKeys?: (string | readonly unknown[])[];
  coverZoom?: number | null;
  coverFocusX?: number | null;
  coverFocusY?: number | null;
  /** Shown in the empty upload drop zone. */
  emptyStateHint?: string;
  /** Shorter hero for admin edit dialogs. */
  compact?: boolean;
  /** Show remove cover control (admin dialogs). */
  allowRemove?: boolean;
  /** Called after cover URL changes in the database. */
  onImageUrlChange?: (url: string | null) => void;
  /** Called after any successful cover save (upload, remove, framing). */
  onSaved?: () => void;
  className?: string;
}

const supportsFraming = (table: HeroContentTable) => table === 'events';

export function ContentHeroImageEditor({
  table,
  recordId,
  title,
  imageUrl,
  canEdit,
  invalidateQueryKeys = [],
  coverZoom = 1,
  coverFocusX = 50,
  coverFocusY = 50,
  emptyStateHint = 'Upload a hero image to display at the top of this page.',
  compact = false,
  allowRemove = false,
  onImageUrlChange,
  onSaved,
  className,
}: ContentHeroImageEditorProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [savingFraming, setSavingFraming] = useState(false);
  const framing = supportsFraming(table);

  const [draftZoom, setDraftZoom] = useState(() =>
    clamp(Number(coverZoom) || 1, ZOOM_MIN, ZOOM_MAX)
  );
  const [draftFocusX, setDraftFocusX] = useState(() =>
    clamp(Number(coverFocusX) || 50, 0, 100)
  );
  const [draftFocusY, setDraftFocusY] = useState(() =>
    clamp(Number(coverFocusY) || 50, 0, 100)
  );

  useEffect(() => {
    setDraftZoom(clamp(Number(coverZoom) || 1, ZOOM_MIN, ZOOM_MAX));
    setDraftFocusX(clamp(Number(coverFocusX) || 50, 0, 100));
    setDraftFocusY(clamp(Number(coverFocusY) || 50, 0, 100));
  }, [recordId, coverZoom, coverFocusX, coverFocusY]);

  const defaultListKey =
    table === 'events'
      ? 'events'
      : table === 'business'
        ? 'business'
        : table === 'news'
          ? 'news'
          : 'local-resources';

  const afterPersist = async (url: string | null) => {
    onImageUrlChange?.(url);
    const keys = [...invalidateQueryKeys, defaultListKey];
    await Promise.all(
      keys.map((key) =>
        queryClient.invalidateQueries({
          queryKey: Array.isArray(key) ? key : [key],
        })
      )
    );
    onSaved?.();
  };

  const heroFrameStyle = compact
    ? {
        height: 'clamp(10rem, min(28vw, 36vh), 18rem)',
        minHeight: 'min(12rem, 50vw)',
      }
    : {
        height: 'clamp(12rem, min(36vw, 52vh), 32rem)',
        minHeight: 'min(28rem, 88vw)',
      };

  const emptyDropStyle = compact
    ? {
        minHeight: 'min(12rem, 45vw)',
        height: 'clamp(10rem, min(28vw, 32vh), 16rem)',
      }
    : {
        minHeight: 'min(16rem, 55vw)',
        height: 'clamp(12rem, min(36vw, 40vh), 20rem)',
      };

  const pickFile = () => inputRef.current?.click();

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || !user) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please choose an image file.');
      return;
    }
    if (file.size > MAX_BYTES) {
      toast.error('Image must be 10MB or smaller.');
      return;
    }

    setUploading(true);
    try {
      const publicUrl = await uploadCoverImage(file, user.id);

      const updatePayload: Record<string, unknown> = {
        image_url: publicUrl,
        updated_at: new Date().toISOString(),
      };
      if (framing) {
        updatePayload.cover_zoom = 1;
        updatePayload.cover_focus_x = 50;
        updatePayload.cover_focus_y = 50;
        setDraftZoom(1);
        setDraftFocusX(50);
        setDraftFocusY(50);
      }

      const { error } = await supabase
        .from(table)
        .update(updatePayload)
        .eq('id', recordId);

      if (error) throw error;

      await afterPersist(publicUrl);
      toast.success('Cover image updated.');
    } catch (err) {
      console.error(err);
      toast.error('Failed to upload cover image.');
    } finally {
      setUploading(false);
    }
  };

  const removeCover = async () => {
    if (!user) return;
    setRemoving(true);
    try {
      const updatePayload: Record<string, unknown> = {
        image_url: null,
        updated_at: new Date().toISOString(),
      };
      if (framing) {
        updatePayload.cover_zoom = 1;
        updatePayload.cover_focus_x = 50;
        updatePayload.cover_focus_y = 50;
        setDraftZoom(1);
        setDraftFocusX(50);
        setDraftFocusY(50);
      }

      const { error } = await supabase.from(table).update(updatePayload).eq('id', recordId);
      if (error) throw error;

      await afterPersist(null);
      toast.success('Cover image removed.');
    } catch (err) {
      console.error(err);
      toast.error('Failed to remove cover image.');
    } finally {
      setRemoving(false);
    }
  };

  const saveFraming = async () => {
    if (!framing) return;
    setSavingFraming(true);
    try {
      const { error } = await supabase
        .from('events')
        .update({
          cover_zoom: clamp(draftZoom, ZOOM_MIN, ZOOM_MAX),
          cover_focus_x: clamp(draftFocusX, 0, 100),
          cover_focus_y: clamp(draftFocusY, 0, 100),
          updated_at: new Date().toISOString(),
        })
        .eq('id', recordId);

      if (error) throw error;

      await afterPersist(imageUrl ?? null);
      toast.success('Cover framing saved.');
    } catch (err) {
      console.error(err);
      toast.error('Failed to save framing.');
    } finally {
      setSavingFraming(false);
    }
  };

  const resetFramingAndSave = async () => {
    if (!framing) return;
    setDraftZoom(1);
    setDraftFocusX(50);
    setDraftFocusY(50);
    setSavingFraming(true);
    try {
      const { error } = await supabase
        .from('events')
        .update({
          cover_zoom: 1,
          cover_focus_x: 50,
          cover_focus_y: 50,
          updated_at: new Date().toISOString(),
        })
        .eq('id', recordId);

      if (error) throw error;

      await afterPersist(imageUrl ?? null);
      toast.success('Framing reset to defaults.');
    } catch (err) {
      console.error(err);
      toast.error('Failed to reset framing.');
    } finally {
      setSavingFraming(false);
    }
  };

  if (!canEdit && !imageUrl) {
    return null;
  }

  const zoomPercent = Math.round(draftZoom * 100);
  const displayZoom = draftZoom;
  const displayFocusX = draftFocusX;
  const displayFocusY = draftFocusY;

  return (
    <div
      className={cn(
        'rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm',
        compact ? 'mb-4' : 'mb-6',
        className
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />

      {imageUrl ? (
        <>
          <div
            className="relative w-full overflow-hidden bg-neutral-200/95 flex items-center justify-center"
            style={heroFrameStyle}
          >
            <img
              src={imageUrl}
              alt={`${title} cover`}
              className="max-h-full max-w-full h-full w-full object-contain will-change-transform"
              style={
                framing
                  ? {
                      objectPosition: `${displayFocusX}% ${displayFocusY}%`,
                      transform: `scale(${displayZoom})`,
                      transformOrigin: `${displayFocusX}% ${displayFocusY}%`,
                    }
                  : {
                      objectPosition: '50% 50%',
                    }
              }
            />
            {canEdit && (
              <div className="absolute bottom-3 right-3 flex flex-wrap gap-2 justify-end">
                {allowRemove && (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="shadow-md bg-background"
                    disabled={uploading || removing}
                    onClick={() => void removeCover()}
                  >
                    {removing ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove
                      </>
                    )}
                  </Button>
                )}
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  className="shadow-md"
                  disabled={uploading || removing}
                  onClick={pickFile}
                >
                  {uploading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <ImagePlus className="h-4 w-4 mr-2" />
                      Replace image
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>

          {canEdit && framing && (
            <div className="border-t border-gray-100 bg-gray-50/90 px-4 py-4 space-y-4">
              <p className="text-sm font-medium text-gray-800">
                Adjust how the cover fits (you and admins only)
              </p>
              <p className="text-xs text-muted-foreground -mt-2">
                The full image stays visible at 100% zoom (letterboxing may appear for very wide or
                tall photos). Use zoom to shrink the image in the frame or enlarge it; use focus to
                pan the focal point for portrait or landscape shots.
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <Label htmlFor={`cover-zoom-${recordId}`}>Zoom</Label>
                  <span>{zoomPercent}%</span>
                </div>
                <Slider
                  id={`cover-zoom-${recordId}`}
                  min={25}
                  max={300}
                  step={5}
                  value={[zoomPercent]}
                  onValueChange={([v]) =>
                    setDraftZoom(clamp((v ?? 100) / 100, ZOOM_MIN, ZOOM_MAX))
                  }
                  disabled={savingFraming}
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <Label htmlFor={`cover-fx-${recordId}`}>Horizontal pan</Label>
                  <span>{Math.round(draftFocusX)}%</span>
                </div>
                <Slider
                  id={`cover-fx-${recordId}`}
                  min={0}
                  max={100}
                  step={1}
                  value={[draftFocusX]}
                  onValueChange={([v]) => setDraftFocusX(clamp(v ?? 50, 0, 100))}
                  disabled={savingFraming}
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <Label htmlFor={`cover-fy-${recordId}`}>Vertical pan</Label>
                  <span>{Math.round(draftFocusY)}%</span>
                </div>
                <Slider
                  id={`cover-fy-${recordId}`}
                  min={0}
                  max={100}
                  step={1}
                  value={[draftFocusY]}
                  onValueChange={([v]) => setDraftFocusY(clamp(v ?? 50, 0, 100))}
                  disabled={savingFraming}
                />
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                <Button
                  type="button"
                  size="sm"
                  onClick={() => void saveFraming()}
                  disabled={savingFraming}
                >
                  {savingFraming ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save framing'}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => void resetFramingAndSave()}
                  disabled={savingFraming}
                >
                  Reset to defaults
                </Button>
              </div>
            </div>
          )}
        </>
      ) : (
        canEdit && (
          <button
            type="button"
            onClick={pickFile}
            disabled={uploading}
            className="flex w-full flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-300 bg-gray-50/80 px-4 py-8 text-center text-sm text-gray-600 transition hover:border-caribbean-teal/50 hover:bg-caribbean-teal/5"
            style={emptyDropStyle}
          >
            {uploading ? (
              <Loader2 className="h-8 w-8 animate-spin text-caribbean-teal" />
            ) : (
              <>
                <ImagePlus className="h-8 w-8 text-caribbean-teal" />
                <span className="font-medium text-gray-800">Add cover image</span>
                <span className="text-xs text-gray-500 max-w-sm">{emptyStateHint}</span>
              </>
            )}
          </button>
        )
      )}
    </div>
  );
}

import { useRef, useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { ImagePlus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { uploadMediaFiles } from '@/services/mediaUploadService';
import { toast } from 'sonner';

const MAX_BYTES = 10 * 1024 * 1024;

/** Matches DB check `events_cover_zoom_range` */
const ZOOM_MIN = 0.25;
const ZOOM_MAX = 3;

function clamp(n: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, n));
}

interface EventHeroImageEditorProps {
  eventId: string;
  eventTitle: string;
  imageUrl: string | null | undefined;
  coverZoom?: number | null;
  coverFocusX?: number | null;
  coverFocusY?: number | null;
  canEdit: boolean;
}

export function EventHeroImageEditor({
  eventId,
  eventTitle,
  imageUrl,
  coverZoom = 1,
  coverFocusX = 50,
  coverFocusY = 50,
  canEdit,
}: EventHeroImageEditorProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [savingFraming, setSavingFraming] = useState(false);

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
  }, [eventId, coverZoom, coverFocusX, coverFocusY]);

  const displayZoom = draftZoom;
  const displayFocusX = draftFocusX;
  const displayFocusY = draftFocusY;

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
      const [uploaded] = await uploadMediaFiles([file], user.id);
      const { data: urlData } = supabase.storage
        .from('comment-media')
        .getPublicUrl(uploaded.path);
      const publicUrl = urlData?.publicUrl;
      if (!publicUrl) throw new Error('Could not resolve image URL');

      const { error } = await supabase
        .from('events')
        .update({
          image_url: publicUrl,
          cover_zoom: 1,
          cover_focus_x: 50,
          cover_focus_y: 50,
        })
        .eq('id', eventId);

      if (error) throw error;

      setDraftZoom(1);
      setDraftFocusX(50);
      setDraftFocusY(50);

      await queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success('Cover image updated.');
    } catch (err) {
      console.error(err);
      toast.error('Failed to upload cover image.');
    } finally {
      setUploading(false);
    }
  };

  const saveFraming = async () => {
    setSavingFraming(true);
    try {
      const zoom = clamp(draftZoom, ZOOM_MIN, ZOOM_MAX);
      const fx = clamp(draftFocusX, 0, 100);
      const fy = clamp(draftFocusY, 0, 100);

      const { error } = await supabase
        .from('events')
        .update({
          cover_zoom: zoom,
          cover_focus_x: fx,
          cover_focus_y: fy,
        })
        .eq('id', eventId);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success('Cover framing saved.');
    } catch (err) {
      console.error(err);
      toast.error('Failed to save framing.');
    } finally {
      setSavingFraming(false);
    }
  };

  const resetFramingAndSave = async () => {
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
        })
        .eq('id', eventId);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ['events'] });
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

  const zoomPercent = Math.round(displayZoom * 100);

  return (
    <div className="mb-6 rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />

      {imageUrl ? (
        <>
          {/* Tall responsive frame so portrait images can show top-to-bottom; landscape fits width */}
          <div
            className="relative w-full overflow-hidden bg-neutral-200/95 flex items-center justify-center"
            style={{
              height: 'clamp(12rem, min(36vw, 52vh), 32rem)',
              minHeight: 'min(28rem, 88vw)',
            }}
          >
            <img
              src={imageUrl}
              alt={`${eventTitle} cover`}
              className="max-h-full max-w-full h-full w-full object-contain will-change-transform"
              style={{
                objectPosition: `${displayFocusX}% ${displayFocusY}%`,
                transform: `scale(${displayZoom})`,
                transformOrigin: `${displayFocusX}% ${displayFocusY}%`,
              }}
            />
            {canEdit && (
              <div className="absolute bottom-3 right-3">
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  className="shadow-md"
                  disabled={uploading}
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

          {canEdit && (
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
                  <Label htmlFor={`cover-zoom-${eventId}`}>Zoom</Label>
                  <span>{zoomPercent}%</span>
                </div>
                <Slider
                  id={`cover-zoom-${eventId}`}
                  min={25}
                  max={300}
                  step={5}
                  value={[zoomPercent]}
                  onValueChange={([v]) =>
                    setDraftZoom(clamp((v ?? 100) / 100, ZOOM_MIN, ZOOM_MAX))
                  }
                  disabled={savingFraming}
                />
                <p className="text-xs text-muted-foreground">
                  Under 100% shrinks the photo inside the hero; over 100% zooms in (may crop edges).
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <Label htmlFor={`cover-fx-${eventId}`}>Horizontal pan</Label>
                  <span>{Math.round(draftFocusX)}%</span>
                </div>
                <Slider
                  id={`cover-fx-${eventId}`}
                  min={0}
                  max={100}
                  step={1}
                  value={[draftFocusX]}
                  onValueChange={([v]) =>
                    setDraftFocusX(clamp(v ?? 50, 0, 100))
                  }
                  disabled={savingFraming}
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <Label htmlFor={`cover-fy-${eventId}`}>Vertical pan</Label>
                  <span>{Math.round(draftFocusY)}%</span>
                </div>
                <Slider
                  id={`cover-fy-${eventId}`}
                  min={0}
                  max={100}
                  step={1}
                  value={[draftFocusY]}
                  onValueChange={([v]) =>
                    setDraftFocusY(clamp(v ?? 50, 0, 100))
                  }
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
                  {savingFraming ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Save framing'
                  )}
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
            style={{
              minHeight: 'min(16rem, 55vw)',
              height: 'clamp(12rem, min(36vw, 40vh), 20rem)',
            }}
          >
            {uploading ? (
              <Loader2 className="h-8 w-8 animate-spin text-caribbean-teal" />
            ) : (
              <>
                <ImagePlus className="h-8 w-8 text-caribbean-teal" />
                <span className="font-medium text-gray-800">Add cover image</span>
                <span className="text-xs text-gray-500 max-w-sm">
                  Event organizers and admins can upload a hero image anytime after the event is published.
                </span>
              </>
            )}
          </button>
        )
      )}
    </div>
  );
}

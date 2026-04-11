import { useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { ImagePlus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { uploadMediaFiles } from '@/services/mediaUploadService';
import { toast } from 'sonner';

const MAX_BYTES = 10 * 1024 * 1024;

interface EventHeroImageEditorProps {
  eventId: string;
  eventTitle: string;
  imageUrl: string | null | undefined;
  canEdit: boolean;
}

export function EventHeroImageEditor({
  eventId,
  eventTitle,
  imageUrl,
  canEdit,
}: EventHeroImageEditorProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

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
        .update({ image_url: publicUrl })
        .eq('id', eventId);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success('Cover image updated.');
    } catch (err) {
      console.error(err);
      toast.error('Failed to upload cover image.');
    } finally {
      setUploading(false);
    }
  };

  if (!canEdit && !imageUrl) {
    return null;
  }

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
        <div className="relative aspect-[21/9] max-h-72 bg-gray-100">
          <img
            src={imageUrl}
            alt={`${eventTitle} cover`}
            className="h-full w-full object-cover"
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
      ) : (
        canEdit && (
          <button
            type="button"
            onClick={pickFile}
            disabled={uploading}
            className="flex w-full flex-col items-center justify-center gap-2 aspect-[21/9] max-h-48 border-2 border-dashed border-gray-300 bg-gray-50/80 px-4 py-8 text-center text-sm text-gray-600 transition hover:border-caribbean-teal/50 hover:bg-caribbean-teal/5"
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

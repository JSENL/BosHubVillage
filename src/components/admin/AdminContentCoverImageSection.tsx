import { useRef, useState } from 'react';
import { ImageIcon, Loader2, Trash2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { uploadMediaFiles } from '@/services/mediaUploadService';
import { toast } from 'sonner';

const MAX_BYTES = 10 * 1024 * 1024;

type ContentTable = 'events' | 'news';

interface AdminContentCoverImageSectionProps {
  table: ContentTable;
  recordId: string;
  imageUrl: string | null;
  onImageUrlChange: (url: string | null) => void;
  /** Refetch list / parent data after DB write */
  onPersisted: () => void;
}

export function AdminContentCoverImageSection({
  table,
  recordId,
  imageUrl,
  onImageUrlChange,
  onPersisted,
}: AdminContentCoverImageSectionProps) {
  const { user } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [clearing, setClearing] = useState(false);

  const persistUrl = async (url: string | null) => {
    const { error } = await supabase
      .from(table)
      .update({ image_url: url, updated_at: new Date().toISOString() })
      .eq('id', recordId);
    if (error) throw error;
  };

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

      await persistUrl(publicUrl);
      onImageUrlChange(publicUrl);
      onPersisted();
      toast.success('Cover image saved.');
    } catch (err) {
      console.error(err);
      toast.error('Failed to upload cover image.');
    } finally {
      setUploading(false);
    }
  };

  const handleClear = async () => {
    setClearing(true);
    try {
      await persistUrl(null);
      onImageUrlChange(null);
      onPersisted();
      toast.success('Cover image removed.');
    } catch (err) {
      console.error(err);
      toast.error('Failed to remove cover image.');
    } finally {
      setClearing(false);
    }
  };

  return (
    <div className="space-y-3 rounded-lg border border-border bg-muted/30 p-4">
      <div className="flex items-center gap-2">
        <ImageIcon className="h-4 w-4 text-muted-foreground" />
        <Label className="text-base font-medium">Cover image (image_url)</Label>
      </div>
      <p className="text-xs text-muted-foreground">
        Shown on the public details page and in listings where a hero image is used. You can
        upload a file or paste a URL and save with the form below.
      </p>

      {imageUrl ? (
        <div className="flex flex-wrap items-start gap-3">
          <img
            src={imageUrl}
            alt=""
            className="h-24 w-40 rounded-md border object-cover bg-background"
          />
          <div className="flex flex-col gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={uploading || clearing}
              onClick={() => fileRef.current?.click()}
            >
              {uploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Replace image
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-destructive hover:text-destructive"
              disabled={uploading || clearing}
              onClick={() => void handleClear()}
            >
              {clearing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove image
                </>
              )}
            </Button>
          </div>
        </div>
      ) : (
        <Button
          type="button"
          variant="secondary"
          size="sm"
          disabled={uploading}
          onClick={() => fileRef.current?.click()}
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Upload cover image
            </>
          )}
        </Button>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(ev) => void handleFile(ev)}
      />

      <div>
        <Label htmlFor={`admin-cover-url-${recordId}`} className="text-xs text-muted-foreground">
          Image URL (optional — saved when you click Update on this form)
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
    </div>
  );
}

import { useEffect, useRef, useState } from 'react';
import { ImagePlus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { CategoryHero } from '@/components/common/CategoryIcon';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const MAX_BYTES = 10 * 1024 * 1024;

export interface SubmissionCoverImageFieldProps {
  category: string;
  type: 'event' | 'business' | 'local-service';
  coverFile: File | null;
  onCoverFileChange: (file: File | null) => void;
  className?: string;
  id?: string;
}

/**
 * Cover image picker with a live preview using the same hero layout as list cards
 * (gradient + optional photo on the absolute inset layer).
 */
export function SubmissionCoverImageField({
  category,
  type,
  coverFile,
  onCoverFileChange,
  className,
  id = 'submission-cover-image',
}: SubmissionCoverImageFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!coverFile) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(coverFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [coverFile]);

  const pickFile = () => inputRef.current?.click();

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please choose an image file for the cover.');
      return;
    }
    if (file.size > MAX_BYTES) {
      toast.error('Cover image must be 10MB or smaller.');
      return;
    }
    onCoverFileChange(file);
  };

  const heroCategory = category?.trim() || (type === 'business' ? 'business' : type === 'local-service' ? 'community' : 'community');

  return (
    <div className={cn('space-y-2', className)} data-testid="submission-cover-image-field">
      <Label htmlFor={id} className="text-sm font-medium">
        Cover image <span className="font-normal text-muted-foreground">(optional)</span>
      </Label>
      <p className="text-xs text-muted-foreground">
        Shown on your listing and detail page after approval. This preview matches how the cover
        appears on cards.
      </p>

      <input
        ref={inputRef}
        id={id}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />

      <div className="rounded-lg overflow-hidden border border-border">
        <CategoryHero
          category={heroCategory}
          type={type}
          height="h-36 sm:h-44"
          imageUrl={previewUrl}
          className="w-full"
        />
        <div className="flex flex-wrap gap-2 border-t border-border bg-muted/30 p-2">
          <Button type="button" size="sm" variant="secondary" onClick={pickFile}>
            <ImagePlus className="h-4 w-4 mr-2" />
            {coverFile ? 'Replace cover' : 'Add cover photo'}
          </Button>
          {coverFile ? (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => onCoverFileChange(null)}
            >
              <X className="h-4 w-4 mr-2" />
              Remove
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

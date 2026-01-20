
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { StarRating } from './StarRating';
import { User } from '@supabase/supabase-js';
import { Image, Video, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface CommentFormProps {
  user: User | null;
  onSubmitComment: (comment: string, rating: number, mediaFiles?: File[]) => Promise<void>;
}

export const CommentForm = ({ user, onSubmitComment }: CommentFormProps) => {
  const [newComment, setNewComment] = useState('');
  const [selectedRating, setSelectedRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSubmitComment(newComment.trim(), selectedRating, mediaFiles);
      setNewComment('');
      setSelectedRating(5);
      setMediaFiles([]);
    } catch (error) {
      // Error is handled in the parent component
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB limit
      return (isImage || isVideo) && isValidSize;
    });
    
    setMediaFiles(prev => [...prev, ...validFiles].slice(0, 3)); // Limit to 3 files
  };

  const removeMediaFile = (index: number) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  if (!user) {
    return (
      <Card className="border-purple-100">
        <CardContent className="p-4 text-center">
          <p className="text-gray-600">{t('comments.signInToComment')}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmitComment} className="space-y-3">
      <div className="space-y-2">
        <label className="text-sm font-medium">{t('comments.yourRating')}</label>
        <StarRating rating={selectedRating} interactive onRatingChange={setSelectedRating} />
      </div>
      
      <Textarea
        placeholder={t('comments.sharePlaceholder')}
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        className="min-h-[80px]"
        disabled={isSubmitting}
      />

      {/* Media upload section */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={triggerFileInput}
            disabled={isSubmitting || mediaFiles.length >= 3}
            className="flex items-center space-x-1"
          >
            <Image className="h-4 w-4" />
            <Video className="h-4 w-4" />
            <span>{t('comments.addMedia')}</span>
          </Button>
          <span className="text-xs text-gray-500">
            {t('comments.mediaLimit')}
          </span>
        </div>

        <Input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Preview selected media files */}
        {mediaFiles.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {mediaFiles.map((file, index) => (
              <div key={index} className="relative border rounded-lg p-2 bg-gray-50">
                <div className="flex items-center space-x-2">
                  {file.type.startsWith('image/') ? (
                    <Image className="h-4 w-4 text-blue-500" />
                  ) : (
                    <Video className="h-4 w-4 text-green-500" />
                  )}
                  <span className="text-xs truncate flex-1">{file.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeMediaFile(index)}
                    className="h-5 w-5 p-0 text-red-500 hover:text-red-700"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Button 
        type="submit" 
        disabled={!newComment.trim() || isSubmitting}
        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
      >
        {isSubmitting ? t('buttons.posting') : t('buttons.postComment')}
      </Button>
    </form>
  );
};

import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CommentMedia } from '@/hooks/useEventComments';
import { Play, Image as ImageIcon, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CommentMediaProps {
  media: CommentMedia[];
}

export const CommentMediaDisplay = ({ media }: CommentMediaProps) => {
  const [loadedUrls, setLoadedUrls] = useState<Record<string, string>>({});

  const getMediaUrl = async (filePath: string) => {
    if (loadedUrls[filePath]) {
      return loadedUrls[filePath];
    }

    const { data } = supabase.storage
      .from('comment-media')
      .getPublicUrl(filePath);

    const url = data.publicUrl;
    setLoadedUrls(prev => ({ ...prev, [filePath]: url }));
    return url;
  };

  const handleDownload = async (media: CommentMedia) => {
    try {
      const url = await getMediaUrl(media.file_path);
      const response = await fetch(url);
      const blob = await response.blob();
      
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = media.file_name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  if (!media || media.length === 0) return null;

  return (
    <div className="mt-3 space-y-2">
      {media.map((item) => (
        <MediaItem 
          key={item.id} 
          media={item} 
          onDownload={() => handleDownload(item)}
          getMediaUrl={getMediaUrl}
        />
      ))}
    </div>
  );
};

interface MediaItemProps {
  media: CommentMedia;
  onDownload: () => void;
  getMediaUrl: (filePath: string) => Promise<string>;
}

const MediaItem = ({ media, onDownload, getMediaUrl }: MediaItemProps) => {
  const [mediaUrl, setMediaUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const loadMedia = async () => {
    try {
      const url = await getMediaUrl(media.file_path);
      setMediaUrl(url);
    } catch (error) {
      console.error('Error loading media:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadMedia();
  }, [media.file_path]);

  if (loading) {
    return (
      <div className="w-full h-32 bg-gray-200 rounded-lg animate-pulse flex items-center justify-center">
        <span className="text-gray-500">Loading...</span>
      </div>
    );
  }

  const isImage = media.file_type.startsWith('image/');
  const isVideo = media.file_type.startsWith('video/');

  return (
    <div className="relative group border rounded-lg overflow-hidden bg-gray-50">
      {isImage && (
        <div className="relative">
          <img
            src={mediaUrl}
            alt={media.file_name}
            className="w-full h-48 object-cover"
            onError={(e) => {
              e.currentTarget.src = '/placeholder.svg';
            }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
            <Button
              variant="secondary"
              size="sm"
              onClick={onDownload}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Download className="h-4 w-4 mr-1" />
              Download
            </Button>
          </div>
        </div>
      )}

      {isVideo && (
        <div className="relative">
          <video
            src={mediaUrl}
            className="w-full h-48 object-cover"
            controls
            preload="metadata"
          />
          <div className="absolute top-2 right-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={onDownload}
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {!isImage && !isVideo && (
        <div className="p-4 flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-300 rounded-lg flex items-center justify-center">
            <ImageIcon className="h-5 w-5 text-gray-600" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-sm truncate">{media.file_name}</p>
            <p className="text-xs text-gray-500">
              {(media.file_size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onDownload}
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

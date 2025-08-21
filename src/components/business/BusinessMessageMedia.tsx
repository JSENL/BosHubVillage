import React from 'react';
import { Play, Download, FileText, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getMediaUrl } from '@/services/businessMessageMediaService';

interface MediaFile {
  id: string;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size: number;
}

interface BusinessMessageMediaProps {
  media: MediaFile[];
}

export const BusinessMessageMedia: React.FC<BusinessMessageMediaProps> = ({ media }) => {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const downloadFile = (filePath: string, fileName: string) => {
    const url = getMediaUrl(filePath);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const renderMediaPreview = (mediaFile: MediaFile) => {
    const url = getMediaUrl(mediaFile.file_path);
    
    if (mediaFile.file_type.startsWith('image/')) {
      return (
        <div className="relative group cursor-pointer">
          <img
            src={url}
            alt={mediaFile.file_name}
            className="max-w-xs max-h-48 rounded-lg object-cover"
            onClick={() => window.open(url, '_blank')}
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="secondary"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  downloadFile(mediaFile.file_path, mediaFile.file_name);
                }}
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      );
    }

    if (mediaFile.file_type.startsWith('video/')) {
      return (
        <div className="relative">
          <video
            src={url}
            controls
            className="max-w-xs max-h-48 rounded-lg"
            preload="metadata"
          >
            Your browser does not support the video tag.
          </video>
        </div>
      );
    }

    // For other file types, show a file icon with download option
    return (
      <div className="flex items-center gap-3 p-3 border rounded-lg bg-gray-50 max-w-xs">
        <div className="flex-shrink-0">
          <FileText className="h-8 w-8 text-gray-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {mediaFile.file_name}
          </p>
          <p className="text-xs text-gray-500">
            {formatFileSize(mediaFile.file_size)}
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => downloadFile(mediaFile.file_path, mediaFile.file_name)}
        >
          <Download className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  if (media.length === 0) return null;

  return (
    <div className="mt-2 space-y-2">
      {media.map((mediaFile) => (
        <div key={mediaFile.id}>
          {renderMediaPreview(mediaFile)}
        </div>
      ))}
    </div>
  );
};
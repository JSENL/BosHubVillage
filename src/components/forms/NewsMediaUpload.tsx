import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { X, Upload, FileText, Image, Video } from 'lucide-react';
import { toast } from 'sonner';

interface NewsMediaUploadProps {
  mediaFiles: File[];
  onFilesSelect: (files: File[]) => void;
  onFileRemove: (index: number) => void;
}

const NewsMediaUpload = ({ mediaFiles, onFilesSelect, onFileRemove }: NewsMediaUploadProps) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    validateAndSetFiles(files);
  };

  const validateAndSetFiles = (files: File[]) => {
    const validFiles: File[] = [];
    const maxSize = 10 * 1024 * 1024; // 10MB

    files.forEach(file => {
      if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
        toast.error(`${file.name} is not a valid image or video file`);
        return;
      }
      
      if (file.size > maxSize) {
        toast.error(`${file.name} is too large. Maximum size is 10MB`);
        return;
      }
      
      validFiles.push(file);
    });

    if (validFiles.length > 0) {
      onFilesSelect([...mediaFiles, ...validFiles]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    validateAndSetFiles(files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <Image className="h-4 w-4" />;
    if (fileType.startsWith('video/')) return <Video className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      <Label>Media Files (Images & Videos)</Label>
      
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragOver 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
        <p className="text-sm text-gray-600 mb-2">
          Drag and drop files here, or click to select
        </p>
        <p className="text-xs text-gray-500 mb-4">
          Supported formats: Images (JPG, PNG, GIF, WebP) and Videos (MP4, WebM)
          <br />
          Maximum file size: 10MB per file
        </p>
        <input
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={handleFileSelect}
          className="hidden"
          id="media-upload"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => document.getElementById('media-upload')?.click()}
        >
          Select Files
        </Button>
      </div>

      {mediaFiles.length > 0 && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">Selected Files ({mediaFiles.length})</Label>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {mediaFiles.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  {getFileIcon(file.type)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                  {file.type.startsWith('image/') && (
                    <img
                      src={URL.createObjectURL(file)}
                      alt="Preview"
                      className="h-12 w-12 object-cover rounded border"
                    />
                  )}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onFileRemove(index)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsMediaUpload;

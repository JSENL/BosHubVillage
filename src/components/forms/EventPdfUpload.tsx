import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileText, Upload, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

interface EventPdfUploadProps {
  onEventDataExtracted: (eventData: any) => void;
}

export const EventPdfUpload: React.FC<EventPdfUploadProps> = ({ onEventDataExtracted }) => {
  const { t } = useTranslation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setStatus('idle');
      setExtractedText('');
    } else {
      toast.error('Please select a valid PDF file');
    }
  };

  const processPdf = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setStatus('processing');

    try {
      const formData = new FormData();
      formData.append('pdf', selectedFile);

      const response = await fetch('/api/extract-event-data', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to process PDF');
      }

      const result = await response.json();
      
      setExtractedText(result.extractedText);
      setStatus('success');
      
      // Parse the extracted data and fill the form
      onEventDataExtracted(result.eventData);
      
      toast.success('PDF processed successfully! Form fields have been auto-filled.');
    } catch (error) {
      console.error('Error processing PDF:', error);
      setStatus('error');
      toast.error('Failed to process PDF. Please try again or fill the form manually.');
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'processing':
        return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          {t('pdf.upload.title', 'PDF Event Data Extraction')}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {t('pdf.upload.description', 'Upload a PDF containing event information to automatically fill the form fields')}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="pdf-upload">{t('pdf.upload.selectFile', 'Select PDF File')}</Label>
          <Input
            id="pdf-upload"
            type="file"
            accept=".pdf"
            onChange={handleFileSelect}
            disabled={isProcessing}
          />
        </div>

        {selectedFile && (
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2">
              {getStatusIcon()}
              <span className="text-sm font-medium">{selectedFile.name}</span>
            </div>
            <Button
              onClick={processPdf}
              disabled={isProcessing}
              size="sm"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {t('pdf.upload.processing', 'Processing...')}
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  {t('pdf.upload.process', 'Process PDF')}
                </>
              )}
            </Button>
          </div>
        )}

        {extractedText && (
          <div className="space-y-2">
            <Label>{t('pdf.upload.extractedText', 'Extracted Text')}</Label>
            <div className="max-h-40 overflow-y-auto p-3 bg-muted rounded-lg text-sm">
              {extractedText}
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          <p>{t('pdf.upload.note', 'Note: This feature uses PDF text extraction and OCR to automatically populate form fields. Please review and verify all extracted information.')}</p>
        </div>
      </CardContent>
    </Card>
  );
};
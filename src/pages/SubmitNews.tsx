
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNewsCategories } from '@/hooks/useCategories';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Navigation } from '@/components/Navigation';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Newspaper, ArrowLeft, AlertCircle, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useGeocoding } from '@/hooks/useGeocoding';
import { useSubmissionErrorHandler } from '@/hooks/useSubmissionErrorHandler';
import NewsMediaUpload from '@/components/forms/NewsMediaUpload';
import { uploadMediaFiles } from '@/services/mediaUploadService';
import { newsSubmissionSchema, validateFormData } from '@/utils/validation/formSchemas';
import { useTranslation } from 'react-i18next';

const SubmitNews = () => {
  const { user } = useAuth();
  const { geocode, isGeocoding } = useGeocoding();
  const { handleSubmissionError, handleValidationError } = useSubmissionErrorHandler();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const { data: newsCategories = [] } = useNewsCategories();
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    title: '',
    submitter_email: '',
    content: '',
    location: '',
    address: '',
    villages: '',
    source: '',
    date_posted: new Date().toISOString().split('T')[0] // Today's date
  });

  useEffect(() => {
    if (user?.email && !formData.submitter_email) {
      setFormData((prev) => ({ ...prev, submitter_email: user.email! }));
    }
  }, [user?.email]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear validation errors when user starts typing
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
  };

  const handleFilesSelect = (files: File[]) => {
    setMediaFiles(files);
  };

  const handleFileRemove = (index: number) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    // Use Zod schema validation
    const validation = validateFormData(newsSubmissionSchema, formData);
    
    if (!validation.success) {
      const errorValidation = validation as { success: false; errors: string[] };
      setValidationErrors(errorValidation.errors);
      return errorValidation.errors;
    }
    
    setValidationErrors([]);
    return [];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error(t('pages.authenticationRequired'), {
        description: t('pages.authRequiredNews'),
        style: {
          backgroundColor: '#fee2e2',
          borderColor: '#fca5a5',
          color: '#dc2626'
        }
      });
      return;
    }

    // Validate with Zod schema
    const validation = validateFormData(newsSubmissionSchema, formData);
    if (!validation.success) {
      const errorValidation = validation as { success: false; errors: string[] };
      setValidationErrors(errorValidation.errors);
      handleValidationError(errorValidation.errors, 'Culture');
      return;
    }

    const validatedData = validation.data;
    setValidationErrors([]);
    setIsSubmitting(true);

    try {
      let latitude = null;
      let longitude = null;

      // Geocode the address if provided
      if (validatedData.address) {
        console.log('Geocoding address:', validatedData.address);
        try {
          const geocodeResult = await geocode(validatedData.address);
          if (geocodeResult) {
            latitude = geocodeResult.latitude;
            longitude = geocodeResult.longitude;
            console.log('Geocoded coordinates:', { latitude, longitude });
          }
        } catch (geocodeError) {
          console.warn('Geocoding failed:', geocodeError);
          // Continue with submission even if geocoding fails
        }
      }

      // Convert villages string to array if provided
      const villagesArray = validatedData.villages 
        ? validatedData.villages.split(',').map(v => v.trim()).filter(v => v)
        : null;

      const { data: submission, error } = await supabase
        .from('news_submissions')
        .insert({
          title: validatedData.title,
          content: validatedData.content,
          location: validatedData.location,
          source: validatedData.source,
          date_posted: validatedData.date_posted,
          Address: validatedData.address || null,
          villages: villagesArray,
          latitude: latitude,
          longitude: longitude,
          submitted_by: user.id,
          submitter_email: validatedData.submitter_email,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      // Upload media files if any
      if (mediaFiles.length > 0 && submission) {
        try {
          const uploadedFiles = await uploadMediaFiles(mediaFiles, user.id);
          
          // Save media file records to database
          const mediaRecords = uploadedFiles.map(file => ({
            news_submission_id: submission.id,
            file_path: file.path,
            file_name: file.name,
            file_type: file.type,
            file_size: file.size
          }));

          const { error: mediaError } = await supabase
            .from('news_submission_media')
            .insert(mediaRecords);

          if (mediaError) {
            console.error('Failed to save media records:', mediaError);
            // Don't fail the submission if media upload fails
            toast.error('Media files failed to upload, but your culture submission was saved.');
          }
        } catch (mediaError) {
          console.error('Media upload failed:', mediaError);
          toast.error('Media files failed to upload, but your culture submission was saved.');
        }
      }

      // Show success dialog instead of toast and form reset
      setShowSuccessDialog(true);
    } catch (error: any) {
      handleSubmissionError(error, 'news');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddAnother = () => {
    setFormData({
      title: '',
      submitter_email: user?.email ?? '',
      content: '',
      location: '',
      address: '',
      villages: '',
      source: '',
      date_posted: new Date().toISOString().split('T')[0]
    });
    setMediaFiles([]);
    setValidationErrors([]);
    setShowSuccessDialog(false);
    toast.success('Form cleared. You can now submit another news article.');
  };

  const handleFinish = () => {
    setShowSuccessDialog(false);
    toast.success('Culture submitted successfully!', {
      description: 'Your culture article will be reviewed by our admin team.',
      duration: 5000
    });
  };

  if (!user) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-8">
          <div className="max-w-2xl mx-auto px-4">
            <Card>
              <CardContent className="p-8 text-center">
                <Newspaper className="h-16 w-16 mx-auto mb-4 text-purple-600" />
                <h3 className="text-xl font-semibold mb-2">{t('pages.authenticationRequired')}</h3>
                <p className="text-gray-600 mb-4">{t('pages.authRequiredNews')}</p>
                <Button onClick={() => window.location.href = '/auth'}>
                  {t('navigation.signIn')}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('pages.submitNews')}</h1>
            <p className="text-gray-600">{t('pages.submitNewsDesc')}</p>
          </div>

          {validationErrors.length > 0 && (
            <Card className="mb-6 border-orange-200 bg-orange-50">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-orange-800 font-medium">{t('pages.pleaseCompleteFields')}</h4>
                    <p className="text-orange-700 text-sm mt-1">
                      {t('pages.missing')}: {validationErrors.join(', ')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Newspaper className="h-5 w-5 mr-2" />
                {t('pages.newsArticleInfo')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="title">{t('pages.articleTitle')} *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder={t('pages.enterArticleTitle')}
                    required
                    className={validationErrors.includes('Article Title') ? 'border-red-300 bg-red-50' : ''}
                  />
                </div>

                <div>
                  <Label htmlFor="submitter_email">
                    {t('pages.submitterEmail', 'Your contact email')} *
                  </Label>
                  <Input
                    id="submitter_email"
                    type="email"
                    autoComplete="email"
                    value={formData.submitter_email}
                    onChange={(e) => handleInputChange('submitter_email', e.target.value)}
                    placeholder={t('pages.submitterEmailPlaceholder', 'you@example.com')}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {t(
                      'pages.submitterEmailHelp',
                      'Admins use this email if they need to follow up about your submission.'
                    )}
                  </p>
                </div>

                <div>
                  <Label htmlFor="location">{t('filters.location')} *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder={t('pages.generalLocation')}
                    required
                    className={validationErrors.includes('Location') ? 'border-red-300 bg-red-50' : ''}
                  />
                </div>

                <div>
                  <Label htmlFor="address">{t('pages.fullAddress')}</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder={t('pages.fullAddressPlaceholder')}
                    disabled={isGeocoding}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {isGeocoding ? t('pages.geocodingAddress') : t('pages.fullAddressHelp')}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Label htmlFor="villages">{t('pages.villages')}</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger type="button" onClick={(e) => e.preventDefault()}>
                          <Info className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{t('pages.villagesTooltip')}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Input
                    id="villages"
                    value={formData.villages}
                    onChange={(e) => handleInputChange('villages', e.target.value)}
                    placeholder={t('pages.villagesPlaceholder')}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {t('pages.villagesSeparator')}
                  </p>
                </div>

                <div>
                  <Label htmlFor="source">{t('pages.source')} *</Label>
                  <Select
                    value={formData.source}
                    onValueChange={(value) => handleInputChange('source', value)}
                    required
                  >
                    <SelectTrigger className={validationErrors.includes('Source') ? 'border-red-300 bg-red-50' : ''}>
                      <SelectValue placeholder={t('pages.selectNewsSource')} />
                    </SelectTrigger>
                    <SelectContent>
                      {newsCategories.map((category) => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="date_posted">{t('pages.datePosted')} *</Label>
                  <Input
                    id="date_posted"
                    type="date"
                    value={formData.date_posted}
                    onChange={(e) => handleInputChange('date_posted', e.target.value)}
                    required
                    className={validationErrors.includes('Date Posted') ? 'border-red-300 bg-red-50' : ''}
                  />
                </div>

                <div>
                  <Label htmlFor="content">{t('pages.articleContent')} *</Label>
                  <RichTextEditor
                    id="content"
                    value={formData.content}
                    onChange={(html) => handleInputChange('content', html)}
                    placeholder={t('pages.articleContentPlaceholder')}
                    minHeight="220px"
                    className={validationErrors.includes('Article Content') ? 'border-red-300' : ''}
                  />
                  <p className="text-xs text-muted-foreground mt-1.5">
                    Use the toolbar for bold, underline, lists, links, and more.
                  </p>
                </div>

                <NewsMediaUpload
                  mediaFiles={mediaFiles}
                  onFilesSelect={handleFilesSelect}
                  onFileRemove={handleFileRemove}
                />

                <Button 
                  type="submit"
                  disabled={isSubmitting || isGeocoding}
                  variant="orange"
                  className="w-full"
                >
                  {isSubmitting ? t('buttons.submitting') : isGeocoding ? t('buttons.processingAddress') : t('buttons.submitNewsArticle')}
                </Button>
              </form>
            </CardContent>
          </Card>

          <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t('pages.newsSubmittedSuccess')}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t('pages.newsSubmittedDesc')}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={handleFinish}>{t('pages.done')}</AlertDialogCancel>
                <AlertDialogAction onClick={handleAddAnother}>{t('pages.submitAnother')}</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </>
  );
};

export default SubmitNews;
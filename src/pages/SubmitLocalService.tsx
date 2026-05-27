import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { normalizeRichTextForStorage, richTextPlainLength } from '@/lib/richText';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useGeocoding } from '@/hooks/useGeocoding';
import { useLocalServiceCategories } from '@/hooks/useCategories';
import { Building2, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useTranslation } from 'react-i18next';
import { SubmissionCoverImageField } from '@/components/forms/SubmissionCoverImageField';
import { uploadCoverImage } from '@/lib/coverImageUpload';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  category: z.string().min(1, {
    message: 'Category must be selected.',
  }),
  address: z.string().min(5, {
    message: 'Address must be at least 5 characters.',
  }),
  neighborhood: z.string().min(2, {
    message: 'Neighborhood must be at least 2 characters.',
  }),
  village: z.string().optional(),
  website_link: z.string().optional(),
  description: z
    .string()
    .optional()
    .transform((val) => normalizeRichTextForStorage(val))
    .refine(
      (val) => richTextPlainLength(val) <= 10000,
      'Description must be less than 10000 characters'
    ),
});

type FormData = z.infer<typeof formSchema>;

const SubmitLocalService = () => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const { geocode, isReady } = useGeocoding();
  const { data: localServiceCategories = [] } = useLocalServiceCategories();
  const { t } = useTranslation();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      category: '',
      address: '',
      neighborhood: '',
      village: '',
      website_link: '',
      description: '',
    },
  });

  const watchedCategory = form.watch('category');

  const onSubmit = async (data: FormData) => {
    if (!user) {
      toast.error('Please sign in to submit a local resource');
      return;
    }

    setIsSubmitting(true);

    try {
      // Geocode the address if possible
      let latitude: number | null = null;
      let longitude: number | null = null;

      if (isReady && data.address) {
        console.log('Attempting to geocode address:', data.address);
        const geocodeResult = await geocode(data.address);
        if (geocodeResult) {
          latitude = geocodeResult.latitude;
          longitude = geocodeResult.longitude;
          console.log('Successfully geocoded address:', { latitude, longitude });
        }
      }

      let imageUrl: string | null = null;
      if (coverFile) {
        try {
          imageUrl = await uploadCoverImage(coverFile, user.id);
        } catch (coverErr) {
          console.error('Cover image upload failed:', coverErr);
          toast.warning('Cover image could not be uploaded; your submission was still saved.');
        }
      }

      const { error } = await supabase
        .from('local_resources_submissions')
        .insert({
          name: data.name,
          category: data.category,
          address: data.address,
          neighborhood: data.neighborhood,
          village: data.village || null,
          website_link: data.website_link || null,
          description: data.description || null,
          latitude,
          longitude,
          image_url: imageUrl,
          submitted_by: user.id,
          status: 'pending',
        });

      if (error) throw error;

      // Show success dialog instead of just toast
      setShowSuccessDialog(true);
    } catch (error: any) {
      console.error('Error submitting local resource:', error);
      toast.error('Failed to submit local resource: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddAnother = () => {
    form.reset();
    setCoverFile(null);
    setShowSuccessDialog(false);
    toast.success('Form cleared. You can now submit another local resource.');
  };

  const handleFinish = () => {
    setShowSuccessDialog(false);
    toast.success('Local resource submitted successfully! It will be reviewed by our team.');
  };

  if (!user) {
    return (
      <>
        <Navigation />
        <div className="container mx-auto py-10 max-w-2xl px-4">
          <Card className="mt-8">
            <CardContent className="p-8 text-center">
              <Building2 className="h-16 w-16 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">{t('pages.signInRequired')}</h3>
              <p className="text-gray-600 mb-4">{t('pages.submitLocalResourceDesc')}</p>
              <Button onClick={() => window.location.href = '/auth'}>{t('navigation.signIn')}</Button>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <div className="container mx-auto py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">{t('pages.submitLocalResource')}</h1>
        <p className="text-gray-600 mb-6">
          {t('pages.submitLocalResourceDesc')}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('pages.resourceName')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('pages.resourceNamePlaceholder')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('common.category')}</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || undefined}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t('pages.selectCategory')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {localServiceCategories.map((category) => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <SubmissionCoverImageField
            type="local-service"
            category={watchedCategory || 'community'}
            coverFile={coverFile}
            onCoverFileChange={setCoverFile}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('common.address')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('pages.addressPlaceholder')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="neighborhood"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <FormLabel>{t('pages.neighborhood')}</FormLabel>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger type="button" onClick={(e) => e.preventDefault()}>
                        <Info className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{t('pages.neighborhoodTooltip')}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <FormControl>
                  <Input placeholder={t('filters.neighborhood')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="village"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <FormLabel>{t('pages.villageOptional')}</FormLabel>
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
                <FormControl>
                  <Input placeholder={t('pages.villagePlaceholder')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="website_link"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('pages.websiteLinkOptional')}</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com" type="url" {...field} />
                </FormControl>
                <FormDescription>
                  {t('pages.websiteLinkHelp')}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('pages.descriptionOptional')}</FormLabel>
                <FormControl>
                  <RichTextEditor
                    id="local-resource-description"
                    value={field.value ?? ''}
                    onChange={field.onChange}
                    placeholder={t('pages.descriptionPlaceholder')}
                  />
                </FormControl>
                <FormDescription>
                  {t('pages.descriptionHelp')}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isSubmitting} variant="orange">
            {isSubmitting ? t('buttons.submitting') : t('buttons.submit')}
          </Button>
        </form>
      </Form>

      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('pages.localResourceSubmittedSuccess')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('pages.localResourceSubmittedDesc')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleFinish}>{t('pages.done')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleAddAnother}>{t('pages.submitAnother')}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
    </>
  );
};

export default SubmitLocalService;
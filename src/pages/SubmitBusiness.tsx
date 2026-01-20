import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useAuth } from '@/hooks/useAuth';
import { useBusinessCategories } from '@/hooks/useCategories';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Building, ArrowLeft, Loader2, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Checkbox } from '@/components/ui/checkbox';
import { useGeocoding } from '@/hooks/useGeocoding';
import LocationFields from '@/components/forms/LocationFields';
import { businessSubmissionSchema, validateFormData } from '@/utils/validation/formSchemas';
import { useTranslation } from 'react-i18next';

const SubmitBusiness = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const { geocode, isGeocoding } = useGeocoding();
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    title: '',
    business_type: '',
    address: '',
    neighborhood: '',
    villages: '',
    website_link: '',
    description: '',
    short_description: '',
    is_owner: false
  });
  

  const { data: businessCategories = [] } = useBusinessCategories();

  const neighborhoods = [
    'Dorchester', 'South End', 'Back Bay', 'North End', 'Beacon Hill',
    'Cambridge', 'Somerville', 'Roxbury', 'Jamaica Plain', 'Other'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('You must be logged in to submit a business');
      return;
    }

    // Validate form data with Zod schema
    const validation = validateFormData(businessSubmissionSchema, formData);
    
    if (!validation.success) {
      const errorValidation = validation as { success: false; errors: string[] };
      toast.error(t('pages.validationError'), {
        description: errorValidation.errors[0]
      });
      return;
    }

    const validatedData = validation.data;

    setLoading(true);
    try {
      let latitude = null;
      let longitude = null;

      // Geocode the address if provided
      if (validatedData.address) {
        console.log('Geocoding business address:', validatedData.address);
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

      // Submit to Supabase business_submissions table with validated data
      const businessData = {
        title: validatedData.title,
        business_type: validatedData.business_type,
        address: validatedData.address,
        neighborhood: validatedData.neighborhood,
        villages: validatedData.villages || null,
        website_link: validatedData.website_link || null,
        description: validatedData.description,
        short_description: validatedData.short_description || null,
        latitude,
        longitude,
        submitted_by: user.id,
        status: 'pending',
        is_owner: validatedData.is_owner || false
      };

      console.log('🏪 Submitting business to database:', businessData);
      const { error } = await supabase
        .from('business_submissions')
        .insert(businessData);

      if (error) {
        console.error('❌ Business submission error:', error);
        throw error;
      }
      console.log('✅ Business submitted successfully');

      // Show success dialog
      console.log('📝 Business submitted successfully');
      setShowSuccessDialog(true);
    } catch (error: any) {
      console.error('❌ Error submitting business:', error);
      toast.error('Failed to submit business. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAnother = () => {
    setFormData({
      title: '',
      business_type: '',
      address: '',
      neighborhood: '',
      villages: '',
      website_link: '',
      description: '',
      short_description: '',
      is_owner: false
    });
    
    setShowSuccessDialog(false);
    toast.success('Form cleared. You can now submit another business.');
  };

  const handleFinish = () => {
    setShowSuccessDialog(false);
    toast.success('Business submitted successfully! It will be reviewed by our admin team.');
    navigate('/');
  };

  if (!user) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-8">
          <div className="max-w-2xl mx-auto px-4">
            <Card>
              <CardContent className="p-8 text-center">
                <Building className="h-16 w-16 mx-auto mb-4 text-purple-600" />
                <h3 className="text-xl font-semibold mb-2">{t('pages.signInRequired')}</h3>
                <p className="text-gray-600 mb-4">{t('pages.authRequiredBusiness')}</p>
                <Button onClick={() => navigate('/auth')}>{t('navigation.signIn')}</Button>
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

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <Building className="h-6 w-6 mr-2 text-purple-600" />
                {t('pages.submitBusiness')}
              </CardTitle>
              <p className="text-gray-600">
                {t('pages.submitBusinessDesc')}
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="title">{t('pages.businessName')} *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder={t('pages.enterBusinessName')}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="business_type">{t('pages.businessType')} *</Label>
                  <Select
                    value={formData.business_type}
                    onValueChange={(value) => setFormData({ ...formData, business_type: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('pages.selectBusinessType')} />
                    </SelectTrigger>
                    <SelectContent>
                      {businessCategories.map((category) => (
                        <SelectItem key={category.id} value={category.name}>{category.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <LocationFields
                  formData={{ location: formData.address }}
                  onInputChange={(field, value) => handleInputChange('address', value)}
                  isGeocoding={isGeocoding}
                />

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Label htmlFor="neighborhood">{t('pages.neighborhood')} *</Label>
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
                  <Input
                    id="neighborhood"
                    value={formData.neighborhood}
                    onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                    placeholder={t('pages.neighborhoodPlaceholder')}
                    required
                  />
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
                    onChange={(e) => setFormData({ ...formData, villages: e.target.value })}
                    placeholder={t('pages.villagesFieldPlaceholder')}
                  />
                </div>

                <div>
                  <Label htmlFor="website_link">{t('pages.websiteLink')}</Label>
                  <Input
                    id="website_link"
                    type="url"
                    value={formData.website_link}
                    onChange={(e) => setFormData({ ...formData, website_link: e.target.value })}
                    placeholder="https://example.com"
                  />
                </div>

                <div>
                  <Label htmlFor="short_description">{t('pages.shortDescription')}</Label>
                  <Input
                    id="short_description"
                    value={formData.short_description}
                    onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                    placeholder={t('pages.briefDescription')}
                    maxLength={100}
                  />
                </div>

                <div>
                  <Label htmlFor="description">{t('common.description')} *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder={t('pages.businessDescription')}
                    rows={4}
                    required
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is_owner"
                    checked={formData.is_owner}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_owner: !!checked })}
                  />
                  <Label 
                    htmlFor="is_owner" 
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {t('pages.areYouOwner')}
                  </Label>
                </div>


                <Button
                  type="submit"
                  disabled={loading || isGeocoding}
                  variant="orange"
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {t('buttons.submitting')}
                    </>
                  ) : isGeocoding ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {t('buttons.processingAddress')}
                    </>
                  ) : (
                    t('buttons.submitBusiness')
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t('pages.businessSubmittedSuccess')}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t('pages.businessSubmittedDesc')}
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

export default SubmitBusiness;
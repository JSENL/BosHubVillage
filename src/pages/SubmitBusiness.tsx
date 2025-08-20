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

const SubmitBusiness = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const { geocode, isGeocoding } = useGeocoding();
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

    setLoading(true);
    try {
      let latitude = null;
      let longitude = null;

      // Geocode the address if provided
      if (formData.address) {
        console.log('Geocoding business address:', formData.address);
        try {
          const geocodeResult = await geocode(formData.address);
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

      // Submit to Supabase business_submissions table
      const businessData = {
        title: formData.title,
        business_type: formData.business_type,
        address: formData.address,
        neighborhood: formData.neighborhood,
        villages: formData.villages || null,
        website_link: formData.website_link || null,
        description: formData.description,
        short_description: formData.short_description || null,
        latitude,
        longitude,
        submitted_by: user.id,
        status: 'pending'
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

      // If user claims ownership, add them to business_owner table
      if (formData.is_owner) {
        // Get the business ID from the submission
        const { data: submissionData } = await supabase
          .from('business_submissions')
          .select('id')
          .eq('title', formData.title)
          .eq('submitted_by', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (submissionData) {
          const { error: ownerError } = await supabase
            .from('business_owner')
            .insert({
              business_id: submissionData.id,
              owner_id: user.id
            });

          if (ownerError) {
            console.warn('Failed to add business ownership:', ownerError);
          } else {
            console.log('✅ Business ownership added');
          }
        }
      }

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
                <h3 className="text-xl font-semibold mb-2">Sign In Required</h3>
                <p className="text-gray-600 mb-4">You need to be signed in to submit a business.</p>
                <Button onClick={() => navigate('/auth')}>Sign In</Button>
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
                Submit a Business
              </CardTitle>
              <p className="text-gray-600">
                Share a local business with the community. All submissions are reviewed before being published.
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="title">Business Name *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter business name"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="business_type">Business Type *</Label>
                  <Select
                    value={formData.business_type}
                    onValueChange={(value) => setFormData({ ...formData, business_type: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select business type" />
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
                    <Label htmlFor="neighborhood">Neighborhood *</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger type="button" onClick={(e) => e.preventDefault()}>
                          <Info className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Neighborhoods in the Boston area are the big areas such as Roxbury, Dorchester, South End, Hyde Park or Mattapan</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Input
                    id="neighborhood"
                    value={formData.neighborhood}
                    onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                    placeholder="Enter neighborhood (e.g., Back Bay, Cambridge, etc.)"
                    required
                  />
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Label htmlFor="villages">Villages</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger type="button" onClick={(e) => e.preventDefault()}>
                          <Info className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>These are the subneighborhoods of Boston: Fields Corner, Ashmont, Fort Hill, or Grove Hall</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Input
                    id="villages"
                    value={formData.villages}
                    onChange={(e) => setFormData({ ...formData, villages: e.target.value })}
                    placeholder="Enter villages (e.g., Beacon Hill Village, Cambridge Village, etc.)"
                  />
                </div>

                <div>
                  <Label htmlFor="website_link">Website Link (Optional)</Label>
                  <Input
                    id="website_link"
                    type="url"
                    value={formData.website_link}
                    onChange={(e) => setFormData({ ...formData, website_link: e.target.value })}
                    placeholder="https://example.com"
                  />
                </div>

                <div>
                  <Label htmlFor="short_description">Short Description</Label>
                  <Input
                    id="short_description"
                    value={formData.short_description}
                    onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                    placeholder="Brief description (optional)"
                    maxLength={100}
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe the business, services offered, hours, etc."
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
                    Are you the business owner/creator/proprietor?
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
                      Submitting...
                    </>
                  ) : isGeocoding ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing Address...
                    </>
                  ) : (
                    'Submit Business'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Business Submitted Successfully!</AlertDialogTitle>
                <AlertDialogDescription>
                  Your business has been submitted and will be reviewed by our admin team. 
                  Would you like to submit another business?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={handleFinish}>Done</AlertDialogCancel>
                <AlertDialogAction onClick={handleAddAnother}>Submit Another</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </>
  );
};

export default SubmitBusiness;

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Navigation } from '@/components/Navigation';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Building, ArrowLeft, AlertCircle } from 'lucide-react';
import { useSubmissionErrorHandler } from '@/hooks/useSubmissionErrorHandler';

const SubmitBusiness = () => {
  const { user } = useAuth();
  const { handleSubmissionError, handleValidationError } = useSubmissionErrorHandler();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    business_type: '',
    address: '',
    neighborhood: '',
    description: '',
    short_description: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear validation errors when user starts typing
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
  };

  const validateForm = () => {
    const errors: string[] = [];
    
    if (!formData.title.trim()) errors.push('Business Name');
    if (!formData.business_type.trim()) errors.push('Business Type');
    if (!formData.address.trim()) errors.push('Address');
    if (!formData.neighborhood.trim()) errors.push('Neighborhood');
    if (!formData.description.trim()) errors.push('Full Description');

    setValidationErrors(errors);
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Authentication required', {
        description: 'You must be signed in to submit a business',
        style: {
          backgroundColor: '#fee2e2',
          borderColor: '#fca5a5',
          color: '#dc2626'
        }
      });
      return;
    }

    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      handleValidationError(validationErrors, 'Business');
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('business_submissions')
        .insert({
          ...formData,
          submitted_by: user.id,
          status: 'pending'
        });

      if (error) throw error;

      toast.success('Business submitted successfully!', {
        description: 'Your business will be reviewed by our admin team.',
        duration: 5000
      });
      
      // Reset form
      setFormData({
        title: '',
        business_type: '',
        address: '',
        neighborhood: '',
        description: '',
        short_description: ''
      });
      setValidationErrors([]);
    } catch (error: any) {
      handleSubmissionError(error, 'business');
    } finally {
      setIsSubmitting(false);
    }
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
                <h3 className="text-xl font-semibold mb-2">Authentication Required</h3>
                <p className="text-gray-600 mb-4">You need to sign in to submit a business for approval.</p>
                <Button onClick={() => window.location.href = '/auth'}>
                  Sign In
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
            <Button
              variant="ghost"
              onClick={() => window.location.href = '/'}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Submit Business</h1>
            <p className="text-gray-600">Share a local business with the community</p>
          </div>

          {validationErrors.length > 0 && (
            <Card className="mb-6 border-orange-200 bg-orange-50">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-orange-800 font-medium">Please complete all required fields</h4>
                    <p className="text-orange-700 text-sm mt-1">
                      Missing: {validationErrors.join(', ')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="h-5 w-5 mr-2" />
                Business Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="title">Business Name *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Enter the business name"
                    required
                    className={validationErrors.includes('Business Name') ? 'border-red-300 bg-red-50' : ''}
                  />
                </div>

                <div>
                  <Label htmlFor="business_type">Business Type *</Label>
                  <Input
                    id="business_type"
                    value={formData.business_type}
                    onChange={(e) => handleInputChange('business_type', e.target.value)}
                    placeholder="e.g., Restaurant, Retail, Service, etc."
                    required
                    className={validationErrors.includes('Business Type') ? 'border-red-300 bg-red-50' : ''}
                  />
                </div>

                <div>
                  <Label htmlFor="address">Address *</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Enter the full address"
                    required
                    className={validationErrors.includes('Address') ? 'border-red-300 bg-red-50' : ''}
                  />
                </div>

                <div>
                  <Label htmlFor="neighborhood">Neighborhood *</Label>
                  <Input
                    id="neighborhood"
                    value={formData.neighborhood}
                    onChange={(e) => handleInputChange('neighborhood', e.target.value)}
                    placeholder="Enter the neighborhood or area"
                    required
                    className={validationErrors.includes('Neighborhood') ? 'border-red-300 bg-red-50' : ''}
                  />
                </div>

                <div>
                  <Label htmlFor="short_description">Short Description</Label>
                  <Input
                    id="short_description"
                    value={formData.short_description}
                    onChange={(e) => handleInputChange('short_description', e.target.value)}
                    placeholder="Brief one-line description"
                    maxLength={100}
                  />
                </div>

                <div>
                  <Label htmlFor="description">Full Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Provide a detailed description of the business, what they offer, their specialties, etc."
                    rows={5}
                    required
                    className={validationErrors.includes('Full Description') ? 'border-red-300 bg-red-50' : ''}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Business'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default SubmitBusiness;

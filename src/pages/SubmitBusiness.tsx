
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
import { Building, ArrowLeft } from 'lucide-react';

const SubmitBusiness = () => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('You must be signed in to submit a business');
      return;
    }

    if (!formData.title || !formData.business_type || !formData.address || !formData.neighborhood || !formData.description) {
      toast.error('Please fill in all required fields');
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

      toast.success('Business submitted successfully! It will be reviewed by our admin team.');
      
      // Reset form
      setFormData({
        title: '',
        business_type: '',
        address: '',
        neighborhood: '',
        description: '',
        short_description: ''
      });
    } catch (error: any) {
      console.error('Error submitting business:', error);
      toast.error('Failed to submit business. Please try again.');
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

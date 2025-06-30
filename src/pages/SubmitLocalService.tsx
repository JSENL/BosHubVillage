
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Heart, MapPin, Building, FileText, AlertCircle } from 'lucide-react';
import { useSubmissionErrorHandler } from '@/hooks/useSubmissionErrorHandler';

const SubmitLocalService = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { handleSubmissionError, handleValidationError } = useSubmissionErrorHandler();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    address: '',
    neighborhood: '',
    village: '',
    description: '',
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
    
    if (!formData.name.trim()) errors.push('Service/Organization Name');
    if (!formData.category.trim()) errors.push('Category');
    if (!formData.address.trim()) errors.push('Address');
    if (!formData.neighborhood.trim()) errors.push('Neighborhood');

    setValidationErrors(errors);
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Authentication required', {
        description: 'You must be signed in to submit a local service',
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
      handleValidationError(validationErrors, 'Local service');
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('local_services_nonprofits_submissions')
        .insert({
          name: formData.name,
          category: formData.category,
          address: formData.address,
          neighborhood: formData.neighborhood,
          village: formData.village || null,
          description: formData.description || null,
          submitted_by: user.id,
        });

      if (error) throw error;

      toast.success('Local service submitted successfully!', {
        description: 'Your submission will be reviewed by our admin team.',
        duration: 5000
      });
      
      // Reset form and navigate
      setFormData({
        name: '',
        category: '',
        address: '',
        neighborhood: '',
        village: '',
        description: '',
      });
      setValidationErrors([]);
      navigate('/');
    } catch (error: any) {
      handleSubmissionError(error, 'local service');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
        <Navigation />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <Heart className="h-12 w-12 mx-auto mb-4 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Sign In Required</h2>
              <p className="text-gray-600 mb-6">
                You need to be signed in to submit a local service or nonprofit.
              </p>
              <Button onClick={() => navigate('/auth')} className="bg-purple-600 hover:bg-purple-700">
                Sign In
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <Navigation />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
            <CardTitle className="flex items-center text-2xl font-bold text-gray-900">
              <Heart className="h-6 w-6 mr-2 text-purple-600" />
              Submit Local Service or Nonprofit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Building className="h-5 w-5 mr-2" />
                  Basic Information
                </h3>
                
                <div className="space-y-2">
                  <Label htmlFor="name">Service/Organization Name *</Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter the name of the service or organization"
                    required
                    className={validationErrors.includes('Service/Organization Name') ? 'border-red-300 bg-red-50' : ''}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger className={validationErrors.includes('Category') ? 'border-red-300 bg-red-50' : ''}>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="social-services">Social Services</SelectItem>
                      <SelectItem value="environmental">Environmental</SelectItem>
                      <SelectItem value="community">Community</SelectItem>
                      <SelectItem value="arts-culture">Arts & Culture</SelectItem>
                      <SelectItem value="sports-recreation">Sports & Recreation</SelectItem>
                      <SelectItem value="religious">Religious</SelectItem>
                      <SelectItem value="emergency-services">Emergency Services</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Location */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Location
                </h3>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Address *</Label>
                  <Input
                    id="address"
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Enter the full address"
                    required
                    className={validationErrors.includes('Address') ? 'border-red-300 bg-red-50' : ''}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="neighborhood">Neighborhood *</Label>
                    <Input
                      id="neighborhood"
                      type="text"
                      value={formData.neighborhood}
                      onChange={(e) => handleInputChange('neighborhood', e.target.value)}
                      placeholder="Enter neighborhood"
                      required
                      className={validationErrors.includes('Neighborhood') ? 'border-red-300 bg-red-50' : ''}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="village">Village</Label>
                    <Input
                      id="village"
                      type="text"
                      value={formData.village}
                      onChange={(e) => handleInputChange('village', e.target.value)}
                      placeholder="Enter village (optional)"
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Description
                </h3>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe the services offered, mission, or other relevant information..."
                    rows={4}
                  />
                </div>
              </div>

              <div className="flex justify-between pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit for Review'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SubmitLocalService;

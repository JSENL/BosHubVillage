
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
import { Heart, MapPin, Building, FileText } from 'lucide-react';

const SubmitLocalService = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('You must be logged in to submit a local service');
      return;
    }

    if (!formData.name || !formData.category || !formData.address || !formData.neighborhood) {
      toast.error('Please fill in all required fields');
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

      toast.success('Local service submitted successfully! It will be reviewed by our team.');
      navigate('/');
    } catch (error: any) {
      console.error('Error submitting local service:', error);
      toast.error('Failed to submit local service: ' + error.message);
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
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger>
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

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProfilePictureUpload } from '@/components/profile/ProfilePictureUpload';
import { EmailDigestSettings } from '@/components/settings/EmailDigestSettings';
import { X, Plus, Save, ArrowLeft } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const SUGGESTED_INTERESTS = [
  'Arts & Culture', 'Sports', 'Music', 'Food & Dining', 'Technology', 
  'Travel', 'Photography', 'Reading', 'Fitness', 'Gaming', 
  'Nature & Outdoors', 'Business', 'Volunteering', 'Education', 'Health & Wellness',
  'Fashion', 'Movies & TV', 'Cooking', 'Dancing', 'Writing',
  'Science', 'History', 'Politics', 'Environment', 'Family'
];

export const EditProfile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile, updateProfile, isUpdating } = useProfile();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    full_name: '',
    bio: '',
    location: '',
    website: '',
    interests: [] as string[],
    avatar_url: '',
  });
  
  const [newInterest, setNewInterest] = useState('');

  // Populate form with existing profile data
  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        bio: profile.bio || '',
        location: profile.location || '',
        website: profile.website || '',
        interests: profile.interests || [],
        avatar_url: profile.avatar_url || '',
      });
    }
  }, [profile]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAvatarUpdate = (newAvatarUrl: string) => {
    setFormData(prev => ({ ...prev, avatar_url: newAvatarUrl }));
  };

  const addInterest = (interest: string) => {
    const trimmedInterest = interest.trim();
    if (trimmedInterest && !formData.interests.includes(trimmedInterest)) {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, trimmedInterest]
      }));
    }
    setNewInterest('');
  };

  const removeInterest = (interestToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.filter(interest => interest !== interestToRemove)
    }));
  };

  const handleSuggestedInterestClick = (interest: string) => {
    if (!formData.interests.includes(interest)) {
      addInterest(interest);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.full_name.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter your full name.",
        variant: "destructive",
      });
      return;
    }

    updateProfile(formData);
    
    // Navigate back on success
    setTimeout(() => {
      if (!isUpdating) {
        toast({
          title: "Profile Updated!",
          description: "Your interests have been saved. You can now discover people with similar interests!",
        });
        navigate(`/user/${user?.id}`);
      }
    }, 1000);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (!user) {
    navigate('/auth');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <Navigation />
      
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate(`/user/${user.id}`)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Profile
          </Button>
          
          <h1 className="text-2xl font-bold">Edit Profile</h1>
          <p className="text-muted-foreground">
            Update your information and interests to connect with like-minded people.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Picture Upload */}
              <div className="flex justify-center">
                <ProfilePictureUpload
                  currentAvatarUrl={formData.avatar_url}
                  onAvatarUpdate={handleAvatarUpdate}
                  userFullName={formData.full_name}
                />
              </div>

              {/* Basic Info */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="full_name">Full Name *</Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => handleInputChange('full_name', e.target.value)}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    placeholder="Tell others about yourself..."
                    rows={3}
                    maxLength={200}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {formData.bio.length}/200 characters
                  </p>
                </div>

                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="City, Country"
                  />
                </div>

                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={formData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    placeholder="https://yourwebsite.com"
                    type="url"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Interests Section */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Interests</CardTitle>
              <p className="text-sm text-muted-foreground">
                Add your interests to discover people with similar hobbies and passions.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Current Interests */}
              {formData.interests.length > 0 && (
                <div>
                  <Label className="text-sm font-medium">Your Interests</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.interests.map((interest, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary" 
                        className="flex items-center gap-1"
                      >
                        {interest}
                        <X 
                          className="h-3 w-3 cursor-pointer hover:text-destructive" 
                          onClick={() => removeInterest(interest)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Add Custom Interest */}
              <div>
                <Label htmlFor="new-interest">Add Interest</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="new-interest"
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    placeholder="Type an interest..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addInterest(newInterest);
                      }
                    }}
                  />
                  <Button 
                    type="button"
                    variant="outline" 
                    size="icon"
                    onClick={() => addInterest(newInterest)}
                    disabled={!newInterest.trim()}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Suggested Interests */}
              <div>
                <Label className="text-sm font-medium">Suggested Interests</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {SUGGESTED_INTERESTS
                    .filter(interest => !formData.interests.includes(interest))
                    .map((interest) => (
                      <Badge 
                        key={interest}
                        variant="outline" 
                        className="cursor-pointer hover:bg-primary/10"
                        onClick={() => handleSuggestedInterestClick(interest)}
                      >
                        {interest}
                      </Badge>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Email Digest Settings */}
          <EmailDigestSettings />

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <Button 
              type="submit" 
              disabled={isUpdating}
              className="flex-1"
            >
              <Save className="h-4 w-4 mr-2" />
              {isUpdating ? 'Saving...' : 'Save Profile'}
            </Button>
            <Button 
              type="button" 
              variant="outline"
              onClick={() => navigate(`/user/${user.id}`)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
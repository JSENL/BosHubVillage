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
import { NotificationSettings } from '@/components/settings/NotificationSettings';
import { X, Plus, Save, ArrowLeft } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();

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
        title: t('pages.validationError'),
        description: t('pages.enterYourName'),
        variant: "destructive",
      });
      return;
    }

    updateProfile(formData);
    
    // Navigate back on success
    setTimeout(() => {
      if (!isUpdating) {
        toast({
          title: t('pages.profileUpdated'),
          description: t('pages.interestsSaved'),
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
            {t('pages.backToProfile')}
          </Button>
          
          <h1 className="text-2xl font-bold">{t('pages.editProfile')}</h1>
          <p className="text-muted-foreground">
            {t('pages.editProfileDesc')}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>{t('pages.profileInfo')}</CardTitle>
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
                  <Label htmlFor="full_name">{t('pages.fullName')} *</Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => handleInputChange('full_name', e.target.value)}
                    placeholder={t('pages.enterFullName')}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="bio">{t('pages.bio')}</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    placeholder={t('pages.bioPlaceholder')}
                    rows={3}
                    maxLength={200}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {formData.bio.length}/200 {t('pages.characters')}
                  </p>
                </div>

                <div>
                  <Label htmlFor="location">{t('pages.locationField')}</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder={t('pages.locationPlaceholder')}
                  />
                </div>

                <div>
                  <Label htmlFor="website">{t('pages.website')}</Label>
                  <Input
                    id="website"
                    value={formData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    placeholder={t('pages.websitePlaceholder')}
                    type="url"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Interests Section */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>{t('pages.interests')}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {t('pages.interestsDesc')}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Current Interests */}
              {formData.interests.length > 0 && (
                <div>
                  <Label className="text-sm font-medium">{t('pages.yourInterests')}</Label>
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
                <Label htmlFor="new-interest">{t('pages.addInterest')}</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="new-interest"
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    placeholder={t('pages.typeInterest')}
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
                <Label className="text-sm font-medium">{t('pages.suggestedInterests')}</Label>
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
          <NotificationSettings />

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <Button 
              type="submit" 
              disabled={isUpdating}
              className="flex-1"
            >
              <Save className="h-4 w-4 mr-2" />
              {isUpdating ? t('buttons.saving') : t('buttons.saveProfile')}
            </Button>
            <Button 
              type="button" 
              variant="outline"
              onClick={() => navigate(`/user/${user.id}`)}
            >
              {t('common.cancel')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
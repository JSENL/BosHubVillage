import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { User, Mail, Phone, MessageSquare, Send, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from 'react-i18next';

interface EventRegistrationFormProps {
  eventId: string;
  eventTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

export const EventRegistrationForm: React.FC<EventRegistrationFormProps> = ({
  eventId,
  eventTitle,
  isOpen,
  onClose
}) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    user_name: '',
    user_email: user?.email || '',
    user_phone: '',
    additional_info: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error(t('pages.mustBeLoggedIn'));
      return;
    }

    if (!formData.user_name || !formData.user_email) {
      toast.error(t('pages.fillRequiredFields'));
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('event_registrations')
        .insert({
          event_id: eventId,
          user_id: user.id,
          user_name: formData.user_name,
          user_email: formData.user_email,
          user_phone: formData.user_phone || null,
          additional_info: formData.additional_info || null,
          status: 'pending'
        });

      if (error) {
        console.error('Error submitting registration:', error);
        toast.error('Failed to submit registration. Please try again.');
        return;
      }

      toast.success(t('pages.registrationSuccess'));
      
      // Reset form
      setFormData({
        user_name: '',
        user_email: user?.email || '',
        user_phone: '',
        additional_info: ''
      });
      
      onClose();
    } catch (error) {
      console.error('Error submitting registration:', error);
      toast.error('Failed to submit registration. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-purple-700">
            {t('pages.registerForEvent')}
          </DialogTitle>
          <p className="text-sm text-gray-600">
            {t('pages.registerForEventDesc', { eventTitle })}
          </p>
        </DialogHeader>
        
        <Card className="border-0 shadow-none">
          <CardContent className="p-0">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="user_name" className="text-sm font-medium text-gray-700 flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  {t('pages.fullName')} *
                </Label>
                <Input
                  id="user_name"
                  placeholder={t('pages.enterFullName')}
                  value={formData.user_name}
                  onChange={(e) => handleInputChange('user_name', e.target.value)}
                  className="mt-1 border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                  required
                />
              </div>

              <div>
                <Label htmlFor="user_email" className="text-sm font-medium text-gray-700 flex items-center">
                  <Mail className="h-4 w-4 mr-1" />
                  {t('pages.emailAddress')} *
                </Label>
                <Input
                  id="user_email"
                  type="email"
                  placeholder={t('pages.enterEmail')}
                  value={formData.user_email}
                  onChange={(e) => handleInputChange('user_email', e.target.value)}
                  className="mt-1 border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                  required
                />
              </div>

              <div>
                <Label htmlFor="user_phone" className="text-sm font-medium text-gray-700 flex items-center">
                  <Phone className="h-4 w-4 mr-1" />
                  {t('pages.phoneNumber')}
                </Label>
                <Input
                  id="user_phone"
                  type="tel"
                  placeholder={t('pages.enterPhone')}
                  value={formData.user_phone}
                  onChange={(e) => handleInputChange('user_phone', e.target.value)}
                  className="mt-1 border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                />
              </div>

              <div>
                <Label htmlFor="additional_info" className="text-sm font-medium text-gray-700 flex items-center">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  {t('pages.additionalInfo')}
                </Label>
                <Textarea
                  id="additional_info"
                  placeholder={t('pages.additionalInfoPlaceholder')}
                  value={formData.additional_info}
                  onChange={(e) => handleInputChange('additional_info', e.target.value)}
                  className="mt-1 border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                  rows={3}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {t('pages.additionalInfoHelp')}
                </p>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  {t('common.cancel')}
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {t('buttons.registering')}
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      {t('pages.submitRegistration')}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mail, CheckCircle, Loader2, Calendar, Newspaper, Building, Sparkles } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useEmailPreferences } from '@/hooks/useEmailPreferences';
import { z } from 'zod';

const emailSchema = z.object({
  email: z.string().trim().email({ message: "Please enter a valid email address" }),
  digestDay: z.string().min(1, { message: "Please select a day" }),
});

interface WeeklyEmailModalProps {
  trigger?: React.ReactNode;
}

export const WeeklyEmailModal = ({ trigger }: WeeklyEmailModalProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { user } = useAuth();
  const { preferences, updatePreferences, isUpdating } = useEmailPreferences();
  
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [digestDay, setDigestDay] = useState('monday');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; digestDay?: string }>({});

  // Set digest day from preferences when user is logged in
  useEffect(() => {
    if (preferences?.digest_day) {
      setDigestDay(preferences.digest_day);
    }
  }, [preferences?.digest_day]);

  const daysOfWeek = [
    { value: 'monday', label: t('weeklyEmail.days.monday', 'Monday') },
    { value: 'tuesday', label: t('weeklyEmail.days.tuesday', 'Tuesday') },
    { value: 'wednesday', label: t('weeklyEmail.days.wednesday', 'Wednesday') },
    { value: 'thursday', label: t('weeklyEmail.days.thursday', 'Thursday') },
    { value: 'friday', label: t('weeklyEmail.days.friday', 'Friday') },
    { value: 'saturday', label: t('weeklyEmail.days.saturday', 'Saturday') },
    { value: 'sunday', label: t('weeklyEmail.days.sunday', 'Sunday') },
  ];

  const getFormattedDay = (day: string) => {
    const dayObj = daysOfWeek.find(d => d.value === day);
    return dayObj?.label || day.charAt(0).toUpperCase() + day.slice(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // If user is logged in, use their existing preferences system
    if (user) {
      updatePreferences({ weekly_digest: true, digest_day: digestDay });
      setIsSuccess(true);
      setTimeout(() => {
        setOpen(false);
        setIsSuccess(false);
      }, 2000);
      return;
    }

    // For non-logged-in users, validate and store email
    const validation = emailSchema.safeParse({ email, digestDay });
    if (!validation.success) {
      const fieldErrors: { email?: string; digestDay?: string } = {};
      validation.error.errors.forEach((err) => {
        if (err.path[0] === 'email') fieldErrors.email = err.message;
        if (err.path[0] === 'digestDay') fieldErrors.digestDay = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      // Check if email already exists in profiles
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .maybeSingle();

      if (existingProfile) {
        // User exists but not logged in - update their preferences
        const { error } = await supabase
          .from('email_preferences')
          .upsert({
            user_id: existingProfile.id,
            weekly_digest: true,
            digest_day: digestDay,
          }, { onConflict: 'user_id' });

        if (error) throw error;
      } else {
        // Email not in system - inform them they need to create an account
        toast({
          title: t('weeklyEmail.accountRequired', 'Account Required'),
          description: t('weeklyEmail.accountRequiredMessage', 'To receive the weekly digest, please create an account or sign in with this email.'),
          variant: "default",
        });
        setIsSubmitting(false);
        return;
      }

      setIsSuccess(true);
      toast({
        title: t('weeklyEmail.subscribedTitle', 'Subscribed!'),
        description: t('weeklyEmail.subscribedMessage', "You've been added to the weekly digest."),
      });

      setTimeout(() => {
        setOpen(false);
        setIsSuccess(false);
        setEmail('');
      }, 2000);
    } catch (error) {
      console.error('Error subscribing:', error);
      toast({
        title: t('common.error', 'Error'),
        description: t('weeklyEmail.errorMessage', 'Failed to subscribe. Please try again.'),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setIsSuccess(false);
      setErrors({});
    }
  };

  // If user is logged in and already subscribed
  const isAlreadySubscribed = user && preferences?.weekly_digest;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="gap-2">
            <Mail className="h-4 w-4" />
            {t('weeklyEmail.button', 'Weekly Email')}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-left">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-full bg-primary/10">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-xl">
                {t('weeklyEmail.title', 'Weekly Community Digest')}
              </DialogTitle>
            </div>
          </div>
          <DialogDescription className="text-base">
            {t('weeklyEmail.description', 'Get a curated email with trending events, culture, and activities in your area every week.')}
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="relative">
              <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl animate-pulse" />
              <CheckCircle className="relative h-16 w-16 text-green-500 mb-4" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mt-2">
              {t('weeklyEmail.success', "You're subscribed!")}
            </h3>
            <p className="text-muted-foreground mt-2">
              {t('weeklyEmail.successMessage', 'Look out for your first digest soon.')}
            </p>
          </div>
        ) : isAlreadySubscribed ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="relative mb-4">
              <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl" />
              <CheckCircle className="relative h-14 w-14 text-green-500" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">
              {t('weeklyEmail.alreadySubscribed', "You're already subscribed!")}
            </h3>
            <p className="text-muted-foreground mt-2">
              {t('weeklyEmail.alreadySubscribedMessage', 'Your digest arrives every {{day}}.', { day: getFormattedDay(preferences?.digest_day || 'monday') })}
            </p>
            
            <div className="mt-4 w-full space-y-3">
              <div className="bg-muted/50 p-3 rounded-lg">
                <Label className="text-sm text-muted-foreground">{t('weeklyEmail.changeDay', 'Change delivery day')}</Label>
                <Select
                  value={digestDay}
                  onValueChange={(value) => {
                    setDigestDay(value);
                    updatePreferences({ digest_day: value });
                    toast({
                      title: t('weeklyEmail.dayUpdated', 'Delivery day updated'),
                      description: t('weeklyEmail.dayUpdatedMessage', 'Your digest will now arrive on {{day}}.', { day: getFormattedDay(value) }),
                    });
                  }}
                  disabled={isUpdating}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {daysOfWeek.map((day) => (
                      <SelectItem key={day.value} value={day.value}>
                        {day.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => {
                  updatePreferences({ weekly_digest: false });
                  toast({
                    title: t('weeklyEmail.unsubscribedTitle', 'Unsubscribed'),
                    description: t('weeklyEmail.unsubscribedMessage', "You've been removed from the weekly digest."),
                  });
                  setOpen(false);
                }}
                disabled={isUpdating}
              >
                {t('weeklyEmail.unsubscribe', 'Unsubscribe from digest')}
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {!user && (
              <div className="space-y-2">
                <Label htmlFor="email">{t('weeklyEmail.emailLabel', 'Email Address')}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                  className={errors.email ? 'border-destructive focus-visible:ring-destructive' : ''}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
              </div>
            )}

            {user && (
              <div className="flex items-center gap-3 p-3 bg-primary/5 border border-primary/10 rounded-lg">
                <div className="p-1.5 rounded-full bg-primary/10">
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">{t('weeklyEmail.loggedInAs', 'Subscribing as')}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="digest-day">{t('weeklyEmail.dayLabel', 'Preferred Delivery Day')}</Label>
              <Select
                value={digestDay}
                onValueChange={setDigestDay}
                disabled={isSubmitting || isUpdating}
              >
                <SelectTrigger id="digest-day">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {daysOfWeek.map((day) => (
                    <SelectItem key={day.value} value={day.value}>
                      {day.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/10 p-4 rounded-lg">
              <p className="font-medium text-sm mb-3">{t('weeklyEmail.whatYouGet', "What you'll receive:")}</p>
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-sm">
                  <div className="p-1.5 rounded-md bg-red-100 text-red-600">
                    <Calendar className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-muted-foreground">{t('weeklyEmail.feature1', 'Top trending events this week')}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="p-1.5 rounded-md bg-purple-100 text-purple-600">
                    <Newspaper className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-muted-foreground">{t('weeklyEmail.feature2', 'Latest community culture')}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="p-1.5 rounded-md bg-blue-100 text-blue-600">
                    <Building className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-muted-foreground">{t('weeklyEmail.feature3', 'New local businesses & services')}</span>
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-11 text-base" 
              disabled={isSubmitting || isUpdating}
            >
              {(isSubmitting || isUpdating) ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {t('weeklyEmail.subscribing', 'Subscribing...')}
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4 mr-2" />
                  {t('weeklyEmail.subscribe', 'Subscribe to Weekly Digest')}
                </>
              )}
            </Button>

            {!user && (
              <p className="text-xs text-center text-muted-foreground">
                {t('weeklyEmail.signInNote', 'Already have an account?')}{' '}
                <Link 
                  to="/auth" 
                  className="text-primary hover:underline font-medium"
                  onClick={() => setOpen(false)}
                >
                  {t('weeklyEmail.signInLink', 'Sign in')}
                </Link>
                {' '}{t('weeklyEmail.signInNoteContinued', 'to manage your preferences.')}
              </p>
            )}
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

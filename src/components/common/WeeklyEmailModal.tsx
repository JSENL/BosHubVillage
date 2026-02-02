import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mail, CheckCircle, Loader2 } from 'lucide-react';
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

  const daysOfWeek = [
    { value: 'monday', label: 'Monday' },
    { value: 'tuesday', label: 'Tuesday' },
    { value: 'wednesday', label: 'Wednesday' },
    { value: 'thursday', label: 'Thursday' },
    { value: 'friday', label: 'Friday' },
    { value: 'saturday', label: 'Saturday' },
    { value: 'sunday', label: 'Sunday' },
  ];

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
          title: "Account Required",
          description: "To receive the weekly digest, please create an account or sign in with this email.",
          variant: "default",
        });
        setIsSubmitting(false);
        return;
      }

      setIsSuccess(true);
      toast({
        title: "Subscribed!",
        description: "You've been added to the weekly digest.",
      });

      setTimeout(() => {
        setOpen(false);
        setIsSuccess(false);
        setEmail('');
      }, 2000);
    } catch (error) {
      console.error('Error subscribing:', error);
      toast({
        title: "Error",
        description: "Failed to subscribe. Please try again.",
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
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            {t('weeklyEmail.title', 'Weekly Community Digest')}
          </DialogTitle>
          <DialogDescription>
            {t('weeklyEmail.description', 'Get a curated email with trending events, news, and activities in your area every week.')}
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
            <h3 className="text-lg font-semibold text-foreground">
              {t('weeklyEmail.success', "You're subscribed!")}
            </h3>
            <p className="text-muted-foreground mt-2">
              {t('weeklyEmail.successMessage', 'Look out for your first digest soon.')}
            </p>
          </div>
        ) : isAlreadySubscribed ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
            <h3 className="text-lg font-semibold text-foreground">
              {t('weeklyEmail.alreadySubscribed', "You're already subscribed!")}
            </h3>
            <p className="text-muted-foreground mt-2">
              {t('weeklyEmail.alreadySubscribedMessage', `Your digest arrives every ${preferences?.digest_day || 'Monday'}.`)}
            </p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => {
                updatePreferences({ weekly_digest: false });
                setOpen(false);
              }}
            >
              {t('weeklyEmail.unsubscribe', 'Unsubscribe')}
            </Button>
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
                  className={errors.email ? 'border-destructive' : ''}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
              </div>
            )}

            {user && (
              <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                {t('weeklyEmail.loggedInAs', 'Subscribing as')} <strong>{user.email}</strong>
              </p>
            )}

            <div className="space-y-2">
              <Label htmlFor="digest-day">{t('weeklyEmail.dayLabel', 'Preferred Day')}</Label>
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

            <div className="bg-muted/50 p-3 rounded-md text-sm text-muted-foreground">
              <p>{t('weeklyEmail.whatYouGet', "What you'll receive:")}</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>{t('weeklyEmail.feature1', 'Top trending events this week')}</li>
                <li>{t('weeklyEmail.feature2', 'Latest community news')}</li>
                <li>{t('weeklyEmail.feature3', 'New local businesses & resources')}</li>
              </ul>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting || isUpdating}
            >
              {(isSubmitting || isUpdating) ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {t('weeklyEmail.subscribing', 'Subscribing...')}
                </>
              ) : (
                t('weeklyEmail.subscribe', 'Subscribe to Weekly Digest')
              )}
            </Button>

            {!user && (
              <p className="text-xs text-center text-muted-foreground">
                {t('weeklyEmail.signInNote', 'Already have an account? Sign in to manage your preferences.')}
              </p>
            )}
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

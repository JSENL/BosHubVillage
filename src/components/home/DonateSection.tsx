import { useTranslation } from 'react-i18next';
import { DonateButton } from '@/components/common/DonateButton';
import { WeeklyEmailModal } from '@/components/common/WeeklyEmailModal';
import { Button } from '@/components/ui/button';
import { Heart, Users, Calendar, Mail } from 'lucide-react';

export const DonateSection = () => {
  const { t } = useTranslation();

  return (
    <section className="bg-gradient-to-r from-logo-vibrant-blue to-logo-caribbean-teal rounded-xl p-6 md:p-8 text-white">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-logo-coral-orange" />
            <h2 className="text-xl md:text-2xl font-bold">
              {t('donate.title', 'Support Your Community Hub')}
            </h2>
          </div>
          <p className="text-white/90 max-w-xl">
            {t('donate.description', 'Your donation helps us maintain this free platform, organize community events, and support local initiatives. Every contribution makes a difference!')}
          </p>
          <div className="flex items-center gap-6 text-sm text-white/80">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>{t('donate.stat1', '1000+ Community Members')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{t('donate.stat2', '500+ Events Hosted')}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 shrink-0">
          <WeeklyEmailModal 
            trigger={
              <Button 
                size="lg" 
                variant="outline"
                className="bg-white/10 text-white border-white/30 hover:bg-white/20 shadow-lg gap-2"
              >
                <Mail className="h-4 w-4" />
                {t('weeklyEmail.button', 'Weekly Email')}
              </Button>
            }
          />
          <DonateButton 
            size="lg" 
            className="bg-white text-logo-vibrant-blue hover:bg-white/90 shadow-lg"
          />
        </div>
      </div>
    </section>
  );
};

import { useTranslation } from 'react-i18next';
import { DonateButton } from '@/components/common/DonateButton';
import { Heart, Users, Calendar } from 'lucide-react';

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
        <div className="shrink-0">
          <DonateButton 
            size="lg" 
            className="bg-white text-logo-vibrant-blue hover:bg-white/90 shadow-lg"
          />
        </div>
      </div>
    </section>
  );
};

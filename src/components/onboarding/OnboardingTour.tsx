import { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import Joyride, { Step, CallBackProps, STATUS } from 'react-joyride';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import { MapPin, Calendar, Building, Wrench, Star, Languages, Check } from 'lucide-react';

type TourType = 'event' | 'business' | 'resource' | 'general' | null;
type ModalStep = 'language' | 'tour';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
];

export interface OnboardingTourRef {
  openTour: () => void;
}

// Hook to get translated steps
const useTranslatedSteps = () => {
  const { t } = useTranslation();

  const generalSteps: Step[] = [
    {
      target: 'body',
      content: t('onboarding.general.welcome'),
      placement: 'center',
    },
    {
      target: '[data-tour="view-toggle"]',
      content: t('onboarding.general.viewToggle'),
      disableBeacon: true,
    },
    {
      target: '[data-tour="search"]',
      content: t('onboarding.general.search'),
      disableBeacon: true,
    },
    {
      target: '[data-tour="filters"]',
      content: t('onboarding.general.filters'),
      disableBeacon: true,
    },
    {
      target: 'body',
      content: t('onboarding.general.nearMe'),
      placement: 'center',
      disableBeacon: true,
    },
    {
      target: 'body',
      content: t('onboarding.general.discovery'),
      placement: 'center',
      disableBeacon: true,
    },
    {
      target: 'body',
      content: t('onboarding.general.savedSearches'),
      placement: 'center',
      disableBeacon: true,
    },
    {
      target: 'body',
      content: t('onboarding.general.submitContent'),
      placement: 'center',
      disableBeacon: true,
    },
    {
      target: 'body',
      content: t('onboarding.general.socialFeatures'),
      placement: 'center',
      disableBeacon: true,
    },
    {
      target: 'body',
      content: t('onboarding.general.account'),
      placement: 'center',
      disableBeacon: true,
    },
    {
      target: 'body',
      content: t('onboarding.general.weeklyDigest'),
      placement: 'center',
      disableBeacon: true,
    },
    {
      target: 'body',
      content: t('onboarding.general.news'),
      placement: 'center',
      disableBeacon: true,
    },
    {
      target: 'body',
      content: t('onboarding.general.help'),
      placement: 'center',
      disableBeacon: true,
    },
  ];

  const eventSteps: Step[] = [
    {
      target: 'body',
      content: t('onboarding.events.intro'),
      placement: 'center',
    },
    {
      target: '[data-tour="submit-event"]',
      content: t('onboarding.events.submit'),
      disableBeacon: true,
    },
    {
      target: '[data-tour="view-toggle"]',
      content: t('onboarding.events.views'),
      disableBeacon: true,
    },
    {
      target: '[data-tour="filters"]',
      content: t('onboarding.events.filters'),
      disableBeacon: true,
    },
    {
      target: '[data-tour="search"]',
      content: t('onboarding.events.search'),
      disableBeacon: true,
    },
    {
      target: 'body',
      content: t('onboarding.events.engage'),
      placement: 'center',
      disableBeacon: true,
    },
    {
      target: 'body',
      content: t('onboarding.events.ready'),
      placement: 'center',
      disableBeacon: true,
    },
  ];

  const businessSteps: Step[] = [
    {
      target: 'body',
      content: t('onboarding.businesses.intro'),
      placement: 'center',
    },
    {
      target: '[data-tour="submit-business"]',
      content: t('onboarding.businesses.submit'),
      disableBeacon: true,
    },
    {
      target: '[data-tour="view-toggle"]',
      content: t('onboarding.businesses.views'),
      disableBeacon: true,
    },
    {
      target: '[data-tour="filters"]',
      content: t('onboarding.businesses.filters'),
      disableBeacon: true,
    },
    {
      target: '[data-tour="search"]',
      content: t('onboarding.businesses.search'),
      disableBeacon: true,
    },
    {
      target: 'body',
      content: t('onboarding.businesses.interact'),
      placement: 'center',
      disableBeacon: true,
    },
    {
      target: 'body',
      content: t('onboarding.businesses.owners'),
      placement: 'center',
      disableBeacon: true,
    },
    {
      target: 'body',
      content: t('onboarding.businesses.ready'),
      placement: 'center',
      disableBeacon: true,
    },
  ];

  const resourceSteps: Step[] = [
    {
      target: 'body',
      content: t('onboarding.services.intro'),
      placement: 'center',
    },
    {
      target: '[data-tour="submit-resource"]',
      content: t('onboarding.services.submit'),
      disableBeacon: true,
    },
    {
      target: '[data-tour="view-toggle"]',
      content: t('onboarding.services.views'),
      disableBeacon: true,
    },
    {
      target: '[data-tour="filters"]',
      content: t('onboarding.services.filters'),
      disableBeacon: true,
    },
    {
      target: '[data-tour="search"]',
      content: t('onboarding.services.search'),
      disableBeacon: true,
    },
    {
      target: 'body',
      content: t('onboarding.services.connect'),
      placement: 'center',
      disableBeacon: true,
    },
    {
      target: 'body',
      content: t('onboarding.services.ready'),
      placement: 'center',
      disableBeacon: true,
    },
  ];

  return { generalSteps, eventSteps, businessSteps, resourceSteps };
};

export const OnboardingTour = forwardRef<OnboardingTourRef>((props, ref) => {
  const { t, i18n } = useTranslation();
  const [showWelcome, setShowWelcome] = useState(false);
  const [modalStep, setModalStep] = useState<ModalStep>('language');
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language || 'en');
  const [activeTour, setActiveTour] = useState<TourType>(null);
  const [runTour, setRunTour] = useState(false);
  const { generalSteps, eventSteps, businessSteps, resourceSteps } = useTranslatedSteps();

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    if (!hasSeenOnboarding) {
      setShowWelcome(true);
      setModalStep('language');
    }
  }, []);

  // Expose method to parent component to open tour manually
  useImperativeHandle(ref, () => ({
    openTour: () => {
      setShowWelcome(true);
      setModalStep('language');
      setSelectedLanguage(i18n.language || 'en');
    }
  }));

  const handleLanguageSelect = (langCode: string) => {
    setSelectedLanguage(langCode);
  };

  const handleLanguageContinue = () => {
    i18n.changeLanguage(selectedLanguage);
    localStorage.setItem('language', selectedLanguage);
    setModalStep('tour');
  };

  const handleTourChoice = (choice: TourType) => {
    if (choice === null) {
      // User chose "no help"
      setShowWelcome(false);
      localStorage.setItem('hasSeenOnboarding', 'true');
    } else {
      setActiveTour(choice);
      setShowWelcome(false);
      setRunTour(true);
    }
  };

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      setRunTour(false);
      setActiveTour(null);
      localStorage.setItem('hasSeenOnboarding', 'true');
    }
  };

  const getStepsForTour = (): Step[] => {
    switch (activeTour) {
      case 'general':
        return generalSteps;
      case 'event':
        return eventSteps;
      case 'business':
        return businessSteps;
      case 'resource':
        return resourceSteps;
      default:
        return [];
    }
  };

  const neighborhoods = ['Mattapan', 'Roxbury', 'Hyde Park', 'Dorchester', 'Jamaica Plain'];

  return (
    <>
      <Dialog open={showWelcome} onOpenChange={setShowWelcome}>
        <DialogContent className="sm:max-w-lg max-w-[95vw] max-h-[90vh] overflow-y-auto p-0 gap-0 border-0 shadow-2xl">
          {modalStep === 'language' ? (
            /* Language Selection Step */
            <>
              <div className="bg-gradient-to-br from-primary via-primary to-primary/80 p-6 sm:p-8 text-primary-foreground rounded-t-lg">
                <DialogHeader className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Languages className="h-6 w-6" />
                    <DialogTitle className="text-xl sm:text-2xl font-bold">
                      {t('onboarding.languageSelection.title')}
                    </DialogTitle>
                  </div>
                  <DialogDescription className="text-sm sm:text-base text-primary-foreground/90">
                    {t('onboarding.languageSelection.subtitle')}
                  </DialogDescription>
                </DialogHeader>
              </div>
              
              <div className="p-4 sm:p-6 space-y-4">
                <div className="grid grid-cols-1 gap-2">
                  {languages.map((language) => (
                    <Button
                      key={language.code}
                      onClick={() => handleLanguageSelect(language.code)}
                      variant={selectedLanguage === language.code ? "default" : "outline"}
                      className={`w-full justify-between h-auto py-3 px-4 text-left transition-all ${
                        selectedLanguage === language.code 
                          ? 'bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2' 
                          : 'hover:bg-accent'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{language.flag}</span>
                        <span className="font-medium">{language.name}</span>
                      </div>
                      {selectedLanguage === language.code && (
                        <Check className="h-5 w-5" />
                      )}
                    </Button>
                  ))}
                </div>
                
                <Button
                  onClick={handleLanguageContinue}
                  className="w-full mt-4 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:from-primary/90 hover:to-primary/70 shadow-md"
                >
                  {t('onboarding.languageSelection.continue')}
                </Button>
              </div>
            </>
          ) : (
            /* Tour Selection Step */
            <>
              {/* Header with gradient background */}
              <div className="bg-gradient-to-br from-primary via-primary to-primary/80 p-6 sm:p-8 text-primary-foreground rounded-t-lg">
                <DialogHeader className="space-y-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-6 w-6" />
                    <DialogTitle className="text-xl sm:text-2xl font-bold">
                      {t('onboarding.modal.title')}
                    </DialogTitle>
                  </div>
                  <DialogDescription className="text-sm sm:text-base text-primary-foreground/90">
                    {t('onboarding.modal.subtitle')}
                  </DialogDescription>
                </DialogHeader>
                
                {/* Neighborhood badges */}
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {neighborhoods.map((neighborhood) => (
                    <Badge 
                      key={neighborhood} 
                      variant="secondary" 
                      className="bg-white/20 text-primary-foreground border-0 text-xs font-medium"
                    >
                      {neighborhood}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {/* Tour options */}
              <div className="p-4 sm:p-6 space-y-3">
                {/* Main tour option */}
                <Button
                  onClick={() => handleTourChoice('general')}
                  className="w-full justify-start text-left h-auto py-4 px-4 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:from-primary/90 hover:to-primary/70 shadow-md"
                >
                  <div className="flex items-start gap-3 w-full">
                    <div className="p-2 bg-white/20 rounded-lg shrink-0">
                      <Star className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-sm sm:text-base">{t('onboarding.modal.generalTitle')}</div>
                      <div className="text-xs sm:text-sm opacity-90 mt-0.5">{t('onboarding.modal.generalDesc')}</div>
                    </div>
                  </div>
                </Button>
                
                {/* Divider */}
                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-3 text-muted-foreground">{t('onboarding.modal.orChoose')}</span>
                  </div>
                </div>
                
                {/* Topic-specific tours */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <Button
                    onClick={() => handleTourChoice('event')}
                    variant="outline"
                    className="h-auto py-3 px-3 flex flex-col items-center text-center gap-2 hover:bg-accent hover:border-primary/50 transition-all"
                  >
                    <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                      <Calendar className="h-5 w-5 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{t('onboarding.modal.eventsTitle')}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{t('onboarding.modal.eventsDesc')}</div>
                    </div>
                  </Button>
                  
                  <Button
                    onClick={() => handleTourChoice('business')}
                    variant="outline"
                    className="h-auto py-3 px-3 flex flex-col items-center text-center gap-2 hover:bg-accent hover:border-primary/50 transition-all"
                  >
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <Building className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{t('onboarding.modal.businessTitle')}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{t('onboarding.modal.businessDesc')}</div>
                    </div>
                  </Button>
                  
                  <Button
                    onClick={() => handleTourChoice('resource')}
                    variant="outline"
                    className="h-auto py-3 px-3 flex flex-col items-center text-center gap-2 hover:bg-accent hover:border-primary/50 transition-all"
                  >
                    <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                      <Wrench className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{t('onboarding.modal.servicesTitle')}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{t('onboarding.modal.servicesDesc')}</div>
                    </div>
                  </Button>
                </div>
                
                {/* Skip button */}
                <Button
                  onClick={() => handleTourChoice(null)}
                  variant="ghost"
                  className="w-full mt-2 text-sm text-muted-foreground hover:text-foreground"
                >
                  {t('onboarding.modal.skip')}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {runTour && (
        <Joyride
          steps={getStepsForTour()}
          run={runTour}
          continuous
          showProgress
          showSkipButton
          callback={handleJoyrideCallback}
          locale={{
            back: t('onboarding.navigation.back'),
            close: t('onboarding.navigation.close'),
            last: t('onboarding.navigation.finish'),
            next: t('onboarding.navigation.next'),
            skip: t('onboarding.navigation.skip'),
          }}
          styles={{
            options: {
              primaryColor: 'hsl(var(--primary))',
              zIndex: 10000,
              width: '100%',
            },
            tooltip: {
              maxWidth: '90vw',
              padding: '16px 20px',
              borderRadius: '12px',
            },
            tooltipContainer: {
              textAlign: 'left',
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
              hyphens: 'auto',
            },
            tooltipContent: {
              fontSize: '14px',
              lineHeight: '1.6',
              padding: '8px 0',
            },
            buttonNext: {
              fontSize: '14px',
              padding: '10px 20px',
              borderRadius: '8px',
              fontWeight: 600,
            },
            buttonBack: {
              fontSize: '14px',
              padding: '10px 20px',
              borderRadius: '8px',
            },
            buttonSkip: {
              fontSize: '14px',
              padding: '10px 16px',
            },
            spotlight: {
              borderRadius: '12px',
            },
          }}
          floaterProps={{
            disableAnimation: true,
          }}
        />
      )}
    </>
  );
});

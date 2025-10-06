import { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import Joyride, { Step, CallBackProps, STATUS } from 'react-joyride';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

type TourType = 'event' | 'business' | 'resource' | null;

export interface OnboardingTourRef {
  openTour: () => void;
}

const eventSteps: Step[] = [
  {
    target: 'body',
    content: "Let me show you how to post and explore events! You can browse events, submit your own, use filters, and view them on an interactive map.",
    placement: 'center',
  },
  {
    target: '[data-tour="submit-event"]',
    content: "Click here to submit a new event. Include details like title, date, time, location, category, and whether it's free or paid. Events are reviewed before being published.",
    disableBeacon: true,
  },
  {
    target: '[data-tour="view-toggle"]',
    content: "Switch between grid, list, map, and calendar views to explore events in different ways. Each view helps you discover events differently.",
    disableBeacon: true,
  },
  {
    target: '[data-tour="filters"]',
    content: "Use filters to find specific events by category, date range, type (free/paid), neighborhood, or village. Click 'Clear All' to reset filters.",
    disableBeacon: true,
  },
  {
    target: '[data-tour="search"]',
    content: "Search for events using keywords like event names, descriptions, or locations. Combine search with filters for precise results.",
    disableBeacon: true,
  },
  {
    target: 'body',
    content: "Ready to submit your own event? Click 'Submit Event' in the navigation menu to create your listing. Fill out the form with event details, and it will be reviewed by our team before being published to the platform.",
    placement: 'center',
    disableBeacon: true,
  },
];

const businessSteps: Step[] = [
  {
    target: 'body',
    content: "Let me show you how to post and discover businesses! You can add your business, browse the directory, contact businesses, and leave reviews.",
    placement: 'center',
  },
  {
    target: '[data-tour="submit-business"]',
    content: "Click here to submit your business listing. Include business name, description, category, contact info, hours, and location. Listings are reviewed before publication.",
    disableBeacon: true,
  },
  {
    target: '[data-tour="view-toggle"]',
    content: "Switch between grid, list, and map views to explore businesses. Map view shows all businesses with color-coded markers for easy discovery.",
    disableBeacon: true,
  },
  {
    target: '[data-tour="filters"]',
    content: "Use filters to find businesses by category, location, or neighborhood. You can also bookmark businesses and send direct messages to business owners.",
    disableBeacon: true,
  },
  {
    target: '[data-tour="search"]',
    content: "Search for businesses by name, category, or keywords. Click on any business to view details, contact info, hours, and customer reviews.",
    disableBeacon: true,
  },
  {
    target: 'body',
    content: "Ready to list your business? Click 'Submit Business' in the navigation menu. Complete the form with your business information, and our team will review it before publishing to the directory.",
    placement: 'center',
    disableBeacon: true,
  },
];

const resourceSteps: Step[] = [
  {
    target: 'body',
    content: "Let me show you how to post and find local resources! Discover service providers like plumbers, electricians, tutors, and more in your area.",
    placement: 'center',
  },
  {
    target: '[data-tour="submit-resource"]',
    content: "Click here to submit a local resource or service. Include service description, categories, contact info, coverage area, and certifications. Submissions are reviewed before publication.",
    disableBeacon: true,
  },
  {
    target: '[data-tour="view-toggle"]',
    content: "Switch between grid, list, and map views to find local services. The map shows service providers near you with location markers.",
    disableBeacon: true,
  },
  {
    target: '[data-tour="filters"]',
    content: "Use filters to find services by category, location, or service type. Filter by neighborhood to find providers in your specific area.",
    disableBeacon: true,
  },
  {
    target: '[data-tour="search"]',
    content: "Search for specific services using keywords. Find plumbers, electricians, tutors, cleaners, or any professional service you need.",
    disableBeacon: true,
  },
  {
    target: 'body',
    content: "Ready to add your service? Click 'Submit Local Resource' in the navigation menu. Fill out the form with service details, and it will be reviewed before being published to help others find your services.",
    placement: 'center',
    disableBeacon: true,
  },
];

export const OnboardingTour = forwardRef<OnboardingTourRef>((props, ref) => {
  const [showWelcome, setShowWelcome] = useState(false);
  const [activeTour, setActiveTour] = useState<TourType>(null);
  const [runTour, setRunTour] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    if (!hasSeenOnboarding) {
      setShowWelcome(true);
    }
  }, []);

  // Expose method to parent component to open tour manually
  useImperativeHandle(ref, () => ({
    openTour: () => {
      setShowWelcome(true);
    }
  }));

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
      // Show welcome dialog again to ask if they want another tour
      setTimeout(() => setShowWelcome(true), 500);
    }
  };

  const getStepsForTour = (): Step[] => {
    switch (activeTour) {
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

  return (
    <>
      <Dialog open={showWelcome} onOpenChange={setShowWelcome}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl">Welcome! How can we help you?</DialogTitle>
            <DialogDescription>
              Choose what you'd like to do and we'll guide you through the features.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 mt-4">
            <Button
              onClick={() => handleTourChoice('event')}
              variant="outline"
              className="w-full justify-start text-left h-auto py-4"
            >
              <div>
                <div className="font-semibold">Are you posting an event?</div>
                <div className="text-sm text-muted-foreground">Learn how to create and share events</div>
              </div>
            </Button>
            <Button
              onClick={() => handleTourChoice('business')}
              variant="outline"
              className="w-full justify-start text-left h-auto py-4"
            >
              <div>
                <div className="font-semibold">Are you posting a business?</div>
                <div className="text-sm text-muted-foreground">Discover how to list your business</div>
              </div>
            </Button>
            <Button
              onClick={() => handleTourChoice('resource')}
              variant="outline"
              className="w-full justify-start text-left h-auto py-4"
            >
              <div>
                <div className="font-semibold">Are you posting a local resource?</div>
                <div className="text-sm text-muted-foreground">Learn how to share local resources</div>
              </div>
            </Button>
            <Button
              onClick={() => handleTourChoice(null)}
              variant="secondary"
              className="w-full mt-2"
            >
              Want to just start with no help?
            </Button>
          </div>
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
          styles={{
            options: {
              primaryColor: 'hsl(var(--primary))',
              zIndex: 10000,
            },
          }}
        />
      )}
    </>
  );
});

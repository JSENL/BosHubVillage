import { useState, useEffect } from 'react';
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

const eventSteps: Step[] = [
  {
    target: 'body',
    content: "Let me show you how to post and explore events!",
    placement: 'center',
  },
  {
    target: '[data-tour="submit-event"]',
    content: "Click here to submit a new event to the community.",
    disableBeacon: true,
  },
  {
    target: '[data-tour="view-toggle"]',
    content: "Switch between map and list views to explore events.",
    disableBeacon: true,
  },
  {
    target: '[data-tour="filters"]',
    content: "Use filters to find specific events by category, date, or location.",
    disableBeacon: true,
  },
  {
    target: '[data-tour="search"]',
    content: "Search for events by keywords.",
    disableBeacon: true,
  },
];

const businessSteps: Step[] = [
  {
    target: 'body',
    content: "Let me show you how to post and discover businesses!",
    placement: 'center',
  },
  {
    target: '[data-tour="submit-business"]',
    content: "Click here to submit your business to the directory.",
    disableBeacon: true,
  },
  {
    target: '[data-tour="view-toggle"]',
    content: "Switch between map and list views to explore businesses.",
    disableBeacon: true,
  },
  {
    target: '[data-tour="filters"]',
    content: "Use filters to find businesses by category or location.",
    disableBeacon: true,
  },
  {
    target: '[data-tour="search"]',
    content: "Search for specific businesses.",
    disableBeacon: true,
  },
];

const resourceSteps: Step[] = [
  {
    target: 'body',
    content: "Let me show you how to post and find local resources!",
    placement: 'center',
  },
  {
    target: '[data-tour="submit-resource"]',
    content: "Click here to submit a local resource or service.",
    disableBeacon: true,
  },
  {
    target: '[data-tour="view-toggle"]',
    content: "Switch between map and list views to explore resources.",
    disableBeacon: true,
  },
  {
    target: '[data-tour="filters"]',
    content: "Use filters to find resources by category or location.",
    disableBeacon: true,
  },
  {
    target: '[data-tour="search"]',
    content: "Search for specific resources.",
    disableBeacon: true,
  },
];

export const OnboardingTour = () => {
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
};

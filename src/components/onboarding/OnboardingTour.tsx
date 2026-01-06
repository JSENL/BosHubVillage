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

type TourType = 'event' | 'business' | 'resource' | 'general' | null;

export interface OnboardingTourRef {
  openTour: () => void;
}

const generalSteps: Step[] = [
  {
    target: 'body',
    content: "Welcome to HubVillage! This is your community hub for discovering local events, businesses, news, and services. Let me show you all the features available to you.",
    placement: 'center',
  },
  {
    target: '[data-tour="view-toggle"]',
    content: "Switch between Map and List views to explore content. Map view shows everything with location markers, while List view displays items in a scrollable grid. The map view also has a resizable bottom panel for browsing items.",
    disableBeacon: true,
  },
  {
    target: '[data-tour="search"]',
    content: "Search across all content types - events, businesses, news, and local services. The search works in real-time as you type and searches through titles, descriptions, and locations.",
    disableBeacon: true,
  },
  {
    target: '[data-tour="filters"]',
    content: "Use powerful filters to narrow down results. Filter by content type (events, businesses, news, local services), categories, neighborhoods, villages, and date ranges. Use the 'Near Me' filter to find content within a specific distance from your location!",
    disableBeacon: true,
  },
  {
    target: 'body',
    content: "NEAR ME & LOCATION: Enable the 'Near Me' filter to find events, businesses, and services close to you! Set your preferred distance (1-50 miles) and we'll show only what's nearby. Great for discovering local gems in your area.",
    placement: 'center',
    disableBeacon: true,
  },
  {
    target: 'body',
    content: "The Discovery Sidebar (right side on desktop, top on mobile) shows: Trending items with the most engagement, Your bookmarks for quick access, People to follow and connect with, Activity feed from users you follow, and your Saved Searches with notification options!",
    placement: 'center',
    disableBeacon: true,
  },
  {
    target: 'body',
    content: "SAVED SEARCHES: Save your favorite filter combinations! When you find filters you use often, save them as a search. Enable notifications to get alerts when new content matches your saved search - either in-app or via email!",
    placement: 'center',
    disableBeacon: true,
  },
  {
    target: 'body',
    content: "SUBMIT CONTENT: Click the orange 'Submit' button in the navigation to add Events (with calendar integration and maps), Businesses (with contact info, hours, and messaging), News articles, or Local Services (plumbers, electricians, tutors, etc.). All submissions are reviewed before publishing.",
    placement: 'center',
    disableBeacon: true,
  },
  {
    target: 'body',
    content: "SOCIAL FEATURES: Bookmark items you want to save, Leave comments and star ratings on businesses and events, Send direct messages to business owners, Follow other users to see their activity, View trending content based on community engagement. Build your community network!",
    placement: 'center',
    disableBeacon: true,
  },
  {
    target: 'body',
    content: "YOUR ACCOUNT: Access your profile to see your submissions and activity, Visit 'My Messages' to manage conversations with businesses and admins, Track 'My Submissions' to see approval status, Edit your profile to set up Weekly Email Digests with community highlights!",
    placement: 'center',
    disableBeacon: true,
  },
  {
    target: 'body',
    content: "WEEKLY EMAIL DIGEST: Never miss community updates! Go to Edit Profile to enable weekly email digests. Choose your preferred day and we'll send you a summary of new events, trending content, and activity from people you follow.",
    placement: 'center',
    disableBeacon: true,
  },
  {
    target: 'body',
    content: "EXPLORE NEWS: Click 'News' in the navigation to view community news and announcements in a beautiful magazine-style layout. You can also submit your own news articles for the community to see.",
    placement: 'center',
    disableBeacon: true,
  },
  {
    target: 'body',
    content: "NEED HELP? Visit the FAQ page (link in navigation) for comprehensive answers to 75+ questions! Contact admins directly through the 'Contact Admin' option in your account menu. Click the help button (bottom right) anytime to restart this tour.",
    placement: 'center',
    disableBeacon: true,
  },
];

const eventSteps: Step[] = [
  {
    target: 'body',
    content: "Let me show you how to post and explore events! You can browse events, submit your own, use filters, view on interactive maps, and even get calendar integration.",
    placement: 'center',
  },
  {
    target: '[data-tour="submit-event"]',
    content: "Click here to submit a new event. Include details like title, date, time, location, category, whether it's free or paid, and upload images or PDFs. You can create single or recurring events. All events are reviewed before publication.",
    disableBeacon: true,
  },
  {
    target: '[data-tour="view-toggle"]',
    content: "Switch between grid, list, map, and calendar views to explore events. Map view shows all events with interactive markers, Calendar view displays events on a monthly calendar, Grid and List views show event cards with details and images.",
    disableBeacon: true,
  },
  {
    target: '[data-tour="filters"]',
    content: "Use filters to find specific events by category (music, food, sports, etc.), date range (pick individual dates or ranges), event type (free/paid), neighborhood, or village. Combine multiple filters for precise results. The date picker supports both single dates and date ranges.",
    disableBeacon: true,
  },
  {
    target: '[data-tour="search"]',
    content: "Search for events using keywords like event names, descriptions, locations, or organizers. The search works in real-time and highlights matching results instantly.",
    disableBeacon: true,
  },
  {
    target: 'body',
    content: "ENGAGE WITH EVENTS: Click any event to view full details including location, time, pricing, and description. Leave comments and ask questions about events. Get directions to event locations via the map. Bookmark events to save them for later. Register for events (when available). Share events on social media.",
    placement: 'center',
    disableBeacon: true,
  },
  {
    target: 'body',
    content: "Ready to submit your own event? Click 'Submit Event' in the navigation menu. Fill out the form with all event details, upload images or PDFs, and submit for review. You'll be able to track the approval status in 'My Submissions'. Once approved, your event will appear on the platform for the whole community to see!",
    placement: 'center',
    disableBeacon: true,
  },
];

const businessSteps: Step[] = [
  {
    target: 'body',
    content: "Let me show you how to post and discover businesses! You can add your business, browse the directory, send messages, leave reviews, and connect with local businesses.",
    placement: 'center',
  },
  {
    target: '[data-tour="submit-business"]',
    content: "Click here to submit your business listing. Include business name, detailed description, category (restaurant, retail, service, etc.), contact info (phone, email, website, social media), business hours, location with map pin, and upload photos. All listings are reviewed before publication.",
    disableBeacon: true,
  },
  {
    target: '[data-tour="view-toggle"]',
    content: "Switch between grid, list, and map views to explore businesses. Map view shows all businesses with color-coded markers by category for easy discovery. Grid and List views display business cards with ratings, hours, and quick actions.",
    disableBeacon: true,
  },
  {
    target: '[data-tour="filters"]',
    content: "Use filters to find businesses by category (food, retail, professional services, etc.), location, neighborhood, or open/closed status. Filter by ratings to find highly-rated businesses. You can also bookmark businesses for quick access later.",
    disableBeacon: true,
  },
  {
    target: '[data-tour="search"]',
    content: "Search for businesses by name, category, keywords, or services offered. Click on any business card to view full details including photos, hours, contact information, location map, and customer reviews.",
    disableBeacon: true,
  },
  {
    target: 'body',
    content: "INTERACT WITH BUSINESSES: Send direct messages to business owners with questions or inquiries. Leave star ratings and written reviews to help others. Bookmark your favorite businesses for easy access. Get turn-by-turn directions to business locations. View business hours and contact details. See all reviews from other community members.",
    placement: 'center',
    disableBeacon: true,
  },
  {
    target: 'body',
    content: "BUSINESS OWNERS: If you submit a business, you'll gain access to a Business Dashboard where you can: View and respond to customer messages, Monitor customer reviews and ratings, Edit your business information, Upload new photos, Update hours and contact details. You'll be notified of new messages and reviews!",
    placement: 'center',
    disableBeacon: true,
  },
  {
    target: 'body',
    content: "Ready to list your business? Click 'Submit Business' in the navigation menu. Complete the detailed form with your business information, upload quality photos, and submit for review. Track approval status in 'My Submissions'. Once approved, customers can find you, message you, and leave reviews!",
    placement: 'center',
    disableBeacon: true,
  },
];

const resourceSteps: Step[] = [
  {
    target: 'body',
    content: "Let me show you how to post and find local resources! Discover trusted service providers like plumbers, electricians, tutors, cleaners, landscapers, and more in your community.",
    placement: 'center',
  },
  {
    target: '[data-tour="submit-resource"]',
    content: "Click here to submit a local resource or service. Include service name, detailed description of services offered, multiple service categories, contact information (phone, email, website), coverage area (neighborhoods/villages you serve), certifications or licenses, pricing info, and photos. All submissions are reviewed before publication.",
    disableBeacon: true,
  },
  {
    target: '[data-tour="view-toggle"]',
    content: "Switch between grid, list, and map views to find local services. Map view shows all service providers with location markers, making it easy to find providers near you. Grid and List views display service cards with contact info and categories.",
    disableBeacon: true,
  },
  {
    target: '[data-tour="filters"]',
    content: "Use filters to find services by category (home services, professional services, personal services, etc.), location, specific neighborhoods, or villages. Filter by service type to find exactly what you need - plumbing, electrical, tutoring, cleaning, lawn care, and more.",
    disableBeacon: true,
  },
  {
    target: '[data-tour="search"]',
    content: "Search for specific services using keywords like 'plumber', 'tutor', 'electrician', 'cleaner', 'landscaper', or any professional service you need. Click on any service card to view full details, contact information, and service areas.",
    disableBeacon: true,
  },
  {
    target: 'body',
    content: "CONNECT WITH SERVICE PROVIDERS: View complete service details including all offered services, coverage areas, and certifications. Contact providers directly via phone, email, or website. Leave comments and reviews to help others find quality services. Bookmark trusted providers for future reference. Get directions to service provider locations.",
    placement: 'center',
    disableBeacon: true,
  },
  {
    target: 'body',
    content: "Ready to add your service? Click 'Submit Local Resource' in the navigation menu. Fill out the comprehensive form with your service details, coverage area, certifications, and contact info. Upload photos of your work to attract customers. Submit for review and track approval status in 'My Submissions'. Help your community find the services they need!",
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

  return (
    <>
      <Dialog open={showWelcome} onOpenChange={setShowWelcome}>
        <DialogContent className="sm:max-w-md max-w-[95vw] max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-lg sm:text-2xl break-words">Welcome to HubVillage! 🎉</DialogTitle>
            <DialogDescription className="text-xs sm:text-sm break-words">
              Your community hub for events, businesses, news, and local services. Choose a tour to get started or explore all features.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2 sm:gap-3 mt-3 sm:mt-4">
            <Button
              onClick={() => handleTourChoice('general')}
              className="w-full justify-start text-left h-auto py-3 sm:py-4 px-3 sm:px-4 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <div className="w-full min-w-0">
                <div className="font-semibold text-sm sm:text-base break-words">🌟 Show me everything!</div>
                <div className="text-xs sm:text-sm opacity-90 break-words">Complete tour of all features (recommended)</div>
              </div>
            </Button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-[10px] sm:text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground whitespace-nowrap">Or choose a specific topic</span>
              </div>
            </div>
            <Button
              onClick={() => handleTourChoice('event')}
              variant="outline"
              className="w-full justify-start text-left h-auto py-3 sm:py-4 px-3 sm:px-4"
            >
              <div className="w-full min-w-0">
                <div className="font-semibold text-sm sm:text-base break-words">📅 Events Guide</div>
                <div className="text-xs sm:text-sm text-muted-foreground break-words">Learn to post and find community events</div>
              </div>
            </Button>
            <Button
              onClick={() => handleTourChoice('business')}
              variant="outline"
              className="w-full justify-start text-left h-auto py-3 sm:py-4 px-3 sm:px-4"
            >
              <div className="w-full min-w-0">
                <div className="font-semibold text-sm sm:text-base break-words">🏪 Business Directory</div>
                <div className="text-xs sm:text-sm text-muted-foreground break-words">List your business or find local shops</div>
              </div>
            </Button>
            <Button
              onClick={() => handleTourChoice('resource')}
              variant="outline"
              className="w-full justify-start text-left h-auto py-3 sm:py-4 px-3 sm:px-4"
            >
              <div className="w-full min-w-0">
                <div className="font-semibold text-sm sm:text-base break-words">🔧 Local Services</div>
                <div className="text-xs sm:text-sm text-muted-foreground break-words">Find or offer professional services</div>
              </div>
            </Button>
            <Button
              onClick={() => handleTourChoice(null)}
              variant="ghost"
              className="w-full mt-1 sm:mt-2 text-xs sm:text-sm h-auto py-2 sm:py-3"
            >
              Skip tour - I'll explore on my own
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
              width: '100%',
            },
            tooltip: {
              maxWidth: '90vw',
              padding: '12px 16px',
            },
            tooltipContainer: {
              textAlign: 'left',
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
              hyphens: 'auto',
            },
            tooltipContent: {
              fontSize: '14px',
              lineHeight: '1.5',
              padding: '8px 0',
            },
            buttonNext: {
              fontSize: '14px',
              padding: '8px 16px',
            },
            buttonBack: {
              fontSize: '14px',
              padding: '8px 16px',
            },
            buttonSkip: {
              fontSize: '14px',
              padding: '8px 16px',
            },
            spotlight: {
              borderRadius: '8px',
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

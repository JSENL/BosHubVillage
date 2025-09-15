import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Navigation } from '@/components/Navigation';
import { Calendar, Building, Wrench, Newspaper, Map, Users, Star, MessageCircle, Search, Globe, Shield, Bookmark } from 'lucide-react';

export const FAQ = () => {
  const { t } = useTranslation();
  const featureCategories = [
    {
      title: t('faq.gettingStarted'),
      icon: <Users className="h-5 w-5" />,
      description: t('faq.gettingStartedDesc'),
      items: [
        {
          question: "What is this platform?",
          answer: "This is a comprehensive community platform that connects locals with events, businesses, services, and news in their area. You can discover what's happening around you, find local services, read community news, and connect with local businesses."
        },
        {
          question: "Do I need to create an account?",
          answer: "You can browse events, businesses, services, and news without an account. However, creating an account allows you to submit content, save bookmarks, leave comments and ratings, message businesses, and personalize your experience."
        },
        {
          question: "How do I navigate the site?",
          answer: "Use the main navigation to switch between Events, Businesses, Local Services, and News. You can view content in either list format or on an interactive map. Use the search bar and filters to find exactly what you're looking for."
        }
      ]
    },
    {
      title: t('faq.events'),
      icon: <Calendar className="h-5 w-5" />,
      description: t('faq.eventsDesc'),
      items: [
        {
          question: "How do I find events?",
          answer: "Browse events on the Events page using list or map view. Filter by date, category, type (free/paid), or location. Use the calendar view to see events by date, or search for specific events using keywords."
        },
        {
          question: "Can I submit my own events?",
          answer: "Yes! Click 'Submit Event' to add your event. Provide details like title, description, date/time, location, category, and pricing. Events go through an approval process before being published."
        },
        {
          question: "What types of events can I submit?",
          answer: "Any community-relevant events including workshops, concerts, meetups, festivals, classes, sports events, cultural activities, and more. Both free and paid events are welcome."
        },
        {
          question: "How do I register for events?",
          answer: "Click on any event to view details. If registration is available, you'll see registration options with the event organizer's contact information or registration links."
        }
      ]
    },
    {
      title: t('faq.businesses'),
      icon: <Building className="h-5 w-5" />,
      description: t('faq.businessesDesc'),
      items: [
        {
          question: "How do I find local businesses?",
          answer: "Browse the Businesses section using list or map view. Filter by category, search by name or keywords, or explore businesses near specific locations. Each business listing includes contact info, hours, and location details."
        },
        {
          question: "Can I add my business?",
          answer: "Absolutely! Use 'Submit Business' to add your business listing. Include your business name, description, category, contact information, hours, and location. Business listings are reviewed before publication."
        },
        {
          question: "How do I contact businesses?",
          answer: "Each business listing includes contact information. Registered users can also send direct messages to businesses through the platform's messaging system."
        },
        {
          question: "Can customers leave reviews?",
          answer: "Yes! Registered users can leave comments and star ratings on business listings to help others make informed decisions."
        }
      ]
    },
    {
      title: t('faq.localServices'),
      icon: <Wrench className="h-5 w-5" />,
      description: t('faq.localServicesDesc'),
      items: [
        {
          question: "What are local services?",
          answer: "Local services include professionals and service providers like plumbers, electricians, tutors, cleaners, repair services, consultants, and other skilled services available in your area."
        },
        {
          question: "How do I find service providers?",
          answer: "Browse the Local Services section, filter by service category, search by keywords, or use the map to find services near you. Each listing includes provider details and contact information."
        },
        {
          question: "Can I list my services?",
          answer: "Yes! Service providers can submit their services using 'Submit Local Service'. Include your service description, categories, contact info, coverage area, and any relevant certifications or specializations."
        }
      ]
    },
    {
      title: t('faq.newsUpdates'),
      icon: <Newspaper className="h-5 w-5" />,
      description: t('faq.newsUpdatesDesc'),
      items: [
        {
          question: "What kind of news is featured?",
          answer: "We feature local community news, announcements, updates about local businesses and events, community initiatives, and other relevant local information that affects residents."
        },
        {
          question: "Can I submit news articles?",
          answer: "Yes! Community members can submit news articles using 'Submit News'. Include a compelling headline, detailed content, relevant images, and proper categorization. All submissions are reviewed before publication."
        },
        {
          question: "How do I stay updated with news?",
          answer: "Visit the News page regularly, bookmark interesting articles, or follow specific categories. You can also engage with articles by leaving comments and sharing them with others."
        }
      ]
    },
    {
      title: t('faq.mapFeatures'),
      icon: <Map className="h-5 w-5" />,
      description: t('faq.mapFeaturesDesc'),
      items: [
        {
          question: "How does the map work?",
          answer: "The interactive map shows all events, businesses, and services with color-coded markers (E for Events, B for Businesses, L for Local Services, N for News). Click markers to see details, or use clustering to explore dense areas."
        },
        {
          question: "Can I get directions?",
          answer: "Yes! Click on any map marker and select 'Get Directions' to see turn-by-turn directions. You can also open directions in external map apps like Google Maps or Apple Maps."
        },
        {
          question: "What do the map markers mean?",
          answer: "Blue markers with 'E' are Events, Green markers with 'B' are Businesses, Orange markers with 'L' are Local Services, and Red markers with 'N' are News locations. Clustered areas show numbers indicating how many items are in that area."
        }
      ]
    },
    {
      title: t('faq.searchFilters'),
      icon: <Search className="h-5 w-5" />,
      description: t('faq.searchFiltersDesc'),
      items: [
        {
          question: "How do I search for specific content?",
          answer: "Use the search bar at the top of each section to search by keywords, names, or descriptions. You can search across all content types or filter by specific categories and criteria."
        },
        {
          question: "What filters are available?",
          answer: "Filters vary by section but include categories, dates (for events), location/neighborhood, type (free/paid for events), and more. Use the 'Clear All' button to reset filters."
        },
        {
          question: "Can I save my search preferences?",
          answer: "Currently, search preferences reset when you navigate away, but you can bookmark specific listings that interest you for easy access later."
        }
      ]
    },
    {
      title: t('faq.userFeatures'),
      icon: <Users className="h-5 w-5" />,
      description: t('faq.userFeaturesDesc'),
      items: [
        {
          question: "How do I create an account?",
          answer: "Click 'Sign Up' in the navigation to create an account using your email. You can also sign in if you already have an account. Account creation is quick and gives you access to all interactive features."
        },
        {
          question: "What can I do with an account?",
          answer: "With an account, you can submit events/businesses/services/news, leave comments and ratings, bookmark items, send messages to businesses, manage your submissions, and customize your profile."
        },
        {
          question: "How do I manage my submissions?",
          answer: "Visit 'My Submissions' in your account menu to see all content you've submitted, track approval status, and make updates to approved content."
        },
        {
          question: "Can I bookmark items?",
          answer: "Yes! Registered users can bookmark events, businesses, services, and news articles. Access your bookmarks through your profile to easily return to interesting content."
        }
      ]
    },
    {
      title: t('faq.commentsRatings'),
      icon: <Star className="h-5 w-5" />,
      description: t('faq.commentsRatingsDesc'),
      items: [
        {
          question: "How do I leave comments?",
          answer: "On any event, business, service, or news article detail page, scroll down to the comments section. Registered users can leave comments and respond to others' comments."
        },
        {
          question: "Can I rate businesses and services?",
          answer: "Yes! Leave star ratings (1-5 stars) along with your comments on business and service listings. Ratings help other community members make informed decisions."
        },
        {
          question: "Are comments moderated?",
          answer: "Comments are monitored for inappropriate content. Keep comments respectful, relevant, and helpful to the community. Inappropriate comments may be removed."
        }
      ]
    },
    {
      title: t('faq.messaging'),
      icon: <MessageCircle className="h-5 w-5" />,
      description: t('faq.messagingDesc'),
      items: [
        {
          question: "How do I message businesses?",
          answer: "On business detail pages, registered users can send direct messages to business owners. Use this feature for inquiries, questions, or to discuss services."
        },
        {
          question: "Where do I see my messages?",
          answer: "Access 'My Messages' from your account menu to view all your conversations with businesses and manage your message history."
        },
        {
          question: "Can businesses message me back?",
          answer: "Yes! The messaging system works both ways. Businesses can respond to your messages, and you'll be notified of new messages in your account."
        }
      ]
    },
    {
      title: t('faq.languagesAccessibility'),
      icon: <Globe className="h-5 w-5" />,
      description: t('faq.languagesAccessibilityDesc'),
      items: [
        {
          question: "Is the site available in multiple languages?",
          answer: "Yes! The platform supports multiple languages including English, Spanish, French, Italian, Portuguese, Arabic, Vietnamese, and Chinese. Use the language selector in the navigation to switch languages."
        },
        {
          question: "Are submissions translated?",
          answer: "Content submitted by users may be automatically translated to help make information accessible to more community members, depending on the language settings."
        },
        {
          question: "Is the site accessible?",
          answer: "We strive to make the platform accessible to all users. The site includes keyboard navigation support, screen reader compatibility, and follows accessibility best practices."
        }
      ]
    },
    {
      title: t('faq.submissionProcess'),
      icon: <Shield className="h-5 w-5" />,
      description: t('faq.submissionProcessDesc'),
      items: [
        {
          question: "Why do submissions need approval?",
          answer: "All submissions go through a review process to ensure content quality, accuracy, and community appropriateness. This helps maintain a high-quality, trustworthy platform for all users."
        },
        {
          question: "How long does approval take?",
          answer: "Most submissions are reviewed within 24-48 hours. You can check the status of your submissions in 'My Submissions' and will be notified when they're approved or if changes are needed."
        },
        {
          question: "What if my submission is rejected?",
          answer: "If a submission needs changes, you'll receive feedback on what needs to be updated. You can then edit and resubmit your content for another review."
        },
        {
          question: "Can I edit my published content?",
          answer: "Yes! Once your content is approved and published, you can request edits through your 'My Submissions' page. Significant changes may require re-approval."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">{t('faq.title')}</h1>
        <p className="text-muted-foreground text-lg">
          {t('faq.subtitle')}
        </p>
      </div>

      <div className="grid gap-6">
        {featureCategories.map((category, categoryIndex) => (
          <Card key={categoryIndex} className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {category.icon}
                {category.title}
              </CardTitle>
              <CardDescription>
                {category.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {category.items.map((item, itemIndex) => (
                  <AccordionItem key={itemIndex} value={`${categoryIndex}-${itemIndex}`}>
                    <AccordionTrigger className="text-left">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            {t('faq.stillHaveQuestions')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            {t('faq.contactMessage')}
          </p>
          <div className="flex gap-2 flex-wrap">
            <Badge variant="secondary">Community Support</Badge>
            <Badge variant="secondary">Help Documentation</Badge>
            <Badge variant="secondary">Contact Form</Badge>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
};
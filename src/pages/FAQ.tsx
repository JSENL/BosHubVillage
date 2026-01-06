import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Navigation } from '@/components/Navigation';
import { Calendar, Building, Wrench, Newspaper, Map, Users, Star, MessageCircle, Search, Globe, Shield, Bookmark, MapPin, Bell, Mail, Heart, UserPlus } from 'lucide-react';

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
          answer: "You can browse events, businesses, services, and news without an account. However, creating an account allows you to submit content, save bookmarks, leave comments and ratings, message businesses, follow other users, save searches, and personalize your experience."
        },
        {
          question: "How do I navigate the site?",
          answer: "Use the main navigation to switch between Events, Businesses, Local Services, and News. You can view content in grid, list, map, or calendar formats. Use the search bar and filters to find exactly what you're looking for. The interface features resizable panels to customize your viewing experience."
        },
        {
          question: "Is there a tutorial for new users?",
          answer: "Yes! First-time users are greeted with an interactive onboarding tour. Choose whether you're posting an event, business, or local resource, and we'll guide you through the relevant features step-by-step. You can restart the tour anytime by clearing your browser's local storage."
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
          answer: "Browse events using grid, list, map, or calendar views. Filter by date, category, type (free/paid), neighborhood, or village. Use the calendar view to see events by specific dates, or the map to find events near you. The search bar lets you find events by keywords."
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
        },
        {
          question: "Can I create recurring events?",
          answer: "Yes! When submitting an event, you can mark it as recurring and specify the pattern (daily, weekly, monthly). This is perfect for regular classes, meetups, or ongoing community activities."
        },
        {
          question: "How do I share events with others?",
          answer: "Each event has social sharing options. You can share events via social media, copy the direct link, or add events to your personal calendar using the calendar share feature."
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
        },
        {
          question: "How do I claim my business?",
          answer: "If your business is already listed, you can claim ownership by contacting the admin. Once verified as the owner, you'll have access to respond to messages, update listings, and manage your business profile."
        },
        {
          question: "Can I feature or sponsor my business?",
          answer: "Sponsored businesses receive enhanced visibility in search results and on the map. Contact the platform administrators to learn about sponsorship opportunities."
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
        },
        {
          question: "How are local services different from businesses?",
          answer: "Local services typically refer to individual professionals or smaller service providers (like freelancers, contractors, or consultants), while businesses are established commercial entities with a physical location."
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
          answer: "Visit the News page regularly, bookmark interesting articles, enable weekly digest emails, or follow specific categories. You can also engage with articles by leaving comments and sharing them with others."
        },
        {
          question: "Can I attach media to news submissions?",
          answer: "Yes! When submitting news, you can upload images and other media files to accompany your article. This helps make your content more engaging and informative."
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
          answer: "The interactive map shows all events, businesses, and services with color-coded markers (E for Events in red, B for Businesses in blue, L for Local Services in orange, N for News in purple). Click markers to see details, use clustering to explore dense areas, and resize the map panel for better viewing."
        },
        {
          question: "Can I get directions?",
          answer: "Yes! Click on any map marker and select 'Get Directions' to see turn-by-turn directions with distance and time estimates. You can also open directions in external map apps like Google Maps or Apple Maps for navigation."
        },
        {
          question: "What do the map markers mean?",
          answer: "Red markers with 'E' are Events, Blue markers with 'B' are Businesses, Orange markers with 'L' are Local Services, and Purple markers with 'N' are News locations. Clustered areas show numbers indicating how many items are in that area. Click clusters to zoom in."
        },
        {
          question: "Can I search locations on the map?",
          answer: "Yes! The map includes a search box that lets you find specific addresses or locations. You can also drag the search box to reposition it on the map for better visibility. The map legend helps you identify different marker types."
        }
      ]
    },
    {
      title: "Near Me & Location Features",
      icon: <MapPin className="h-5 w-5" />,
      description: "Find content near your current location",
      items: [
        {
          question: "What is the 'Near Me' feature?",
          answer: "The 'Near Me' feature uses your device's location to show events, businesses, and services within a specified distance from you. This helps you discover what's happening close by."
        },
        {
          question: "How do I use Near Me?",
          answer: "Click the 'Near Me' button in the filter bar. Your browser will ask for permission to access your location. Once granted, you can select a distance radius (1km, 5km, 10km, 25km, or 50km) to filter results."
        },
        {
          question: "Is my location data saved?",
          answer: "No, your location is only used temporarily to filter nearby content. It's not stored on our servers. You can clear your location anytime by clicking the X button next to the distance selector."
        },
        {
          question: "Why can't I see the Near Me button?",
          answer: "The Near Me feature requires a modern browser with geolocation support. If you don't see it, make sure your browser supports geolocation and that you haven't blocked location access for the site."
        },
        {
          question: "The location seems inaccurate, what should I do?",
          answer: "Location accuracy depends on your device and connection. GPS provides the most accurate results, while Wi-Fi-based location may be less precise. Try enabling high-accuracy mode in your device settings."
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
          answer: "Filters include type (events, businesses, services), categories, dates (for events), location/neighborhood/village, distance (Near Me), and more. Use the 'Clear All' button to reset filters. Filters work seamlessly across all view modes."
        },
        {
          question: "Can I save my search preferences?",
          answer: "Yes! Registered users can save their current search criteria using the 'Save Search' button. Give your search a name and optionally enable email or in-app notifications for new matches. Access saved searches from the Discovery sidebar."
        },
        {
          question: "How do I use the calendar view?",
          answer: "Switch to calendar view using the view toggle to see events organized by date. Click on any date to see all events scheduled for that day. This is perfect for planning your week or finding events on specific dates."
        },
        {
          question: "How do saved searches work with notifications?",
          answer: "When saving a search, you can enable notifications to be alerted when new content matches your criteria. Choose email notifications, in-app notifications, or both. Manage your saved searches and notification preferences from the Discovery sidebar."
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
          answer: "Click 'Sign In' in the navigation and select 'Sign Up' to create an account using your email. You can also sign in if you already have an account. Account creation is quick and gives you access to all interactive features."
        },
        {
          question: "What can I do with an account?",
          answer: "With an account, you can submit content, leave comments and ratings, bookmark items, send messages to businesses, follow other users, save searches, receive notifications, customize your profile, and set email digest preferences."
        },
        {
          question: "How do I manage my submissions?",
          answer: "Visit 'My Submissions' in your account menu to see all content you've submitted, track approval status, and make updates to approved content."
        },
        {
          question: "Can I bookmark items?",
          answer: "Yes! Registered users can bookmark events, businesses, services, and news articles. Click the bookmark icon on any item to save it. Access your bookmarks through the Discovery sidebar to easily return to interesting content."
        },
        {
          question: "What is the Discovery sidebar?",
          answer: "The Discovery sidebar shows trending content, your saved searches, bookmarked items, and suggested connections. You can resize or collapse this panel. It helps you discover new content and manage your personalized experience."
        },
        {
          question: "How do I edit my profile?",
          answer: "Go to 'Edit Profile' from your account menu. You can update your display name, bio, profile picture, location, website, and interests. Your profile is visible to other users when they view your comments or follow you."
        }
      ]
    },
    {
      title: "Social & Following",
      icon: <UserPlus className="h-5 w-5" />,
      description: "Connect with other community members",
      items: [
        {
          question: "Can I follow other users?",
          answer: "Yes! You can follow other community members to see their activity in your feed. Visit a user's profile and click 'Follow' to start following them."
        },
        {
          question: "How do I see who I'm following?",
          answer: "Your following count is displayed on your profile. You can view the activity of people you follow in the Discovery sidebar's activity feed."
        },
        {
          question: "What happens when I follow someone?",
          answer: "When you follow someone, you'll see their public activity (comments, bookmarks, submissions) in your Following Activity feed. They'll be notified that you followed them."
        },
        {
          question: "How do I discover new people to follow?",
          answer: "The 'Discover People' section in the Discovery sidebar suggests users based on shared interests, active contributors, and trending profiles in your community."
        },
        {
          question: "Can I see who follows me?",
          answer: "Your follower count is displayed on your profile. You can see notifications when new people follow you through the notification bell in the navigation."
        }
      ]
    },
    {
      title: "Notifications & Alerts",
      icon: <Bell className="h-5 w-5" />,
      description: "Stay informed about activity and updates",
      items: [
        {
          question: "What types of notifications will I receive?",
          answer: "You'll receive notifications for new followers, replies to your comments, updates on your submissions, messages from businesses, saved search matches, and important announcements."
        },
        {
          question: "Where do I see my notifications?",
          answer: "Click the bell icon in the navigation bar to see your in-app notifications. Unread notifications are indicated by a badge. You can mark notifications as read or clear them."
        },
        {
          question: "Can I get email notifications?",
          answer: "Yes! You can enable email notifications for saved searches and opt-in to weekly digest emails. Manage your email preferences from the Email Digest Settings in your profile."
        },
        {
          question: "How do I turn off notifications?",
          answer: "You can manage notification preferences in your profile settings. For saved searches, edit each search to toggle email and in-app notifications. For weekly digests, go to Email Digest Settings."
        }
      ]
    },
    {
      title: "Weekly Email Digest",
      icon: <Mail className="h-5 w-5" />,
      description: "Get a summary of community activity delivered to your inbox",
      items: [
        {
          question: "What is the weekly digest?",
          answer: "The weekly digest is an email summary of trending content, new events, popular businesses, and community highlights. It's a great way to stay informed without visiting the site daily."
        },
        {
          question: "How do I enable the weekly digest?",
          answer: "Go to 'Edit Profile' and find the 'Email Digest Settings' section. Toggle on 'Enable Weekly Digest' and select your preferred day of the week to receive it."
        },
        {
          question: "What day can I receive the digest?",
          answer: "You can choose any day of the week (Monday through Sunday) to receive your digest. Select your preferred day from the dropdown in Email Digest Settings."
        },
        {
          question: "How do I unsubscribe from the digest?",
          answer: "Go to Email Digest Settings in your profile and toggle off 'Enable Weekly Digest'. You can also click the unsubscribe link in any digest email."
        },
        {
          question: "What's included in the weekly digest?",
          answer: "The digest includes trending content from the week, upcoming events, new businesses, popular news articles, and personalized recommendations based on your interests and activity."
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
        },
        {
          question: "Can I reply to other comments?",
          answer: "Yes! You can reply to any comment to create threaded discussions. This is great for asking follow-up questions or providing additional information."
        },
        {
          question: "Can I attach media to comments?",
          answer: "Yes! When leaving a comment, you can attach images to share photos of your experience. This is especially useful for reviews of businesses and events."
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
        },
        {
          question: "Can I attach files to messages?",
          answer: "Yes! You can attach images and documents to your messages when communicating with businesses. This is useful for sharing photos, quotes, or relevant documents."
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
        },
        {
          question: "How do I change the language?",
          answer: "Click the language selector in the navigation bar (shown as a flag or language code) and choose your preferred language. Your selection is saved for future visits."
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
        },
        {
          question: "What are the submission guidelines?",
          answer: "Ensure your content is accurate, relevant to the community, and includes complete information. Avoid duplicate submissions, use appropriate categories, and include clear contact details where applicable."
        }
      ]
    },
    {
      title: "Trending & Discovery",
      icon: <Heart className="h-5 w-5" />,
      description: "Discover popular and recommended content",
      items: [
        {
          question: "How is trending content determined?",
          answer: "Trending content is calculated based on views, bookmarks, comments, and recent activity. Content that receives high engagement in a short period appears in the trending section."
        },
        {
          question: "Where can I see trending content?",
          answer: "The Discovery sidebar shows trending events, businesses, news, and other popular content. You can also see trending indicators on individual items throughout the site."
        },
        {
          question: "What is the Recently Viewed section?",
          answer: "The Recently Viewed section in the Discovery sidebar shows items you've recently looked at, making it easy to return to content you were interested in."
        },
        {
          question: "How are recommendations personalized?",
          answer: "Recommendations are based on your interests (set in your profile), your viewing history, bookmarks, and activity patterns. The more you use the platform, the better the recommendations become."
        }
      ]
    },
    {
      title: "Account & Privacy",
      icon: <Shield className="h-5 w-5" />,
      description: "Managing your account and privacy settings",
      items: [
        {
          question: "How do I reset my password?",
          answer: "Click 'Sign In', then 'Forgot Password'. Enter your email address and you'll receive a password reset link. Follow the instructions in the email to create a new password."
        },
        {
          question: "Can I delete my account?",
          answer: "Yes, you can request account deletion by contacting the platform administrators. Note that this will remove all your submissions, comments, and activity history."
        },
        {
          question: "Who can see my profile?",
          answer: "Your profile is visible to other registered users. They can see your display name, bio, interests, and public activity like comments. Your email address is kept private."
        },
        {
          question: "How is my data protected?",
          answer: "We use industry-standard security practices to protect your data. Your personal information is encrypted and stored securely. We never share your information with third parties without your consent."
        },
        {
          question: "Can I contact the administrators?",
          answer: "Yes! Use the 'Contact Admin' option in your account menu to send messages to the platform administrators. This is useful for reporting issues, requesting features, or getting help with your account."
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

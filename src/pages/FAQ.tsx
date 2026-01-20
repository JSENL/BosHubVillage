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
          question: t('faq.questions.gettingStarted.q1'),
          answer: t('faq.answers.gettingStarted.a1')
        },
        {
          question: t('faq.questions.gettingStarted.q2'),
          answer: t('faq.answers.gettingStarted.a2')
        },
        {
          question: t('faq.questions.gettingStarted.q3'),
          answer: t('faq.answers.gettingStarted.a3')
        },
        {
          question: t('faq.questions.gettingStarted.q4'),
          answer: t('faq.answers.gettingStarted.a4')
        }
      ]
    },
    {
      title: t('faq.events'),
      icon: <Calendar className="h-5 w-5" />,
      description: t('faq.eventsDesc'),
      items: [
        {
          question: t('faq.questions.events.q1'),
          answer: t('faq.answers.events.a1')
        },
        {
          question: t('faq.questions.events.q2'),
          answer: t('faq.answers.events.a2')
        },
        {
          question: t('faq.questions.events.q3'),
          answer: t('faq.answers.events.a3')
        },
        {
          question: t('faq.questions.events.q4'),
          answer: t('faq.answers.events.a4')
        },
        {
          question: t('faq.questions.events.q5'),
          answer: t('faq.answers.events.a5')
        },
        {
          question: t('faq.questions.events.q6'),
          answer: t('faq.answers.events.a6')
        }
      ]
    },
    {
      title: t('faq.businesses'),
      icon: <Building className="h-5 w-5" />,
      description: t('faq.businessesDesc'),
      items: [
        {
          question: t('faq.questions.businesses.q1'),
          answer: t('faq.answers.businesses.a1')
        },
        {
          question: t('faq.questions.businesses.q2'),
          answer: t('faq.answers.businesses.a2')
        },
        {
          question: t('faq.questions.businesses.q3'),
          answer: t('faq.answers.businesses.a3')
        },
        {
          question: t('faq.questions.businesses.q4'),
          answer: t('faq.answers.businesses.a4')
        },
        {
          question: t('faq.questions.businesses.q5'),
          answer: t('faq.answers.businesses.a5')
        },
        {
          question: t('faq.questions.businesses.q6'),
          answer: t('faq.answers.businesses.a6')
        }
      ]
    },
    {
      title: t('faq.localServices'),
      icon: <Wrench className="h-5 w-5" />,
      description: t('faq.localServicesDesc'),
      items: [
        {
          question: t('faq.questions.localServices.q1'),
          answer: t('faq.answers.localServices.a1')
        },
        {
          question: t('faq.questions.localServices.q2'),
          answer: t('faq.answers.localServices.a2')
        },
        {
          question: t('faq.questions.localServices.q3'),
          answer: t('faq.answers.localServices.a3')
        },
        {
          question: t('faq.questions.localServices.q4'),
          answer: t('faq.answers.localServices.a4')
        }
      ]
    },
    {
      title: t('faq.newsUpdates'),
      icon: <Newspaper className="h-5 w-5" />,
      description: t('faq.newsUpdatesDesc'),
      items: [
        {
          question: t('faq.questions.news.q1'),
          answer: t('faq.answers.news.a1')
        },
        {
          question: t('faq.questions.news.q2'),
          answer: t('faq.answers.news.a2')
        },
        {
          question: t('faq.questions.news.q3'),
          answer: t('faq.answers.news.a3')
        },
        {
          question: t('faq.questions.news.q4'),
          answer: t('faq.answers.news.a4')
        }
      ]
    },
    {
      title: t('faq.mapFeatures'),
      icon: <Map className="h-5 w-5" />,
      description: t('faq.mapFeaturesDesc'),
      items: [
        {
          question: t('faq.questions.map.q1'),
          answer: t('faq.answers.map.a1')
        },
        {
          question: t('faq.questions.map.q2'),
          answer: t('faq.answers.map.a2')
        },
        {
          question: t('faq.questions.map.q3'),
          answer: t('faq.answers.map.a3')
        },
        {
          question: t('faq.questions.map.q4'),
          answer: t('faq.answers.map.a4')
        }
      ]
    },
    {
      title: t('faq.nearMe'),
      icon: <MapPin className="h-5 w-5" />,
      description: t('faq.nearMeDesc'),
      items: [
        {
          question: t('faq.questions.nearMe.q1'),
          answer: t('faq.answers.nearMe.a1')
        },
        {
          question: t('faq.questions.nearMe.q2'),
          answer: t('faq.answers.nearMe.a2')
        },
        {
          question: t('faq.questions.nearMe.q3'),
          answer: t('faq.answers.nearMe.a3')
        },
        {
          question: t('faq.questions.nearMe.q4'),
          answer: t('faq.answers.nearMe.a4')
        },
        {
          question: t('faq.questions.nearMe.q5'),
          answer: t('faq.answers.nearMe.a5')
        }
      ]
    },
    {
      title: t('faq.searchFilters'),
      icon: <Search className="h-5 w-5" />,
      description: t('faq.searchFiltersDesc'),
      items: [
        {
          question: t('faq.questions.search.q1'),
          answer: t('faq.answers.search.a1')
        },
        {
          question: t('faq.questions.search.q2'),
          answer: t('faq.answers.search.a2')
        },
        {
          question: t('faq.questions.search.q3'),
          answer: t('faq.answers.search.a3')
        },
        {
          question: t('faq.questions.search.q4'),
          answer: t('faq.answers.search.a4')
        },
        {
          question: t('faq.questions.search.q5'),
          answer: t('faq.answers.search.a5')
        }
      ]
    },
    {
      title: t('faq.userFeatures'),
      icon: <Users className="h-5 w-5" />,
      description: t('faq.userFeaturesDesc'),
      items: [
        {
          question: t('faq.questions.user.q1'),
          answer: t('faq.answers.user.a1')
        },
        {
          question: t('faq.questions.user.q2'),
          answer: t('faq.answers.user.a2')
        },
        {
          question: t('faq.questions.user.q3'),
          answer: t('faq.answers.user.a3')
        },
        {
          question: t('faq.questions.user.q4'),
          answer: t('faq.answers.user.a4')
        },
        {
          question: t('faq.questions.user.q5'),
          answer: t('faq.answers.user.a5')
        },
        {
          question: t('faq.questions.user.q6'),
          answer: t('faq.answers.user.a6')
        }
      ]
    },
    {
      title: t('faq.socialFollowing'),
      icon: <UserPlus className="h-5 w-5" />,
      description: t('faq.socialFollowingDesc'),
      items: [
        {
          question: t('faq.questions.social.q1'),
          answer: t('faq.answers.social.a1')
        },
        {
          question: t('faq.questions.social.q2'),
          answer: t('faq.answers.social.a2')
        },
        {
          question: t('faq.questions.social.q3'),
          answer: t('faq.answers.social.a3')
        },
        {
          question: t('faq.questions.social.q4'),
          answer: t('faq.answers.social.a4')
        },
        {
          question: t('faq.questions.social.q5'),
          answer: t('faq.answers.social.a5')
        }
      ]
    },
    {
      title: t('faq.notifications'),
      icon: <Bell className="h-5 w-5" />,
      description: t('faq.notificationsDesc'),
      items: [
        {
          question: t('faq.questions.notifications.q1'),
          answer: t('faq.answers.notifications.a1')
        },
        {
          question: t('faq.questions.notifications.q2'),
          answer: t('faq.answers.notifications.a2')
        },
        {
          question: t('faq.questions.notifications.q3'),
          answer: t('faq.answers.notifications.a3')
        },
        {
          question: t('faq.questions.notifications.q4'),
          answer: t('faq.answers.notifications.a4')
        }
      ]
    },
    {
      title: t('faq.weeklyDigest'),
      icon: <Mail className="h-5 w-5" />,
      description: t('faq.weeklyDigestDesc'),
      items: [
        {
          question: t('faq.questions.digest.q1'),
          answer: t('faq.answers.digest.a1')
        },
        {
          question: t('faq.questions.digest.q2'),
          answer: t('faq.answers.digest.a2')
        },
        {
          question: t('faq.questions.digest.q3'),
          answer: t('faq.answers.digest.a3')
        },
        {
          question: t('faq.questions.digest.q4'),
          answer: t('faq.answers.digest.a4')
        },
        {
          question: t('faq.questions.digest.q5'),
          answer: t('faq.answers.digest.a5')
        }
      ]
    },
    {
      title: t('faq.commentsRatings'),
      icon: <Star className="h-5 w-5" />,
      description: t('faq.commentsRatingsDesc'),
      items: [
        {
          question: t('faq.questions.comments.q1'),
          answer: t('faq.answers.comments.a1')
        },
        {
          question: t('faq.questions.comments.q2'),
          answer: t('faq.answers.comments.a2')
        },
        {
          question: t('faq.questions.comments.q3'),
          answer: t('faq.answers.comments.a3')
        },
        {
          question: t('faq.questions.comments.q4'),
          answer: t('faq.answers.comments.a4')
        },
        {
          question: t('faq.questions.comments.q5'),
          answer: t('faq.answers.comments.a5')
        }
      ]
    },
    {
      title: t('faq.messaging'),
      icon: <MessageCircle className="h-5 w-5" />,
      description: t('faq.messagingDesc'),
      items: [
        {
          question: t('faq.questions.messaging.q1'),
          answer: t('faq.answers.messaging.a1')
        },
        {
          question: t('faq.questions.messaging.q2'),
          answer: t('faq.answers.messaging.a2')
        },
        {
          question: t('faq.questions.messaging.q3'),
          answer: t('faq.answers.messaging.a3')
        },
        {
          question: t('faq.questions.messaging.q4'),
          answer: t('faq.answers.messaging.a4')
        }
      ]
    },
    {
      title: t('faq.languagesAccessibility'),
      icon: <Globe className="h-5 w-5" />,
      description: t('faq.languagesAccessibilityDesc'),
      items: [
        {
          question: t('faq.questions.languages.q1'),
          answer: t('faq.answers.languages.a1')
        },
        {
          question: t('faq.questions.languages.q2'),
          answer: t('faq.answers.languages.a2')
        },
        {
          question: t('faq.questions.languages.q3'),
          answer: t('faq.answers.languages.a3')
        },
        {
          question: t('faq.questions.languages.q4'),
          answer: t('faq.answers.languages.a4')
        }
      ]
    },
    {
      title: t('faq.submissionProcess'),
      icon: <Shield className="h-5 w-5" />,
      description: t('faq.submissionProcessDesc'),
      items: [
        {
          question: t('faq.questions.submission.q1'),
          answer: t('faq.answers.submission.a1')
        },
        {
          question: t('faq.questions.submission.q2'),
          answer: t('faq.answers.submission.a2')
        },
        {
          question: t('faq.questions.submission.q3'),
          answer: t('faq.answers.submission.a3')
        },
        {
          question: t('faq.questions.submission.q4'),
          answer: t('faq.answers.submission.a4')
        },
        {
          question: t('faq.questions.submission.q5'),
          answer: t('faq.answers.submission.a5')
        }
      ]
    },
    {
      title: t('faq.trendingDiscovery'),
      icon: <Heart className="h-5 w-5" />,
      description: t('faq.trendingDiscoveryDesc'),
      items: [
        {
          question: t('faq.questions.trending.q1'),
          answer: t('faq.answers.trending.a1')
        },
        {
          question: t('faq.questions.trending.q2'),
          answer: t('faq.answers.trending.a2')
        },
        {
          question: t('faq.questions.trending.q3'),
          answer: t('faq.answers.trending.a3')
        },
        {
          question: t('faq.questions.trending.q4'),
          answer: t('faq.answers.trending.a4')
        }
      ]
    },
    {
      title: t('faq.accountPrivacy'),
      icon: <Shield className="h-5 w-5" />,
      description: t('faq.accountPrivacyDesc'),
      items: [
        {
          question: t('faq.questions.account.q1'),
          answer: t('faq.answers.account.a1')
        },
        {
          question: t('faq.questions.account.q2'),
          answer: t('faq.answers.account.a2')
        },
        {
          question: t('faq.questions.account.q3'),
          answer: t('faq.answers.account.a3')
        },
        {
          question: t('faq.questions.account.q4'),
          answer: t('faq.answers.account.a4')
        },
        {
          question: t('faq.questions.account.q5'),
          answer: t('faq.answers.account.a5')
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
            <Badge variant="secondary">{t('faq.badges.communitySupport')}</Badge>
            <Badge variant="secondary">{t('faq.badges.helpDocs')}</Badge>
            <Badge variant="secondary">{t('faq.badges.contactForm')}</Badge>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
};

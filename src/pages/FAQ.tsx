import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Navigation } from '@/components/Navigation';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Calendar, 
  Building, 
  Wrench, 
  Newspaper, 
  Map, 
  Users, 
  Star, 
  MessageCircle, 
  Search, 
  Globe, 
  Shield, 
  MapPin, 
  Bell, 
  Mail, 
  Heart, 
  UserPlus,
  X,
  ChevronRight
} from 'lucide-react';

export const FAQ = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  const featureCategories = [
    {
      id: 'getting-started',
      title: t('faq.gettingStarted'),
      icon: <Users className="h-5 w-5" />,
      description: t('faq.gettingStartedDesc'),
      color: 'bg-blue-100 text-blue-700',
      items: [
        { question: t('faq.questions.gettingStarted.q1'), answer: t('faq.answers.gettingStarted.a1') },
        { question: t('faq.questions.gettingStarted.q2'), answer: t('faq.answers.gettingStarted.a2') },
        { question: t('faq.questions.gettingStarted.q3'), answer: t('faq.answers.gettingStarted.a3') },
        { question: t('faq.questions.gettingStarted.q4'), answer: t('faq.answers.gettingStarted.a4') }
      ]
    },
    {
      id: 'events',
      title: t('faq.events'),
      icon: <Calendar className="h-5 w-5" />,
      description: t('faq.eventsDesc'),
      color: 'bg-red-100 text-red-700',
      items: [
        { question: t('faq.questions.events.q1'), answer: t('faq.answers.events.a1') },
        { question: t('faq.questions.events.q2'), answer: t('faq.answers.events.a2') },
        { question: t('faq.questions.events.q3'), answer: t('faq.answers.events.a3') },
        { question: t('faq.questions.events.q4'), answer: t('faq.answers.events.a4') },
        { question: t('faq.questions.events.q5'), answer: t('faq.answers.events.a5') },
        { question: t('faq.questions.events.q6'), answer: t('faq.answers.events.a6') },
        { question: t('faq.questions.events.q7'), answer: t('faq.answers.events.a7') }
      ]
    },
    {
      id: 'businesses',
      title: t('faq.businesses'),
      icon: <Building className="h-5 w-5" />,
      description: t('faq.businessesDesc'),
      color: 'bg-blue-100 text-blue-700',
      items: [
        { question: t('faq.questions.businesses.q1'), answer: t('faq.answers.businesses.a1') },
        { question: t('faq.questions.businesses.q2'), answer: t('faq.answers.businesses.a2') },
        { question: t('faq.questions.businesses.q3'), answer: t('faq.answers.businesses.a3') },
        { question: t('faq.questions.businesses.q4'), answer: t('faq.answers.businesses.a4') },
        { question: t('faq.questions.businesses.q5'), answer: t('faq.answers.businesses.a5') },
        { question: t('faq.questions.businesses.q6'), answer: t('faq.answers.businesses.a6') }
      ]
    },
    {
      id: 'local-services',
      title: t('faq.localServices'),
      icon: <Wrench className="h-5 w-5" />,
      description: t('faq.localServicesDesc'),
      color: 'bg-orange-100 text-orange-700',
      items: [
        { question: t('faq.questions.localServices.q1'), answer: t('faq.answers.localServices.a1') },
        { question: t('faq.questions.localServices.q2'), answer: t('faq.answers.localServices.a2') },
        { question: t('faq.questions.localServices.q3'), answer: t('faq.answers.localServices.a3') },
        { question: t('faq.questions.localServices.q4'), answer: t('faq.answers.localServices.a4') }
      ]
    },
    {
      id: 'culture',
      title: t('faq.cultureUpdates'),
      icon: <Newspaper className="h-5 w-5" />,
      description: t('faq.cultureUpdatesDesc'),
      color: 'bg-purple-100 text-purple-700',
      items: [
        { question: t('faq.questions.culture.q1'), answer: t('faq.answers.culture.a1') },
        { question: t('faq.questions.culture.q2'), answer: t('faq.answers.culture.a2') },
        { question: t('faq.questions.culture.q3'), answer: t('faq.answers.culture.a3') },
        { question: t('faq.questions.culture.q4'), answer: t('faq.answers.culture.a4') }
      ]
    },
    {
      id: 'map',
      title: t('faq.mapFeatures'),
      icon: <Map className="h-5 w-5" />,
      description: t('faq.mapFeaturesDesc'),
      color: 'bg-green-100 text-green-700',
      items: [
        { question: t('faq.questions.map.q1'), answer: t('faq.answers.map.a1') },
        { question: t('faq.questions.map.q2'), answer: t('faq.answers.map.a2') },
        { question: t('faq.questions.map.q3'), answer: t('faq.answers.map.a3') },
        { question: t('faq.questions.map.q4'), answer: t('faq.answers.map.a4') }
      ]
    },
    {
      id: 'near-me',
      title: t('faq.nearMe'),
      icon: <MapPin className="h-5 w-5" />,
      description: t('faq.nearMeDesc'),
      color: 'bg-teal-100 text-teal-700',
      items: [
        { question: t('faq.questions.nearMe.q1'), answer: t('faq.answers.nearMe.a1') },
        { question: t('faq.questions.nearMe.q2'), answer: t('faq.answers.nearMe.a2') },
        { question: t('faq.questions.nearMe.q3'), answer: t('faq.answers.nearMe.a3') },
        { question: t('faq.questions.nearMe.q4'), answer: t('faq.answers.nearMe.a4') },
        { question: t('faq.questions.nearMe.q5'), answer: t('faq.answers.nearMe.a5') }
      ]
    },
    {
      id: 'search',
      title: t('faq.searchFilters'),
      icon: <Search className="h-5 w-5" />,
      description: t('faq.searchFiltersDesc'),
      color: 'bg-indigo-100 text-indigo-700',
      items: [
        { question: t('faq.questions.search.q1'), answer: t('faq.answers.search.a1') },
        { question: t('faq.questions.search.q2'), answer: t('faq.answers.search.a2') },
        { question: t('faq.questions.search.q3'), answer: t('faq.answers.search.a3') },
        { question: t('faq.questions.search.q4'), answer: t('faq.answers.search.a4') },
        { question: t('faq.questions.search.q5'), answer: t('faq.answers.search.a5') }
      ]
    },
    {
      id: 'user',
      title: t('faq.userFeatures'),
      icon: <Users className="h-5 w-5" />,
      description: t('faq.userFeaturesDesc'),
      color: 'bg-cyan-100 text-cyan-700',
      items: [
        { question: t('faq.questions.user.q1'), answer: t('faq.answers.user.a1') },
        { question: t('faq.questions.user.q2'), answer: t('faq.answers.user.a2') },
        { question: t('faq.questions.user.q3'), answer: t('faq.answers.user.a3') },
        { question: t('faq.questions.user.q4'), answer: t('faq.answers.user.a4') },
        { question: t('faq.questions.user.q5'), answer: t('faq.answers.user.a5') },
        { question: t('faq.questions.user.q6'), answer: t('faq.answers.user.a6') }
      ]
    },
    {
      id: 'social',
      title: t('faq.socialFollowing'),
      icon: <UserPlus className="h-5 w-5" />,
      description: t('faq.socialFollowingDesc'),
      color: 'bg-pink-100 text-pink-700',
      items: [
        { question: t('faq.questions.social.q1'), answer: t('faq.answers.social.a1') },
        { question: t('faq.questions.social.q2'), answer: t('faq.answers.social.a2') },
        { question: t('faq.questions.social.q3'), answer: t('faq.answers.social.a3') },
        { question: t('faq.questions.social.q4'), answer: t('faq.answers.social.a4') },
        { question: t('faq.questions.social.q5'), answer: t('faq.answers.social.a5') }
      ]
    },
    {
      id: 'notifications',
      title: t('faq.notifications'),
      icon: <Bell className="h-5 w-5" />,
      description: t('faq.notificationsDesc'),
      color: 'bg-yellow-100 text-yellow-700',
      items: [
        { question: t('faq.questions.notifications.q1'), answer: t('faq.answers.notifications.a1') },
        { question: t('faq.questions.notifications.q2'), answer: t('faq.answers.notifications.a2') },
        { question: t('faq.questions.notifications.q3'), answer: t('faq.answers.notifications.a3') },
        { question: t('faq.questions.notifications.q4'), answer: t('faq.answers.notifications.a4') }
      ]
    },
    {
      id: 'digest',
      title: t('faq.weeklyDigest'),
      icon: <Mail className="h-5 w-5" />,
      description: t('faq.weeklyDigestDesc'),
      color: 'bg-emerald-100 text-emerald-700',
      items: [
        { question: t('faq.questions.digest.q1'), answer: t('faq.answers.digest.a1') },
        { question: t('faq.questions.digest.q2'), answer: t('faq.answers.digest.a2') },
        { question: t('faq.questions.digest.q3'), answer: t('faq.answers.digest.a3') },
        { question: t('faq.questions.digest.q4'), answer: t('faq.answers.digest.a4') },
        { question: t('faq.questions.digest.q5'), answer: t('faq.answers.digest.a5') },
        { question: t('faq.questions.digest.q6'), answer: t('faq.answers.digest.a6') },
        { question: t('faq.questions.digest.q7'), answer: t('faq.answers.digest.a7') }
      ]
    },
    {
      id: 'comments',
      title: t('faq.commentsRatings'),
      icon: <Star className="h-5 w-5" />,
      description: t('faq.commentsRatingsDesc'),
      color: 'bg-amber-100 text-amber-700',
      items: [
        { question: t('faq.questions.comments.q1'), answer: t('faq.answers.comments.a1') },
        { question: t('faq.questions.comments.q2'), answer: t('faq.answers.comments.a2') },
        { question: t('faq.questions.comments.q3'), answer: t('faq.answers.comments.a3') },
        { question: t('faq.questions.comments.q4'), answer: t('faq.answers.comments.a4') },
        { question: t('faq.questions.comments.q5'), answer: t('faq.answers.comments.a5') }
      ]
    },
    {
      id: 'messaging',
      title: t('faq.messaging'),
      icon: <MessageCircle className="h-5 w-5" />,
      description: t('faq.messagingDesc'),
      color: 'bg-violet-100 text-violet-700',
      items: [
        { question: t('faq.questions.messaging.q1'), answer: t('faq.answers.messaging.a1') },
        { question: t('faq.questions.messaging.q2'), answer: t('faq.answers.messaging.a2') },
        { question: t('faq.questions.messaging.q3'), answer: t('faq.answers.messaging.a3') },
        { question: t('faq.questions.messaging.q4'), answer: t('faq.answers.messaging.a4') }
      ]
    },
    {
      id: 'languages',
      title: t('faq.languagesAccessibility'),
      icon: <Globe className="h-5 w-5" />,
      description: t('faq.languagesAccessibilityDesc'),
      color: 'bg-sky-100 text-sky-700',
      items: [
        { question: t('faq.questions.languages.q1'), answer: t('faq.answers.languages.a1') },
        { question: t('faq.questions.languages.q2'), answer: t('faq.answers.languages.a2') },
        { question: t('faq.questions.languages.q3'), answer: t('faq.answers.languages.a3') },
        { question: t('faq.questions.languages.q4'), answer: t('faq.answers.languages.a4') }
      ]
    },
    {
      id: 'submission',
      title: t('faq.submissionProcess'),
      icon: <Shield className="h-5 w-5" />,
      description: t('faq.submissionProcessDesc'),
      color: 'bg-slate-100 text-slate-700',
      items: [
        { question: t('faq.questions.submission.q1'), answer: t('faq.answers.submission.a1') },
        { question: t('faq.questions.submission.q2'), answer: t('faq.answers.submission.a2') },
        { question: t('faq.questions.submission.q3'), answer: t('faq.answers.submission.a3') },
        { question: t('faq.questions.submission.q4'), answer: t('faq.answers.submission.a4') },
        { question: t('faq.questions.submission.q5'), answer: t('faq.answers.submission.a5') }
      ]
    },
    {
      id: 'trending',
      title: t('faq.trendingDiscovery'),
      icon: <Heart className="h-5 w-5" />,
      description: t('faq.trendingDiscoveryDesc'),
      color: 'bg-rose-100 text-rose-700',
      items: [
        { question: t('faq.questions.trending.q1'), answer: t('faq.answers.trending.a1') },
        { question: t('faq.questions.trending.q2'), answer: t('faq.answers.trending.a2') },
        { question: t('faq.questions.trending.q3'), answer: t('faq.answers.trending.a3') },
        { question: t('faq.questions.trending.q4'), answer: t('faq.answers.trending.a4') }
      ]
    },
    {
      id: 'account',
      title: t('faq.accountPrivacy'),
      icon: <Shield className="h-5 w-5" />,
      description: t('faq.accountPrivacyDesc'),
      color: 'bg-gray-100 text-gray-700',
      items: [
        { question: t('faq.questions.account.q1'), answer: t('faq.answers.account.a1') },
        { question: t('faq.questions.account.q2'), answer: t('faq.answers.account.a2') },
        { question: t('faq.questions.account.q3'), answer: t('faq.answers.account.a3') },
        { question: t('faq.questions.account.q4'), answer: t('faq.answers.account.a4') },
        { question: t('faq.questions.account.q5'), answer: t('faq.answers.account.a5') }
      ]
    }
  ];

  // Filter categories based on search query
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) {
      return activeCategory 
        ? featureCategories.filter(cat => cat.id === activeCategory)
        : featureCategories;
    }
    
    const query = searchQuery.toLowerCase();
    return featureCategories
      .map(category => ({
        ...category,
        items: category.items.filter(
          item => 
            item.question.toLowerCase().includes(query) ||
            item.answer.toLowerCase().includes(query)
        )
      }))
      .filter(category => category.items.length > 0);
  }, [searchQuery, activeCategory, featureCategories]);

  const totalQuestions = featureCategories.reduce((sum, cat) => sum + cat.items.length, 0);
  const filteredQuestions = filteredCategories.reduce((sum, cat) => sum + cat.items.length, 0);

  const scrollToCategory = (categoryId: string) => {
    setActiveCategory(categoryId);
    setSearchQuery('');
    const element = document.getElementById(`category-${categoryId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setActiveCategory(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 border-b">
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              {t('faq.title')}
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t('faq.subtitle')}
            </p>
            
            {/* Search Bar */}
            <div className="max-w-xl mx-auto pt-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search FAQs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-10 h-12 text-base rounded-full border-2 focus:border-primary"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
              {searchQuery && (
                <p className="text-sm text-muted-foreground mt-2">
                  Found {filteredQuestions} of {totalQuestions} questions
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Quick Navigation */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="sticky top-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Quick Navigation</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[60vh]">
                    <div className="px-4 pb-4 space-y-1">
                      <Button
                        variant={activeCategory === null ? "secondary" : "ghost"}
                        size="sm"
                        className="w-full justify-start text-left"
                        onClick={clearFilters}
                      >
                        All Categories
                        <Badge variant="outline" className="ml-auto">{totalQuestions}</Badge>
                      </Button>
                      {featureCategories.map((category) => (
                        <Button
                          key={category.id}
                          variant={activeCategory === category.id ? "secondary" : "ghost"}
                          size="sm"
                          className="w-full justify-start text-left"
                          onClick={() => scrollToCategory(category.id)}
                        >
                          <span className="flex items-center gap-2 flex-1 min-w-0">
                            {category.icon}
                            <span className="truncate">{category.title}</span>
                          </span>
                          <Badge variant="outline" className="ml-2 flex-shrink-0">{category.items.length}</Badge>
                        </Button>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Active filter indicator */}
            {(activeCategory || searchQuery) && (
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <span className="text-sm text-muted-foreground">Filtering:</span>
                {activeCategory && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {featureCategories.find(c => c.id === activeCategory)?.title}
                    <button onClick={() => setActiveCategory(null)} className="ml-1 hover:text-destructive">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {searchQuery && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    "{searchQuery}"
                    <button onClick={() => setSearchQuery('')} className="ml-1 hover:text-destructive">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear all
                </Button>
              </div>
            )}

            {/* Category Cards */}
            <div className="space-y-6">
              {filteredCategories.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No results found</h3>
                    <p className="text-muted-foreground mb-4">
                      Try a different search term or browse all categories
                    </p>
                    <Button onClick={clearFilters}>View All FAQs</Button>
                  </CardContent>
                </Card>
              ) : (
                filteredCategories.map((category) => (
                  <Card key={category.id} id={`category-${category.id}`} className="overflow-hidden">
                    <CardHeader className={`${category.color} bg-opacity-50`}>
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${category.color}`}>
                          {category.icon}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{category.title}</CardTitle>
                          <CardDescription className="text-foreground/70">
                            {category.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <Accordion type="single" collapsible className="w-full">
                        {category.items.map((item, itemIndex) => (
                          <AccordionItem key={itemIndex} value={`${category.id}-${itemIndex}`}>
                            <AccordionTrigger className="text-left hover:no-underline hover:text-primary">
                              <span className="flex items-start gap-2">
                                <ChevronRight className="h-4 w-4 mt-1 flex-shrink-0 text-muted-foreground" />
                                <span>{item.question}</span>
                              </span>
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground pl-6">
                              {item.answer}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {/* Contact Section */}
            <Card className="mt-8 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-primary" />
                  {t('faq.stillHaveQuestions')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  {t('faq.contactMessage')}
                </p>
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                    {t('faq.badges.communitySupport')}
                  </Badge>
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                    {t('faq.badges.helpDocs')}
                  </Badge>
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                    {t('faq.badges.contactForm')}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </div>
  );
};

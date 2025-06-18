
import { useState } from "react";
import { HeroSection } from "@/components/HeroSection";
import { Navigation } from "@/components/Navigation";
import { EventsContent } from "@/components/EventsContent";
import BusinessCard from "@/components/BusinessCard";
import NewsCard from "@/components/NewsCard";
import BusinessSubmissionCard from "@/components/BusinessSubmissionCard";
import NewsSubmissionCard from "@/components/NewsSubmissionCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useBusiness } from "@/hooks/useBusiness";
import { useNews } from "@/hooks/useNews";
import { useBusinessSubmissions } from "@/hooks/useBusinessSubmissions";
import { useNewsSubmissions } from "@/hooks/useNewsSubmissions";
import { Business } from "@/types/business";
import { News } from "@/types/news";
import { BusinessSubmission, NewsSubmission } from "@/types/submissions";

const Index = () => {
  const [activeTab, setActiveTab] = useState("events");
  const { data: businesses, isLoading: businessLoading } = useBusiness();
  const { data: news, isLoading: newsLoading } = useNews();
  const { data: businessSubmissions, isLoading: businessSubmissionsLoading } = useBusinessSubmissions();
  const { data: newsSubmissions, isLoading: newsSubmissionsLoading } = useNewsSubmissions();

  // Combine approved businesses with approved business submissions
  const allBusinesses: (Business | BusinessSubmission)[] = [
    ...(businesses || []),
    ...(businessSubmissions || [])
  ];

  // Combine approved news with approved news submissions
  const allNews: (News | NewsSubmission)[] = [
    ...(news || []),
    ...(newsSubmissions || [])
  ];

  const isBusinessLoading = businessLoading || businessSubmissionsLoading;
  const isNewsLoading = newsLoading || newsSubmissionsLoading;

  // Type guard functions
  const isBusinessSubmission = (item: Business | BusinessSubmission): item is BusinessSubmission => {
    return 'status' in item;
  };

  const isNewsSubmission = (item: News | NewsSubmission): item is NewsSubmission => {
    return 'status' in item;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <Navigation />
      <HeroSection title="Welcome to LocalEvents" subtitle="Discover amazing events, businesses, and news in your area" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="business">Business</TabsTrigger>
            <TabsTrigger value="news">News</TabsTrigger>
          </TabsList>
          
          <TabsContent value="events">
            <EventsContent 
              viewMode="grid"
              filteredEvents={[]}
              searchTerm=""
              selectedCategory="all"
              loading={false}
            />
          </TabsContent>
          
          <TabsContent value="business">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Local Businesses</h2>
              {isBusinessLoading ? (
                <div className="text-center py-8">Loading businesses...</div>
              ) : allBusinesses && allBusinesses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {allBusinesses.map((business) => (
                    isBusinessSubmission(business) ? (
                      <BusinessSubmissionCard key={business.id} submission={business} />
                    ) : (
                      <BusinessCard key={business.id} business={business} />
                    )
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No businesses found. Be the first to add one!
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="news">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Local News</h2>
              {isNewsLoading ? (
                <div className="text-center py-8">Loading news...</div>
              ) : allNews && allNews.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {allNews.map((article) => (
                    isNewsSubmission(article) ? (
                      <NewsSubmissionCard key={article.id} submission={article} />
                    ) : (
                      <NewsCard key={article.id} news={article} />
                    )
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No news articles found. Be the first to add one!
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;

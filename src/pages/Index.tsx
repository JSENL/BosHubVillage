
import { useState } from "react";
import HeroSection from "@/components/HeroSection";
import Navigation from "@/components/Navigation";
import EventsContent from "@/components/EventsContent";
import BusinessCard from "@/components/BusinessCard";
import NewsCard from "@/components/NewsCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useBusiness } from "@/hooks/useBusiness";
import { useNews } from "@/hooks/useNews";

const Index = () => {
  const [activeTab, setActiveTab] = useState("events");
  const { data: businesses, isLoading: businessLoading } = useBusiness();
  const { data: news, isLoading: newsLoading } = useNews();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <Navigation />
      <HeroSection />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="business">Business</TabsTrigger>
            <TabsTrigger value="news">News</TabsTrigger>
          </TabsList>
          
          <TabsContent value="events">
            <EventsContent />
          </TabsContent>
          
          <TabsContent value="business">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Local Businesses</h2>
              {businessLoading ? (
                <div className="text-center py-8">Loading businesses...</div>
              ) : businesses && businesses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {businesses.map((business) => (
                    <BusinessCard key={business.id} business={business} />
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
              {newsLoading ? (
                <div className="text-center py-8">Loading news...</div>
              ) : news && news.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {news.map((article) => (
                    <NewsCard key={article.id} news={article} />
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

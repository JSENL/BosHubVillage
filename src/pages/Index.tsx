import { useState } from "react";
import { HeroSection } from "@/components/HeroSection";
import { Navigation } from "@/components/Navigation";
import { EventCard } from "@/components/EventCard";
import { EventFiltersEnhanced } from "@/components/EventFiltersEnhanced";
import { SectionMap } from "@/components/SectionMap";
import { useEventsWithFilters } from "@/hooks/useEventsWithFilters";
import BusinessCard from "@/components/BusinessCard";
import NewsCard from "@/components/NewsCard";
import LocalServiceCard from "@/components/LocalServiceCard";
import { BusinessSubmissionCard } from "@/components/BusinessSubmissionCard";
import { NewsSubmissionCard } from "@/components/NewsSubmissionCard";
import LocalServiceSubmissionCard from "@/components/LocalServiceSubmissionCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search } from 'lucide-react';
import { useBusiness } from "@/hooks/useBusiness";
import { useNews } from "@/hooks/useNews";
import { useLocalServices } from "@/hooks/useLocalServices";
import { useBusinessSubmissions } from "@/hooks/useBusinessSubmissions";
import { useNewsSubmissions } from "@/hooks/useNewsSubmissions";
import { useLocalServiceSubmissions } from "@/hooks/useLocalServiceSubmissions";
import { Business } from "@/types/business";
import { News } from "@/types/news";
import { LocalService, LocalServiceSubmission } from "@/types/localServices";
import { BusinessSubmission, NewsSubmission } from "@/types/submissions";

const Index = () => {
  const [activeTab, setActiveTab] = useState("events");
  
  const { data: businesses, isLoading: businessLoading, refetch: refetchBusinesses } = useBusiness();
  const { data: news, isLoading: newsLoading, refetch: refetchNews } = useNews();
  const { data: localServices, isLoading: localServicesLoading, refetch: refetchLocalServices } = useLocalServices();
  const { data: businessSubmissions, isLoading: businessSubmissionsLoading, refetch: refetchBusinessSubmissions } = useBusinessSubmissions();
  const { data: newsSubmissions, isLoading: newsSubmissionsLoading, refetch: refetchNewsSubmissions } = useNewsSubmissions();
  const { data: localServiceSubmissions, isLoading: localServiceSubmissionsLoading, refetch: refetchLocalServiceSubmissions } = useLocalServiceSubmissions();
  
  const {
    events: filteredEvents,
    loading: eventsLoading,
    selectedCategory,
    setSelectedCategory,
    selectedNeighborhood,
    setSelectedNeighborhood,
    selectedVillage,
    setSelectedVillage,
    dateFilter,
    setDateFilter,
    timeFilter,
    setTimeFilter,
    searchTerm,
    setSearchTerm,
    events: allEvents
  } = useEventsWithFilters();

  const allBusinesses: (Business | BusinessSubmission)[] = [
    ...(businesses || []),
    ...(businessSubmissions || [])
  ];

  const allNews: (News | NewsSubmission)[] = [
    ...(news || []),
    ...(newsSubmissions || [])
  ];

  const allLocalServices: (LocalService | LocalServiceSubmission)[] = [
    ...(localServices || []),
    ...(localServiceSubmissions || [])
  ];

  const isBusinessLoading = businessLoading || businessSubmissionsLoading;
  const isNewsLoading = newsLoading || newsSubmissionsLoading;
  const isLocalServicesLoading = localServicesLoading || localServiceSubmissionsLoading;

  const isBusinessSubmission = (item: Business | BusinessSubmission): item is BusinessSubmission => {
    return 'status' in item;
  };

  const isNewsSubmission = (item: News | NewsSubmission): item is NewsSubmission => {
    return 'status' in item;
  };

  const isLocalServiceSubmission = (item: LocalService | LocalServiceSubmission): item is LocalServiceSubmission => {
    return 'status' in item;
  };

  const handleBusinessUpdate = () => {
    refetchBusinesses();
    refetchBusinessSubmissions();
  };

  const handleNewsUpdate = () => {
    refetchNews();
    refetchNewsSubmissions();
  };

  const handleLocalServicesUpdate = () => {
    refetchLocalServices();
    refetchLocalServiceSubmissions();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <Navigation />
      <HeroSection title="Welcome to LocalEvents" subtitle="Discover amazing events, businesses, and news in your area" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="business">Business</TabsTrigger>
            <TabsTrigger value="local-services">Local Services</TabsTrigger>
            <TabsTrigger value="news">News</TabsTrigger>
          </TabsList>
          
          <TabsContent value="events">
            <div className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">Local Events</h2>
                
                {/* Google Map below title */}
                <SectionMap height="400px" />
                
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search events..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 max-w-md"
                  />
                </div>

                <EventFiltersEnhanced
                  events={allEvents}
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                  selectedNeighborhood={selectedNeighborhood}
                  onNeighborhoodChange={setSelectedNeighborhood}
                  selectedVillage={selectedVillage}
                  onVillageChange={setSelectedVillage}
                  dateFilter={dateFilter}
                  onDateFilterChange={setDateFilter}
                  timeFilter={timeFilter}
                  onTimeFilterChange={setTimeFilter}
                  searchTerm={searchTerm}
                  filteredEventsCount={filteredEvents.length}
                />
              </div>

              {eventsLoading ? (
                <div className="text-center py-8">Loading events...</div>
              ) : filteredEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredEvents.map((event) => (
                    <EventCard key={event.id} event={event} viewMode="grid" />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No events found. Try adjusting your filters or be the first to add one!
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="business">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Local Businesses</h2>
              
              {/* Google Map below title */}
              <SectionMap height="400px" />
              
              {isBusinessLoading ? (
                <div className="text-center py-8">Loading businesses...</div>
              ) : allBusinesses && allBusinesses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {allBusinesses.map((business) => (
                    isBusinessSubmission(business) ? (
                      <BusinessSubmissionCard key={business.id} submission={business} onUpdate={handleBusinessUpdate} />
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
          
          <TabsContent value="local-services">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Local Services & Nonprofits</h2>
              
              {/* Google Map below title */}
              <SectionMap height="400px" />
              
              {isLocalServicesLoading ? (
                <div className="text-center py-8">Loading local services...</div>
              ) : allLocalServices && allLocalServices.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {allLocalServices.map((service) => (
                    isLocalServiceSubmission(service) ? (
                      <LocalServiceSubmissionCard key={service.id} submission={service} onUpdate={handleLocalServicesUpdate} />
                    ) : (
                      <LocalServiceCard key={service.id} localService={service} />
                    )
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No local services found. Be the first to add one!
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="news">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Local News</h2>
              
              {/* Google Map below title */}
              <SectionMap height="400px" />
              
              {isNewsLoading ? (
                <div className="text-center py-8">Loading news...</div>
              ) : allNews && allNews.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {allNews.map((article) => (
                    isNewsSubmission(article) ? (
                      <NewsSubmissionCard key={article.id} submission={article} onUpdate={handleNewsUpdate} />
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

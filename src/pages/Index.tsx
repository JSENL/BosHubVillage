
import { useState } from "react";
import { HeroSection } from "@/components/HeroSection";
import { Navigation } from "@/components/Navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TypeFilter } from "@/components/filters/TypeFilter";
import { EventsTab } from "@/components/tabs/EventsTab";
import { BusinessTab } from "@/components/tabs/BusinessTab";
import { LocalServicesTab } from "@/components/tabs/LocalServicesTab";
import { NewsTab } from "@/components/tabs/NewsTab";

const Index = () => {
  const [activeTab, setActiveTab] = useState("events");
  const [selectedType, setSelectedType] = useState("all");

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
    // Auto-switch to the corresponding tab when a specific type is selected
    if (type === "event") {
      setActiveTab("events");
    } else if (type === "business") {
      setActiveTab("business");
    } else if (type === "local-service") {
      setActiveTab("local-services");
    } else if (type === "news") {
      setActiveTab("news");
    }
    // If "all" is selected, stay on current tab
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <Navigation />
      <HeroSection title="Welcome to LocalEvents" subtitle="Discover amazing events, businesses, and news in your area" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <TypeFilter
            selectedType={selectedType}
            onTypeChange={handleTypeChange}
          />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="business">Business</TabsTrigger>
            <TabsTrigger value="local-services">Local Resources</TabsTrigger>
            <TabsTrigger value="news">News</TabsTrigger>
          </TabsList>
          
          <TabsContent value="events">
            <EventsTab />
          </TabsContent>
          
          <TabsContent value="business">
            <BusinessTab />
          </TabsContent>
          
          <TabsContent value="local-services">
            <LocalServicesTab />
          </TabsContent>
          
          <TabsContent value="news">
            <NewsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;

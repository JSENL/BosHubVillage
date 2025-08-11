import { useEvents } from "@/hooks/useEvents";
import { useNews } from "@/hooks/useNews";
import { useBusiness } from "@/hooks/useBusiness";
import { useBusinessSubmissions } from "@/hooks/useBusinessSubmissions";
import { useLocalServices } from "@/hooks/useLocalServices";
import { useLocalServiceSubmissions } from "@/hooks/useLocalServiceSubmissions";

export const useHomePageData = () => {
  // Data hooks - using correct property names based on actual hook implementations
  const { events, loading: eventsLoading } = useEvents();
  const { data: news, isLoading: newsLoading } = useNews();
  
  const { data: businesses, isLoading: businessLoading } = useBusiness();
  const { submissions: businessSubmissions, loading: businessSubmissionsLoading } = useBusinessSubmissions();
  const { data: localServices, isLoading: localServicesLoading } = useLocalServices();
  const { data: localServiceSubmissions, isLoading: localServiceSubmissionsLoading } = useLocalServiceSubmissions();

  // Combine loading states
  const isLoading = eventsLoading || newsLoading || businessLoading || 
                   businessSubmissionsLoading || localServicesLoading || 
                   localServiceSubmissionsLoading;

  return {
    data: {
      events,
      news,
      businesses,
      businessSubmissions,
      localServices,
      localServiceSubmissions
    },
    loading: {
      eventsLoading,
      newsLoading,
      businessLoading,
      businessSubmissionsLoading,
      localServicesLoading,
      localServiceSubmissionsLoading,
      isLoading
    }
  };
};
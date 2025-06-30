
import { useState, useEffect } from "react";
import { SectionMap } from "@/components/SectionMap";
import NewsCard from "@/components/NewsCard";
import { useNews } from "@/hooks/useNews";
import { useNewsSubmissions } from "@/hooks/useNewsSubmissions";
import { useGeocoding } from "@/hooks/useGeocoding";
import { geocodeNewsItems } from "@/utils/geocodeNewsItems";
import { News } from "@/types/news";
import { NewsSubmission } from "@/types/submissions";

export const NewsTab = () => {
  const { data: news, isLoading: newsLoading } = useNews();
  const { data: newsSubmissions, isLoading: newsSubmissionsLoading } = useNewsSubmissions();
  const { geocode, isReady } = useGeocoding();
  const [hasGeocodedNews, setHasGeocodedNews] = useState(false);
  
  const allNews: (News | NewsSubmission)[] = [
    ...(news || []),
    ...(newsSubmissions || [])
  ];

  const isNewsLoading = newsLoading || newsSubmissionsLoading;

  // Only geocode if we have news items without coordinates and geocoding is ready
  useEffect(() => {
    const geocodeNewsIfNeeded = async () => {
      if (!isReady || hasGeocodedNews || isNewsLoading || !news || news.length === 0) {
        return;
      }

      // Only geocode items that actually need geocoding (have location but no coordinates)
      const newsNeedingGeocode = news.filter(newsItem => 
        newsItem.location && 
        newsItem.location.trim() !== '' &&
        (!newsItem.latitude || !newsItem.longitude || 
         newsItem.latitude === null || newsItem.longitude === null)
      );

      if (newsNeedingGeocode.length > 0) {
        console.log(`Found ${newsNeedingGeocode.length} news items that need geocoding`);
        try {
          await geocodeNewsItems(newsNeedingGeocode, geocode);
          setHasGeocodedNews(true);
        } catch (error) {
          console.error('Error geocoding news items:', error);
        }
      } else {
        setHasGeocodedNews(true); // No items need geocoding
      }
    };

    geocodeNewsIfNeeded();
  }, [news, isReady, geocode, hasGeocodedNews, isNewsLoading]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Community News</h2>
      
      <SectionMap height="400px" />
      
      {isNewsLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading news...</p>
        </div>
      ) : allNews && allNews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allNews.map((newsItem) => (
            <NewsCard key={newsItem.id} news={newsItem} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No news found. Be the first to add some!
        </div>
      )}
    </div>
  );
};

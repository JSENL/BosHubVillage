
import { useState, useEffect } from "react";
import { SectionMap } from "@/components/SectionMap";
import { UniversalFilters } from "@/components/UniversalFilters";
import NewsCard from "@/components/NewsCard";
import { useNews } from "@/hooks/useNews";

import { useGeocoding } from "@/hooks/useGeocoding";
import { geocodeNewsItems } from "@/utils/geocodeNewsItems";
import { News } from "@/types/news";


export const NewsTab = () => {
  const { data: news, isLoading: newsLoading, error: newsError } = useNews();
  
  const { geocode, isReady } = useGeocoding();
  const [hasGeocodedNews, setHasGeocodedNews] = useState(false);
  
  // Filter states
  const [selectedType, setSelectedType] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedNeighborhood, setSelectedNeighborhood] = useState("all");
  const [selectedVillage, setSelectedVillage] = useState("all");
  
  console.log('NewsTab - news:', news);
  
  console.log('NewsTab - newsError:', newsError);
  
  // Only show published news, not submissions (submissions are handled separately in admin)
  const allNews: News[] = news || [];

  console.log('NewsTab - allNews:', allNews);

  const isNewsLoading = newsLoading;

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
      
      <UniversalFilters
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedNeighborhood={selectedNeighborhood}
        onNeighborhoodChange={setSelectedNeighborhood}
        selectedVillage={selectedVillage}
        onVillageChange={setSelectedVillage}
        filteredItemsCount={allNews.length}
        itemType="news"
      />
      
      <SectionMap height="400px" />
      
      <div className="mb-4 text-sm text-gray-500">
        Total news items: {allNews.length}
      </div>
      
      {newsError && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">Error loading news: {newsError.message}</p>
        </div>
      )}
      
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

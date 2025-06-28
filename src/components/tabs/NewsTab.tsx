
import { SectionMap } from "@/components/SectionMap";
import NewsCard from "@/components/NewsCard";
import { GeocodeAllNewsButton } from "@/components/GeocodeAllNewsButton";
import { useNews } from "@/hooks/useNews";
import { useNewsSubmissions } from "@/hooks/useNewsSubmissions";
import { News } from "@/types/news";
import { NewsSubmission } from "@/types/submissions";

export const NewsTab = () => {
  const { data: news, isLoading: newsLoading, refetch: refetchNews } = useNews();
  const { data: newsSubmissions, isLoading: newsSubmissionsLoading } = useNewsSubmissions();
  
  const allNews: (News | NewsSubmission)[] = [
    ...(news || []),
    ...(newsSubmissions || [])
  ];

  const isNewsLoading = newsLoading || newsSubmissionsLoading;

  console.log('NewsTab - Total news items:', allNews.length);
  console.log('NewsTab - Published news:', news?.length || 0);
  console.log('NewsTab - News submissions:', newsSubmissions?.length || 0);

  // Add periodic refresh to ensure latest data
  const handleRefresh = () => {
    console.log('Refreshing news data...');
    refetchNews();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Local News</h2>
        <div className="flex gap-2">
          <GeocodeAllNewsButton />
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Refresh ({allNews.length})
          </button>
        </div>
      </div>
      
      <SectionMap height="400px" />
      
      {isNewsLoading ? (
        <div className="text-center py-8">Loading news...</div>
      ) : allNews && allNews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allNews.map((article) => (
            <NewsCard key={article.id} news={article} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No news articles found. Be the first to add one!
        </div>
      )}
    </div>
  );
};


import { SectionMap } from "@/components/SectionMap";
import NewsCard from "@/components/NewsCard";
import { useNews } from "@/hooks/useNews";
import { useNewsSubmissions } from "@/hooks/useNewsSubmissions";
import { News } from "@/types/news";
import { NewsSubmission } from "@/types/submissions";

export const NewsTab = () => {
  const { data: news, isLoading: newsLoading } = useNews();
  const { data: newsSubmissions, isLoading: newsSubmissionsLoading } = useNewsSubmissions();
  
  const allNews: (News | NewsSubmission)[] = [
    ...(news || []),
    ...(newsSubmissions || [])
  ];

  const isNewsLoading = newsLoading || newsSubmissionsLoading;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Local News</h2>
      
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

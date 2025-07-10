
import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { useNews } from '@/hooks/useNews';
import NewsHeader from '@/components/news/NewsHeader';
import NewsSearch from '@/components/news/NewsSearch';
import FeaturedArticle from '@/components/news/FeaturedArticle';
import SecondaryArticles from '@/components/news/SecondaryArticles';
import NewsGrid from '@/components/news/NewsGrid';

const NewsPage = () => {
  const { data: news, isLoading } = useNews();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredNews = (news || []).filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const featuredArticle = filteredNews[0];
  const secondaryArticles = filteredNews.slice(1, 3);
  const remainingArticles = filteredNews.slice(3);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading news...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <NewsHeader />
      <NewsSearch searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredNews.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No news articles found.</p>
          </div>
        ) : (
          <>
            {/* Featured Article Section */}
            {featuredArticle && (
              <section className="mb-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Main Featured Article */}
                  <div className="lg:col-span-2">
                    <FeaturedArticle article={featuredArticle} />
                  </div>
                  
                  {/* Secondary Articles */}
                  <div>
                    <SecondaryArticles articles={secondaryArticles} />
                  </div>
                </div>
              </section>
            )}

            {/* All Articles Grid */}
            <NewsGrid articles={remainingArticles} />
          </>
        )}
      </main>
    </div>
  );
};

export default NewsPage;

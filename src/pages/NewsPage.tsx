
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { useNews } from '@/hooks/useNews';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Calendar, MapPin, ExternalLink, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';

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
      
      {/* Header */}
      <header className="bg-white border-b-4 border-red-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between mb-4">
              <Link to="/" className="flex items-center text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
              <div className="text-sm text-gray-500">
                {format(new Date(), 'EEEE, MMMM d, yyyy')}
              </div>
            </div>
            
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-serif font-bold text-gray-900 mb-2">
                LocalHub News
              </h1>
              <p className="text-lg text-gray-600">Your Community's Voice</p>
            </div>
            
            {/* Search Bar */}
            <div className="mt-6 max-w-md mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search news..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

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
                    <Link to={`/news/${featuredArticle.id}`}>
                      <Card className="hover:shadow-lg transition-shadow cursor-pointer border-0 shadow-none">
                        <CardHeader className="pb-4">
                          <div className="flex flex-wrap gap-2 text-xs text-gray-600 mb-2">
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {format(new Date(featuredArticle.date_posted), 'MMM d, yyyy')}
                            </div>
                            <div className="flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {featuredArticle.location}
                            </div>
                            <div className="flex items-center">
                              <ExternalLink className="h-3 w-3 mr-1" />
                              {featuredArticle.source}
                            </div>
                          </div>
                          <CardTitle className="text-3xl md:text-4xl font-serif font-bold leading-tight hover:text-red-600 transition-colors">
                            {featuredArticle.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-700 text-lg leading-relaxed line-clamp-4">
                            {featuredArticle.content}
                          </p>
                          {featuredArticle.villages && (
                            <div className="flex flex-wrap gap-1 mt-4">
                              {JSON.parse(featuredArticle.villages).map((village: string, index: number) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {village}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </Link>
                  </div>
                  
                  {/* Secondary Articles */}
                  <div className="space-y-6">
                    {secondaryArticles.map((article) => (
                      <Link key={article.id} to={`/news/${article.id}`}>
                        <Card className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-red-600">
                          <CardHeader className="pb-2">
                            <div className="flex flex-wrap gap-2 text-xs text-gray-600 mb-1">
                              <div className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                {format(new Date(article.date_posted), 'MMM d')}
                              </div>
                              <div className="flex items-center">
                                <MapPin className="h-3 w-3 mr-1" />
                                {article.location}
                              </div>
                            </div>
                            <CardTitle className="text-lg font-semibold leading-tight hover:text-red-600 transition-colors line-clamp-3">
                              {article.title}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <p className="text-gray-600 text-sm line-clamp-3">
                              {article.content}
                            </p>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* All Articles Grid */}
            {remainingArticles.length > 0 && (
              <section>
                <div className="border-t-2 border-gray-200 pt-8">
                  <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">More News</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {remainingArticles.map((article) => (
                      <Link key={article.id} to={`/news/${article.id}`}>
                        <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                          <CardHeader>
                            <div className="flex flex-wrap gap-2 text-xs text-gray-600 mb-2">
                              <div className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                {format(new Date(article.date_posted), 'MMM d, yyyy')}
                              </div>
                              <div className="flex items-center">
                                <MapPin className="h-3 w-3 mr-1" />
                                {article.location}
                              </div>
                            </div>
                            <CardTitle className="text-lg font-semibold line-clamp-2 hover:text-red-600 transition-colors">
                              {article.title}
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-gray-700 line-clamp-3 text-sm">
                              {article.content}
                            </p>
                            <div className="mt-3 text-xs text-gray-500">
                              Source: {article.source}
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default NewsPage;

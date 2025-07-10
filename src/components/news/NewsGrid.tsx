
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, MapPin } from 'lucide-react';
import { News } from '@/types/news';
import { format } from 'date-fns';

interface NewsGridProps {
  articles: News[];
}

const NewsGrid = ({ articles }: NewsGridProps) => {
  if (articles.length === 0) return null;

  return (
    <section>
      <div className="border-t-2 border-gray-200 pt-8">
        <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">More News</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
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
  );
};

export default NewsGrid;

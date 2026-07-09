
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, MapPin } from 'lucide-react';
import { News } from '@/types/news';
import { format } from 'date-fns';
import { richTextPlainText } from '@/lib/richText';
import { NewsSubmitterLine } from '@/components/news/NewsSubmitterLine';

interface SecondaryArticlesProps {
  articles: News[];
}

const SecondaryArticles = ({ articles }: SecondaryArticlesProps) => {
  return (
    <div className="space-y-6">
      {articles.map((article) => (
        <Link key={article.id} to={`/news/${article.id}`}>
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-red-600">
            <div className="flex">
              {article.image_url && (
                <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-l-lg">
                  <img 
                    src={article.image_url} 
                    alt={article.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1">
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
                  <NewsSubmitterLine article={article} className="mb-1" />
                  <CardTitle className="text-lg font-semibold leading-tight hover:text-red-600 transition-colors line-clamp-3">
                    {article.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-600 text-sm line-clamp-3">
                    {richTextPlainText(article.content)}
                  </p>
                </CardContent>
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default SecondaryArticles;

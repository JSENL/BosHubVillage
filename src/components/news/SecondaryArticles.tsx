import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, MapPin, MessageCircle } from 'lucide-react';
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
        <Card
          key={article.id}
          className="hover:shadow-md transition-shadow border-l-4 border-l-red-600"
        >
          <div className="flex">
            {article.image_url && (
              <Link
                to={`/news/${article.id}`}
                className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-l-lg"
              >
                <img
                  src={article.image_url}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              </Link>
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
                <Link to={`/news/${article.id}`} className="block">
                  <CardTitle className="text-lg font-semibold leading-tight hover:text-red-600 transition-colors line-clamp-3">
                    {article.title}
                  </CardTitle>
                </Link>
              </CardHeader>
              <CardContent className="pt-0">
                <Link to={`/news/${article.id}`} className="block">
                  <p className="text-gray-600 text-sm line-clamp-3">
                    {richTextPlainText(article.content)}
                  </p>
                  <div className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-red-600">
                    <MessageCircle className="h-3 w-3" />
                    Read & comment
                  </div>
                </Link>
              </CardContent>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default SecondaryArticles;

import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, MapPin, MessageCircle } from 'lucide-react';
import { News } from '@/types/news';
import { format } from 'date-fns';
import { richTextPlainText } from '@/lib/richText';
import { NewsSubmitterLine } from '@/components/news/NewsSubmitterLine';

interface NewsGridProps {
  articles: News[];
}

const NewsGrid = ({ articles }: NewsGridProps) => {
  const { t } = useTranslation();
  if (articles.length === 0) return null;

  return (
    <section>
      <div className="border-t-2 border-gray-200 pt-8">
        <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">
          {t('newsPage.moreHeading', 'More {{label}}', { label: t('navigation.news') })}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <Card key={article.id} className="hover:shadow-lg transition-shadow h-full overflow-hidden">
              {article.image_url && (
                <Link to={`/news/${article.id}`} className="block h-40 overflow-hidden">
                  <img
                    src={article.image_url}
                    alt={article.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </Link>
              )}
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
                <Link to={`/news/${article.id}`} className="block">
                  <CardTitle className="text-lg font-semibold line-clamp-2 hover:text-red-600 transition-colors">
                    {article.title}
                  </CardTitle>
                </Link>
              </CardHeader>
              <CardContent>
                <Link to={`/news/${article.id}`} className="block">
                  <p className="text-gray-700 line-clamp-3 text-sm">
                    {richTextPlainText(article.content)}
                  </p>
                  <div className="mt-3 text-xs text-gray-500">
                    Source: {article.source}
                  </div>
                  <div className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-red-600">
                    <MessageCircle className="h-3 w-3" />
                    Read & comment
                  </div>
                </Link>
                <NewsSubmitterLine article={article} className="mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewsGrid;

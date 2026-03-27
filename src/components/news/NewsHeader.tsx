import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';

const NewsHeader = () => {
  const { t } = useTranslation();
  return (
    <header className="bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6">
          <div className="flex items-center justify-end mb-4">
            <div className="text-sm text-gray-500">
              {format(new Date(), 'EEEE, MMMM d, yyyy')}
            </div>
          </div>
          
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-2">
              HubVillage {t('navigation.news')}
            </h1>
            <p className="text-lg text-muted-foreground">Your Community's Voice</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default NewsHeader;

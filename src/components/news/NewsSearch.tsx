import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export type NewsSearchField = 'all' | 'title' | 'location' | 'source' | 'village';

interface NewsSearchProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  searchField: NewsSearchField;
  onSearchFieldChange: (field: NewsSearchField) => void;
}

const NewsSearch = ({
  searchTerm,
  onSearchChange,
  searchField,
  onSearchFieldChange,
}: NewsSearchProps) => {
  const { t } = useTranslation();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mt-6 max-w-3xl mx-auto flex flex-col sm:flex-row gap-3 sm:items-end">
        <div className="w-full sm:w-[min(100%,220px)] space-y-1.5">
          <Label htmlFor="news-search-field" className="text-sm text-muted-foreground">
            {t('emptyStates.searchNewsFilterBy')}
          </Label>
          <Select
            value={searchField}
            onValueChange={(v) => onSearchFieldChange(v as NewsSearchField)}
          >
            <SelectTrigger id="news-search-field" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('emptyStates.searchNewsAllFields')}</SelectItem>
              <SelectItem value="title">{t('emptyStates.searchNewsByTitle')}</SelectItem>
              <SelectItem value="location">{t('emptyStates.searchNewsByLocation')}</SelectItem>
              <SelectItem value="source">{t('emptyStates.searchNewsBySource')}</SelectItem>
              <SelectItem value="village">{t('emptyStates.searchNewsByVillage')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1 min-w-0 space-y-1.5">
          <Label htmlFor="news-search-query" className="sr-only">
            {t('emptyStates.searchNews')}
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
            <Input
              id="news-search-query"
              placeholder={t('emptyStates.searchNews')}
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsSearch;

import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { useAppState } from '@/contexts/AppStateContext';

export const SearchSection = () => {
  const { t } = useTranslation();
  const { filters, updateFilter } = useAppState();

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      <Input
        placeholder={t('emptyStates.searchAllContent')}
        value={filters.searchTerm}
        onChange={(e) => updateFilter('searchTerm', e.target.value)}
        className="pl-10 w-full"
      />
    </div>
  );
};
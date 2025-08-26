
import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SearchSectionProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onRefresh: () => void;
}

export const SearchSection = ({ searchTerm, onSearchChange, onRefresh }: SearchSectionProps) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col md:flex-row gap-4 p-6 bg-white/70 backdrop-blur-md rounded-2xl border border-purple-100 shadow-lg">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder={t('search.placeholder')}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 border-purple-200 focus:border-purple-400 focus:ring-purple-400"
        />
      </div>
      <button
        onClick={onRefresh}
        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
      >
        <span className="text-sm">🔄</span>
        {t('search.refreshData')}
      </button>
    </div>
  );
};

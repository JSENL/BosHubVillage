
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEventFilterOptions } from '@/hooks/useDatabaseFilterOptions';
import { useTranslation } from 'react-i18next';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const SearchBar = ({ searchQuery, onSearchChange, selectedCategory, onCategoryChange }: SearchBarProps) => {
  const { categories } = useEventFilterOptions();
  const { t } = useTranslation();

  const categoryOptions = [
    { value: 'all', label: t('common.all') + ' ' + t('common.category') },
    ...categories.map(category => ({
      value: category,
      label: category.charAt(0).toUpperCase() + category.slice(1)
    }))
  ];

  return (
    <div className="flex flex-col md:flex-row gap-4 p-6 bg-white/70 backdrop-blur-md rounded-2xl border border-purple-100 shadow-lg">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder={t('forms.searchPlaceholder')}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 border-purple-200 focus:border-purple-400 focus:ring-purple-400"
        />
      </div>
      
      <Select value={selectedCategory} onValueChange={onCategoryChange}>
        <SelectTrigger className="w-full md:w-[200px] border-purple-200 focus:border-purple-400 focus:ring-purple-400">
          <SelectValue placeholder={t('common.category')} />
        </SelectTrigger>
        <SelectContent>
          {categoryOptions.map((category) => (
            <SelectItem key={category.value} value={category.value}>
              {category.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SearchBar;

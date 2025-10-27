
import { useTranslation } from 'react-i18next';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  availableCategories: string[];
}

export const CategoryFilter = ({ 
  selectedCategory, 
  onCategoryChange, 
  availableCategories 
}: CategoryFilterProps) => {
  const { t } = useTranslation();
  const categoryOptions = [
    { value: 'all', label: t('common.category') },
    ...availableCategories.map(category => ({
      value: category,
      label: category.charAt(0).toUpperCase() + category.slice(1)
    }))
  ];

  return (
    <Select value={selectedCategory} onValueChange={onCategoryChange}>
      <SelectTrigger className="w-36 sm:w-48 h-8 sm:h-10 text-xs sm:text-sm">
        <SelectValue placeholder={t('filters.category')} />
      </SelectTrigger>
      <SelectContent>
        {categoryOptions.map((category) => (
          <SelectItem key={category.value} value={category.value}>
            {category.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

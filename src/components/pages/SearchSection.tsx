import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { useFilterContext } from './FilterProvider';

export const SearchSection = () => {
  const { searchTerm, setSearchTerm } = useFilterContext();

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      <Input
        placeholder="Search all content..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-10 w-full"
      />
    </div>
  );
};
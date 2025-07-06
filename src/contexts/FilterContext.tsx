
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface FilterContextType {
  // Common filters
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedNeighborhood: string;
  setSelectedNeighborhood: (neighborhood: string) => void;
  selectedVillage: string;
  setSelectedVillage: (village: string) => void;
  selectedTypes: string[];
  setSelectedTypes: (types: string[]) => void;
  
  // Event-specific filters
  dateFilter: string;
  setDateFilter: (date: string) => void;
  timeFilter: string;
  setTimeFilter: (time: string) => void;
  
  // Clear all filters
  clearAllFilters: () => void;
  
  // Toggle type filter
  toggleType: (type: string) => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const useFilters = () => {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
};

interface FilterProviderProps {
  children: ReactNode;
}

export const FilterProvider: React.FC<FilterProviderProps> = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('all');
  const [selectedVillage, setSelectedVillage] = useState('all');
  const [selectedTypes, setSelectedTypes] = useState<string[]>(['event', 'news', 'business', 'local-service']);
  const [dateFilter, setDateFilter] = useState('');
  const [timeFilter, setTimeFilter] = useState('all');

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedNeighborhood('all');
    setSelectedVillage('all');
    setDateFilter('');
    setTimeFilter('all');
  };

  const toggleType = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const value: FilterContextType = {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    selectedNeighborhood,
    setSelectedNeighborhood,
    selectedVillage,
    setSelectedVillage,
    selectedTypes,
    setSelectedTypes,
    dateFilter,
    setDateFilter,
    timeFilter,
    setTimeFilter,
    clearAllFilters,
    toggleType
  };

  return (
    <FilterContext.Provider value={value}>
      {children}
    </FilterContext.Provider>
  );
};

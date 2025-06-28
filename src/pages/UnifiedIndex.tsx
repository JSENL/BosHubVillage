
import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { HeroSection } from '@/components/HeroSection';
import { EnhancedUniversalMap } from '@/components/EnhancedUniversalMap';
import { UniversalFilters } from '@/components/UniversalFilters';
import { SearchSection } from '@/components/unified/SearchSection';
import { ResultsSummary } from '@/components/unified/ResultsSummary';
import { ItemsList } from '@/components/unified/ItemsList';
import { useUnifiedFiltering } from '@/hooks/useUnifiedFiltering';
import { useFilters, FilterProvider } from '@/contexts/FilterContext';
import { UnifiedItem } from '@/types/unifiedItem';
import { toast } from 'sonner';

const UnifiedIndexContent = () => {
  const {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    selectedNeighborhood,
    setSelectedNeighborhood,
    selectedVillage,
    setSelectedVillage,
    selectedTypes,
    toggleType,
    dateFilter,
    setDateFilter,
    timeFilter,
    setTimeFilter
  } = useFilters();

  const { allItems, mappableItems, loading, refetch } = useUnifiedFiltering({
    selectedCategory,
    selectedNeighborhood,
    selectedVillage,
    selectedTypes,
    searchTerm,
    dateFilter,
    timeFilter
  });

  const [selectedItem, setSelectedItem] = useState<UnifiedItem | null>(null);
  const [highlightedItemId, setHighlightedItemId] = useState<string | null>(null);

  const handleItemClick = (item: UnifiedItem) => {
    console.log('Item selected from map:', item.title);
    setSelectedItem(item);
    setHighlightedItemId(item.id);
    
    // Show toast notification
    toast.success(`Selected: ${item.title}`, {
      duration: 2000,
    });
    
    // Clear highlight after 3 seconds
    setTimeout(() => {
      setHighlightedItemId(null);
    }, 3000);
  };

  const handleRefresh = () => {
    console.log('Refreshing data...');
    refetch();
    toast.success('Data refreshed!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
        <Navigation />
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-sm sm:text-base">Loading content from Supabase...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <Navigation />
      <HeroSection 
        title="Discover Your Community"
        subtitle="Find events, news, businesses, and services in your neighborhood"
      />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        <SearchSection 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onRefresh={handleRefresh}
        />

        <UniversalFilters
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedNeighborhood={selectedNeighborhood}
          onNeighborhoodChange={setSelectedNeighborhood}
          selectedVillage={selectedVillage}
          onVillageChange={setSelectedVillage}
          filteredItemsCount={allItems.length}
          itemType="events"
        />

        <EnhancedUniversalMap
          items={allItems}
          height="600px"
          selectedTypes={selectedTypes}
          onItemClick={handleItemClick}
        />

        <ResultsSummary 
          allItems={allItems}
          mappableItems={mappableItems}
          selectedTypes={selectedTypes}
        />

        <ItemsList 
          allItems={allItems}
          selectedItem={selectedItem}
          highlightedItemId={highlightedItemId}
          onRefresh={handleRefresh}
        />
      </main>
    </div>
  );
};

const UnifiedIndex = () => {
  return (
    <FilterProvider>
      <UnifiedIndexContent />
    </FilterProvider>
  );
};

export default UnifiedIndex;

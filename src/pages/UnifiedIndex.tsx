
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
    selectedTypeFilter,
    setSelectedTypeFilter,
    dateFilter,
    setDateFilter,
    timeFilter,
    setTimeFilter
  } = useFilters();

  // Convert selectedTypeFilter to selectedTypes array for filtering
  const getTypesFromFilter = (typeFilter: string) => {
    if (typeFilter === 'all') {
      return ['event', 'news', 'business', 'local-service'];
    }
    return [typeFilter];
  };

  const { allItems, mappableItems, loading, refetch } = useUnifiedFiltering({
    selectedCategory,
    selectedNeighborhood,
    selectedVillage,
    selectedTypes: getTypesFromFilter(selectedTypeFilter),
    searchTerm,
    dateFilter,
    timeFilter
  });

  const [selectedItem, setSelectedItem] = useState<UnifiedItem | null>(null);
  const [highlightedItemId, setHighlightedItemId] = useState<string | null>(null);

  // Use the filtered types from the type filter
  const typesToShow = getTypesFromFilter(selectedTypeFilter);

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
          selectedTypeFilter={selectedTypeFilter}
          onTypeFilterChange={setSelectedTypeFilter}
          filteredItemsCount={allItems.length}
          itemType="events"
        />

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-2">Debug Information</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>Total Items: {allItems.length}</div>
            <div>Mappable Items: {mappableItems.length}</div>
            <div>Selected Types: {typesToShow.join(', ')}</div>
            <div>Map Items: {allItems.filter(item => 
              item.latitude !== null && 
              item.longitude !== null && 
              typesToShow.includes(item.type)
            ).length}</div>
          </div>
        </div>

        <EnhancedUniversalMap
          items={allItems}
          height="600px"
          selectedTypes={typesToShow}
          onItemClick={handleItemClick}
        />

        <ResultsSummary 
          allItems={allItems}
          mappableItems={mappableItems}
          selectedTypes={getTypesFromFilter(selectedTypeFilter)}
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

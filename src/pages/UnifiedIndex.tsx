import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { HeroSection } from '@/components/HeroSection';
import { EnhancedUniversalMap } from '@/components/EnhancedUniversalMap';
import { MapboxTileTest } from '@/components/MapboxTileTest';
import { UniversalFilters } from '@/components/UniversalFilters';
import { SearchSection } from '@/components/unified/SearchSection';
import { ResultsSummary } from '@/components/unified/ResultsSummary';
import { ItemsList } from '@/components/unified/ItemsList';
import { useUnifiedFiltering } from '@/hooks/useUnifiedFiltering';
import { useFilters, FilterProvider } from '@/contexts/FilterContext';
import { UnifiedItem } from '@/types/unifiedItem';
import { toast } from 'sonner';
import SimpleMapTest from '@/components/SimpleMapTest';

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
    selectedType,
    setSelectedType,
    toggleType,
    eventDateRange,
    setEventDateRange,
    selectedEventDates,
    setSelectedEventDates
  } = useFilters();

  const { allItems, mappableItems, loading, refetch } = useUnifiedFiltering({
    selectedCategory,
    selectedNeighborhood,
    selectedVillage,
    selectedTypes: selectedType === 'all' ? ['event', 'news', 'business', 'local-service', 'past-event'] : [selectedType],
    searchTerm,
    selectedType,
    eventDateRange,
    selectedEventDates
  });

  const [selectedItem, setSelectedItem] = useState<UnifiedItem | null>(null);
  const [highlightedItemId, setHighlightedItemId] = useState<string | null>(null);

  // Use the unified type filter to determine which types to show
  const typesToShow = selectedType === 'all' ? ['event', 'news', 'business', 'local-service', 'past-event'] : [selectedType];
  
  console.log('🔍 UnifiedIndex - Filter Analysis:', {
    selectedType,
    typesToShow,
    allItemsCount: allItems.length,
    mappableItemsCount: mappableItems.length,
    businessItemsInAll: allItems.filter(item => item.type === 'business').length,
    businessItemsInMappable: mappableItems.filter(item => item.type === 'business').length
  });

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
          allItems={allItems}
          searchTerm={searchTerm}
          selectedType={selectedType}
          onTypeChange={setSelectedType}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedNeighborhood={selectedNeighborhood}
          onNeighborhoodChange={setSelectedNeighborhood}
          selectedVillage={selectedVillage}
          onVillageChange={setSelectedVillage}
          eventDateRange={eventDateRange}
          onEventDateRangeChange={setEventDateRange}
          selectedEventDates={selectedEventDates}
          onSelectedEventDatesChange={setSelectedEventDates}
          filteredItemsCount={allItems.length}
          itemType="events"
        />

        <MapboxTileTest />

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

        {/* Temporary Mapbox Test */}
        <div className="bg-yellow-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">🧪 Mapbox Test (Temporary)</h3>
          <SimpleMapTest />
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
          selectedTypes={typesToShow}
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

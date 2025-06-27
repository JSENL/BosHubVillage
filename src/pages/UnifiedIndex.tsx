
import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { HeroSection } from '@/components/HeroSection';
import { EnhancedUniversalMap } from '@/components/EnhancedUniversalMap';
import { UniversalFilters } from '@/components/UniversalFilters';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useUnifiedFiltering } from '@/hooks/useUnifiedFiltering';
import { useFilters, FilterProvider } from '@/contexts/FilterContext';

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

  const { allItems, mappableItems, loading } = useUnifiedFiltering({
    selectedCategory,
    selectedNeighborhood,
    selectedVillage,
    selectedTypes,
    searchTerm,
    dateFilter,
    timeFilter
  });

  const [selectedItem, setSelectedItem] = useState(null);

  const handleItemClick = (item: any) => {
    console.log('Item selected:', item.title);
    setSelectedItem(item);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
        <Navigation />
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-sm sm:text-base">Loading content...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <Navigation />
      <HeroSection />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 p-6 bg-white/70 backdrop-blur-md rounded-2xl border border-purple-100 shadow-lg">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search events, news, businesses, and services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-purple-200 focus:border-purple-400 focus:ring-purple-400"
            />
          </div>
        </div>

        {/* Unified Filters */}
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

        {/* Enhanced Universal Map */}
        <EnhancedUniversalMap
          items={mappableItems}
          height="600px"
          showFilters={true}
          selectedTypes={selectedTypes}
          onTypeToggle={toggleType}
          onItemClick={handleItemClick}
        />

        {/* Results Summary */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold mb-4">Results Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { type: 'event', label: 'Events', color: 'text-red-600' },
              { type: 'news', label: 'News', color: 'text-blue-600' },
              { type: 'business', label: 'Businesses', color: 'text-green-600' },
              { type: 'local-service', label: 'Services', color: 'text-yellow-600' }
            ].map(({ type, label, color }) => {
              const count = allItems.filter(item => item.type === type).length;
              const mappableCount = mappableItems.filter(item => item.type === type).length;
              
              return (
                <div key={type} className="text-center">
                  <div className={`text-2xl font-bold ${color}`}>{count}</div>
                  <div className="text-sm text-gray-600">{label}</div>
                  <div className="text-xs text-gray-400">
                    {mappableCount} on map
                  </div>
                </div>
              );
            })}
          </div>
        </div>
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

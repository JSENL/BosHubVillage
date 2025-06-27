
import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { HeroSection } from '@/components/HeroSection';
import { EnhancedUniversalMap } from '@/components/EnhancedUniversalMap';
import { UniversalFilters } from '@/components/UniversalFilters';
import { UnifiedItemCard } from '@/components/UnifiedItemCard';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
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
        {/* Search Bar with Refresh */}
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
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
          >
            <span className="text-sm">🔄</span>
            Refresh Data
          </button>
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

        {/* Enhanced Universal Map - This will now show filtered markers */}
        <EnhancedUniversalMap
          items={allItems}
          height="600px"
          showFilters={true}
          selectedTypes={selectedTypes}
          onTypeToggle={toggleType}
          onItemClick={handleItemClick}
        />

        {/* Results Summary with Real-time Stats */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Live Results Summary</h2>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-500">Real-time updates</span>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { type: 'event', label: 'Events', color: 'text-red-600', bgColor: 'bg-red-50' },
              { type: 'news', label: 'News', color: 'text-blue-600', bgColor: 'bg-blue-50' },
              { type: 'business', label: 'Businesses', color: 'text-green-600', bgColor: 'bg-green-50' },
              { type: 'local-service', label: 'Services', color: 'text-yellow-600', bgColor: 'bg-yellow-50' }
            ].map(({ type, label, color, bgColor }) => {
              const count = allItems.filter(item => item.type === type).length;
              const mappableCount = mappableItems.filter(item => item.type === type).length;
              
              return (
                <div key={type} className={`text-center p-4 rounded-lg ${bgColor}`}>
                  <div className={`text-2xl font-bold ${color}`}>{count}</div>
                  <div className="text-sm text-gray-600 font-medium">{label}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    {mappableCount} on map
                  </div>
                  <div className="text-xs text-gray-400">
                    {selectedTypes.includes(type) ? '✓ Showing' : '✗ Hidden'}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 text-sm text-gray-500 flex justify-between items-center">
            <span>Total filtered items: {allItems.length} | Items with location data: {mappableItems.length}</span>
            <span className="text-xs">Last updated: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>

        {/* Items List */}
        {allItems.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">All Items ({allItems.length})</h2>
              {selectedItem && (
                <div className="text-sm text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                  Selected: {selectedItem.title}
                </div>
              )}
            </div>
            <div className="grid gap-6">
              {allItems.map((item) => (
                <UnifiedItemCard
                  key={item.id}
                  item={item}
                  viewMode="list"
                  isHighlighted={highlightedItemId === item.id}
                />
              ))}
            </div>
          </div>
        )}

        {allItems.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
            <Search className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">No items found</h3>
            <p className="text-gray-600 text-sm sm:text-base mb-4">Try adjusting your search criteria or browse all items.</p>
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Refresh Data
            </button>
          </div>
        )}
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

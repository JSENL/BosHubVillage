
import { useState } from "react";
import { EventCard } from "@/components/EventCard";
import { EventFiltersEnhanced } from "@/components/EventFiltersEnhanced";
import { SectionMap } from "@/components/SectionMap";
import { useEventsWithFilters } from "@/hooks/useEventsWithFilters";
import { Input } from "@/components/ui/input";
import { Search } from 'lucide-react';

export const EventsTab = () => {
  const {
    events: filteredEvents,
    loading: eventsLoading,
    selectedCategory,
    setSelectedCategory,
    selectedNeighborhood,
    setSelectedNeighborhood,
    selectedVillage,
    setSelectedVillage,
    dateFilter,
    setDateFilter,
    timeFilter,
    setTimeFilter,
    searchTerm,
    setSearchTerm,
    events: allEvents
  } = useEventsWithFilters();

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Local Events</h2>
        
        <SectionMap height="400px" />
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 max-w-md"
          />
        </div>

        <EventFiltersEnhanced
          events={allEvents}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedNeighborhood={selectedNeighborhood}
          onNeighborhoodChange={setSelectedNeighborhood}
          selectedVillage={selectedVillage}
          onVillageChange={setSelectedVillage}
          dateFilter={dateFilter}
          onDateFilterChange={setDateFilter}
          timeFilter={timeFilter}
          onTimeFilterChange={setTimeFilter}
          searchTerm={searchTerm}
          filteredEventsCount={filteredEvents.length}
        />
      </div>

      {eventsLoading ? (
        <div className="text-center py-8">Loading events...</div>
      ) : filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} viewMode="grid" />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No events found. Try adjusting your filters or be the first to add one!
        </div>
      )}
    </div>
  );
};

import { useState } from 'react';
import { DateRange } from 'react-day-picker';

export interface HomePageFilters {
  selectedType: string;
  selectedCategory: string;
  selectedNeighborhood: string;
  selectedVillage: string;
  searchTerm: string;
  eventDateRange: DateRange | undefined;
  selectedEventDates: Date[];
  viewMode: 'map' | 'list';
}

export const useHomePageFilters = () => {
  const [selectedType, setSelectedType] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedNeighborhood, setSelectedNeighborhood] = useState("all");
  const [selectedVillage, setSelectedVillage] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [eventDateRange, setEventDateRange] = useState<DateRange | undefined>();
  const [selectedEventDates, setSelectedEventDates] = useState<Date[]>([]);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');

  const filters: HomePageFilters = {
    selectedType,
    selectedCategory,
    selectedNeighborhood,
    selectedVillage,
    searchTerm,
    eventDateRange,
    selectedEventDates,
    viewMode
  };

  const filterActions = {
    setSelectedType,
    setSelectedCategory,
    setSelectedNeighborhood,
    setSelectedVillage,
    setSearchTerm,
    setEventDateRange,
    setSelectedEventDates,
    setViewMode
  };

  return {
    filters,
    actions: filterActions
  };
};
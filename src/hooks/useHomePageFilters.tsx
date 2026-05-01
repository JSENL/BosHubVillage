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
  viewMode: 'grid' | 'list' | 'map';
  /** Row density when `viewMode === 'list'` and `listPresentation === 'rows'` */
  listDensity: 'comfortable' | 'compact';
  /**
   * When `viewMode === 'list'`: stacked wide rows vs horizontal scrolling mini-cards.
   */
  listPresentation: 'rows' | 'carousel';
}

export const useHomePageFilters = () => {
  const [selectedType, setSelectedType] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedNeighborhood, setSelectedNeighborhood] = useState("all");
  const [selectedVillage, setSelectedVillage] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [eventDateRange, setEventDateRange] = useState<DateRange | undefined>();
  const [selectedEventDates, setSelectedEventDates] = useState<Date[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');
  const [listDensity, setListDensity] = useState<'comfortable' | 'compact'>('comfortable');
  const [listPresentation, setListPresentation] = useState<'rows' | 'carousel'>('rows');

  const filters: HomePageFilters = {
    selectedType,
    selectedCategory,
    selectedNeighborhood,
    selectedVillage,
    searchTerm,
    eventDateRange,
    selectedEventDates,
    viewMode,
    listDensity,
    listPresentation,
  };

  const filterActions = {
    setSelectedType,
    setSelectedCategory,
    setSelectedNeighborhood,
    setSelectedVillage,
    setSearchTerm,
    setEventDateRange,
    setSelectedEventDates,
    setViewMode,
    setListDensity,
    setListPresentation,
  };

  return {
    filters,
    actions: filterActions
  };
};
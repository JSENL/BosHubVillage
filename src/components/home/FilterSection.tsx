import { UniversalFilters } from "@/components/UniversalFilters";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Map, LayoutGrid, Rows3, GalleryHorizontal, AlignJustify } from 'lucide-react';
import { HomePageFilters } from "@/hooks/useHomePageFilters";
import { UnifiedItem } from "@/types/unifiedItem";
import { useTranslation } from "react-i18next";

interface FilterSectionProps {
  filters: HomePageFilters;
  allItems: UnifiedItem[];
  filteredItemsCount: number;
  onSearchChange: (value: string) => void;
  onTypeChange: (type: string) => void;
  onCategoryChange: (category: string) => void;
  onNeighborhoodChange: (neighborhood: string) => void;
  onVillageChange: (village: string) => void;
  onViewModeChange: (mode: HomePageFilters["viewMode"]) => void;
  onListDensityChange: (density: HomePageFilters["listDensity"]) => void;
  onListPresentationChange: (presentation: HomePageFilters["listPresentation"]) => void;
  onEventDateRangeChange: (range: any) => void;
  onSelectedEventDatesChange: (dates: Date[]) => void;
}

export const FilterSection = ({
  filters,
  allItems,
  filteredItemsCount,
  onSearchChange,
  onTypeChange,
  onCategoryChange,
  onNeighborhoodChange,
  onVillageChange,
  onViewModeChange,
  onListDensityChange,
  onListPresentationChange,
  onEventDateRangeChange,
  onSelectedEventDatesChange
}: FilterSectionProps) => {
  const { t } = useTranslation();
  return (
    <div className="mb-6 space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder="Search events, businesses, news, or local resources..."
          value={filters.searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 w-full"
        />
      </div>

      {/* Universal Filters */}
      <UniversalFilters
        allItems={allItems}
        searchTerm={filters.searchTerm}
        selectedType={filters.selectedType}
        selectedCategory={filters.selectedCategory}
        selectedNeighborhood={filters.selectedNeighborhood}
        selectedVillage={filters.selectedVillage}
        eventDateRange={filters.eventDateRange}
        selectedEventDates={filters.selectedEventDates}
        onTypeChange={onTypeChange}
        onCategoryChange={onCategoryChange}
        onNeighborhoodChange={onNeighborhoodChange}
        onVillageChange={onVillageChange}
        onEventDateRangeChange={onEventDateRangeChange}
        onSelectedEventDatesChange={onSelectedEventDatesChange}
        filteredItemsCount={filteredItemsCount}
        itemType="events"
      />

      {/* View mode: grid / list / map */}
      <div className="flex flex-col items-center gap-3">
        <div className="flex flex-wrap justify-center gap-2">
          <Button
            variant={filters.viewMode === "grid" ? "default" : "outline"}
            onClick={() => onViewModeChange("grid")}
            className="flex items-center gap-2"
          >
            <LayoutGrid className="h-4 w-4" />
            {t("listView.gridView", { defaultValue: "Grid" })}
          </Button>
          <Button
            variant={filters.viewMode === "list" ? "default" : "outline"}
            onClick={() => onViewModeChange("list")}
            className="flex items-center gap-2"
          >
            <Rows3 className="h-4 w-4" />
            {t("listView.listView", { defaultValue: "List" })}
          </Button>
          <Button
            variant={filters.viewMode === "map" ? "default" : "outline"}
            onClick={() => onViewModeChange("map")}
            className="flex items-center gap-2"
          >
            <Map className="h-4 w-4" />
            {t("listView.mapView", { defaultValue: "Map" })}
          </Button>
        </div>
        {filters.viewMode === "list" ? (
          <div className="flex w-full max-w-2xl flex-col items-stretch gap-2 sm:items-center">
            <div className="flex flex-wrap justify-center gap-2">
              <Button
                type="button"
                size="sm"
                variant={filters.listPresentation === "rows" ? "secondary" : "outline"}
                onClick={() => onListPresentationChange("rows")}
                className="gap-2"
              >
                <AlignJustify className="h-4 w-4" />
                {t("listView.listPresentationRows", { defaultValue: "Wide rows" })}
              </Button>
              <Button
                type="button"
                size="sm"
                variant={filters.listPresentation === "carousel" ? "secondary" : "outline"}
                onClick={() => onListPresentationChange("carousel")}
                className="gap-2"
              >
                <GalleryHorizontal className="h-4 w-4" />
                {t("listView.listPresentationCarousel", { defaultValue: "Horizontal cards" })}
              </Button>
            </div>
            {filters.listPresentation === "rows" ? (
              <div className="flex flex-wrap justify-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant={filters.listDensity === "comfortable" ? "secondary" : "outline"}
                  onClick={() => onListDensityChange("comfortable")}
                >
                  {t("listView.densityComfortable", { defaultValue: "Comfortable spacing" })}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={filters.listDensity === "compact" ? "secondary" : "outline"}
                  onClick={() => onListDensityChange("compact")}
                >
                  {t("listView.densityCompact", { defaultValue: "Compact spacing" })}
                </Button>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
};

import { useState, useEffect } from "react";
import { EnhancedUniversalMap } from "@/components/EnhancedUniversalMap";
import { UniversalFilters } from "@/components/UniversalFilters";
import BusinessCard from "@/components/BusinessCard";
import { useBusiness } from "@/hooks/useBusiness";
import { useBusinessSubmissions } from "@/hooks/useBusinessSubmissions";
import { useGeocoding } from "@/hooks/useGeocoding";
import { geocodeBusinesses } from "@/utils/geocodeBusinesses";
import { Business } from "@/types/business";
import { BusinessSubmission } from "@/types/submissions";
import { UnifiedItem } from "@/types/unifiedItem";
import { filterUnifiedItems } from "@/utils/filterUnifiedItems";
import { toast } from "sonner";

export const BusinessTab = () => {
  const { data: businesses, isLoading: businessLoading, refetch: refetchBusinesses } = useBusiness();
  const { data: businessSubmissions, isLoading: businessSubmissionsLoading } = useBusinessSubmissions();
  const { geocode, isReady } = useGeocoding();
  const [hasGeocodedBusinesses, setHasGeocodedBusinesses] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  
  // Filter states - matching the pattern used in other tabs
  const [selectedType, setSelectedType] = useState("business");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedNeighborhood, setSelectedNeighborhood] = useState("all");
  const [selectedVillage, setSelectedVillage] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  
  const allBusinesses: (Business | BusinessSubmission)[] = [
    ...(businesses || []),
    ...(businessSubmissions || [])
  ];

  // Convert businesses to UnifiedItem format for the map
  const unifiedBusinesses: UnifiedItem[] = allBusinesses.map((business) => {
    return {
      id: business.id,
      title: business.title,
      description: business.description || '',
      latitude: business.latitude || null,
      longitude: business.longitude || null,
      type: 'business' as const,
      address: business.address,
      category: business.business_type,
      business_type: business.business_type,
      neighborhoods: business.neighborhood,
      villages: 'villages' in business ? business.villages : undefined,
      originalData: business
    };
  });

  // Apply filtering
  const filteredBusinesses = filterUnifiedItems(unifiedBusinesses, {
    selectedTypes: [selectedType],
    selectedType,
    searchTerm,
    selectedCategory,
    selectedNeighborhood,
    selectedVillage,
    dateFilter: '',
    timeFilter: 'all'
  });

  const isBusinessLoading = businessLoading || businessSubmissionsLoading;

  // Debug log the businesses data
  useEffect(() => {
    if (businesses && businesses.length > 0) {
      console.log('🏢 BusinessTab: Loaded businesses:', {
        count: businesses.length,
        withCoords: businesses.filter(b => b.latitude && b.longitude && Number(b.latitude) !== 0 && Number(b.longitude) !== 0).length,
        withValidCoords: businesses.filter(b => {
          const lat = Number(b.latitude);
          const lng = Number(b.longitude);
          return !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0 && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
        }).length,
        samples: businesses.slice(0, 3).map(b => ({
          id: b.id,
          title: b.title,
          address: b.address,
          lat: b.latitude,
          lng: b.longitude,
          validCoords: !isNaN(Number(b.latitude)) && !isNaN(Number(b.longitude))
        }))
      });
    }

    if (unifiedBusinesses.length > 0) {
      console.log('🗺️ BusinessTab: Unified businesses for map:', {
        total: unifiedBusinesses.length,
        withCoords: unifiedBusinesses.filter(b => b.latitude && b.longitude).length,
        samples: unifiedBusinesses.slice(0, 3).map(b => ({
          id: b.id,
          title: b.title,
          lat: b.latitude,
          lng: b.longitude,
          type: b.type
        }))
      });
    }
  }, [businesses, unifiedBusinesses]);

  // Geocode businesses that need coordinates
  useEffect(() => {
    const geocodeBusinessesIfNeeded = async () => {
      if (!isReady || hasGeocodedBusinesses || isBusinessLoading || !businesses || businesses.length === 0 || isGeocoding) {
        return;
      }

      // Find businesses that need geocoding (have address but no coordinates)
      const businessesNeedingGeocode = businesses.filter(business => 
        business.address && 
        business.address.trim() !== '' &&
        (!business.latitude || !business.longitude || 
         business.latitude === null || business.longitude === null ||
         Number(business.latitude) === 0 || Number(business.longitude) === 0)
      );

      if (businessesNeedingGeocode.length > 0) {
        console.log(`🌍 Found ${businessesNeedingGeocode.length} businesses that need geocoding:`, 
          businessesNeedingGeocode.map(b => ({ title: b.title, address: b.address }))
        );
        
        setIsGeocoding(true);
        
        try {
          await geocodeBusinesses(businessesNeedingGeocode, geocode);
          toast.success(`Geocoded ${businessesNeedingGeocode.length} businesses!`);
          // Refetch businesses to get updated coordinates
          await refetchBusinesses();
          setHasGeocodedBusinesses(true);
        } catch (error) {
          console.error('Error geocoding businesses:', error);
          toast.error('Failed to geocode some businesses');
        } finally {
          setIsGeocoding(false);
        }
      } else {
        console.log('✅ All businesses already have coordinates');
        setHasGeocodedBusinesses(true);
      }
    };

    geocodeBusinessesIfNeeded();
  }, [businesses, isReady, geocode, hasGeocodedBusinesses, isBusinessLoading, isGeocoding, refetchBusinesses]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Local Businesses</h2>
      
      <UniversalFilters
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedNeighborhood={selectedNeighborhood}
        onNeighborhoodChange={setSelectedNeighborhood}
        selectedVillage={selectedVillage}
        onVillageChange={setSelectedVillage}
        filteredItemsCount={filteredBusinesses.length}
        itemType="businesses"
      />
      
      <EnhancedUniversalMap
        items={filteredBusinesses}
        height="400px"
        selectedTypes={['business']}
      />
      
      {isBusinessLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading businesses...</p>
        </div>
      ) : isGeocoding ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Adding locations to businesses...</p>
        </div>
      ) : filteredBusinesses && filteredBusinesses.length > 0 ? (
        <div>
          <div className="mb-4 text-sm text-gray-600">
            Showing {filteredBusinesses.length} businesses 
            {businesses && (
              <span> • {businesses.filter(b => {
                const lat = Number(b.latitude);
                const lng = Number(b.longitude);
                return !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0;
              }).length} with map locations</span>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBusinesses.map((business) => (
              <BusinessCard key={business.id} business={business.originalData} />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No businesses found matching your filters. Try adjusting your search criteria.
        </div>
      )}
    </div>
  );
};

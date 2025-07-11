
import { useState, useEffect } from "react";
import { SectionMap } from "@/components/SectionMap";
import { UniversalFilters } from "@/components/UniversalFilters";
import BusinessCard from "@/components/BusinessCard";
import { BusinessSubmissionCard } from "@/components/BusinessSubmissionCard";
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
  const { data: businessSubmissions, isLoading: businessSubmissionsLoading, refetch: refetchBusinessSubmissions } = useBusinessSubmissions();
  const { geocode, isReady } = useGeocoding();
  const [hasGeocodedBusinesses, setHasGeocodedBusinesses] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  
  // Filter states
  const [selectedType, setSelectedType] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedNeighborhood, setSelectedNeighborhood] = useState("all");
  const [selectedVillage, setSelectedVillage] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  
  const allBusinesses: (Business | BusinessSubmission)[] = [
    ...(businesses || []),
    ...(businessSubmissions || [])
  ];

  const isBusinessLoading = businessLoading || businessSubmissionsLoading;

  const isBusinessSubmission = (item: Business | BusinessSubmission): item is BusinessSubmission => {
    return 'status' in item;
  };

  const handleBusinessesUpdate = () => {
    refetchBusinesses();
    refetchBusinessSubmissions();
  };

  // Transform businesses to UnifiedItem format for map integration
  const unifiedBusinesses: UnifiedItem[] = allBusinesses.map(business => ({
    id: business.id,
    title: business.title,
    description: business.description,
    type: 'business' as const,
    latitude: business.latitude,
    longitude: business.longitude,
    address: business.address,
    location: business.address,
    date: business.created_at,
    category: business.business_type,
    neighborhoods: business.neighborhood,
    villages: business.villages ? (Array.isArray(business.villages) ? business.villages : JSON.parse(business.villages as string)) : null
  }));

  // Apply filters to the unified businesses
  const filteredBusinesses = filterUnifiedItems(unifiedBusinesses, {
    selectedTypes: selectedType === 'all' ? [] : [selectedType],
    selectedType: selectedType,
    searchTerm: searchTerm,
    selectedCategory: selectedCategory,
    selectedNeighborhood: selectedNeighborhood,
    selectedVillage: selectedVillage,
    dateFilter: '',
    timeFilter: 'all'
  });

  // Enhanced business data logging
  useEffect(() => {
    if (businesses && businesses.length > 0) {
      const businessesWithCoords = businesses.filter(b => 
        b.latitude !== null && b.longitude !== null && 
        !isNaN(Number(b.latitude)) && !isNaN(Number(b.longitude)) &&
        Number(b.latitude) !== 0 && Number(b.longitude) !== 0
      );
      
      const businessesNeedingGeocode = businesses.filter(b => 
        b.address && b.address.trim() !== '' && 
        (!b.latitude || !b.longitude || Number(b.latitude) === 0 || Number(b.longitude) === 0)
      );

      console.log('🏢 BusinessTab: Detailed business analysis:', {
        totalBusinesses: businesses.length,
        withValidCoordinates: businessesWithCoords.length,
        needingGeocode: businessesNeedingGeocode.length,
        geocodingReadiness: isReady ? 'Ready' : 'Not Ready',
        sampleBusinesses: businesses.slice(0, 3).map(b => ({
          id: b.id,
          title: b.title,
          address: b.address,
          coordinates: `${b.latitude}, ${b.longitude}`,
          needsGeocode: !b.latitude || !b.longitude || Number(b.latitude) === 0 || Number(b.longitude) === 0
        }))
      });
    }
  }, [businesses, isReady]);

  // Improved geocoding with better error handling
  useEffect(() => {
    const geocodeBusinessesIfNeeded = async () => {
      if (!isReady || hasGeocodedBusinesses || isBusinessLoading || !businesses || businesses.length === 0 || isGeocoding) {
        return;
      }

      // Find business that need geocoding
      const businessesNeedingGeocode = businesses.filter(business => 
        business.address && 
        business.address.trim() !== '' &&
        (!business.latitude || !business.longitude || 
         business.latitude === null || business.longitude === null ||
         Number(business.latitude) === 0 || Number(business.longitude) === 0)
      );

      if (businessesNeedingGeocode.length > 0) {
        console.log(`🌍 Starting geocoding for ${businessesNeedingGeocode.length} businesses:`, 
          businessesNeedingGeocode.map(b => ({ 
            id: b.id,
            title: b.title, 
            address: b.address,
            currentCoords: `${b.latitude}, ${b.longitude}`
          }))
        );
        
        setIsGeocoding(true);
        
        try {
          await geocodeBusinesses(businessesNeedingGeocode, geocode);
          console.log('✅ Geocoding completed successfully');
          toast.success(`Successfully geocoded ${businessesNeedingGeocode.length} businesses!`);
          
          // Refetch to get updated coordinates
          await refetchBusinesses();
          setHasGeocodedBusinesses(true);
        } catch (error) {
          console.error('❌ Geocoding failed:', error);
          toast.error('Failed to geocode some businesses. Please try again.');
        } finally {
          setIsGeocoding(false);
        }
      } else {
        console.log('✅ All businesses already have valid coordinates');
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
        itemType="business"
      />
      
      <SectionMap height="400px" />
      
      {isBusinessLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading business...</p>
        </div>
      ) : isGeocoding ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Adding locations to business...</p>
        </div>
      ) : filteredBusinesses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allBusinesses
            .filter(business => filteredBusinesses.some(filtered => filtered.id === business.id))
            .map((business) => (
              isBusinessSubmission(business) ? (
                <BusinessSubmissionCard key={business.id} submission={business} onUpdate={handleBusinessesUpdate} />
              ) : (
                <BusinessCard key={business.id} business={business} />
              )
            ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No businesses found. Try adjusting your filters or be the first to add one!
        </div>
      )}
    </div>
  );
};

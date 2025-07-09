
import { useState, useEffect } from "react";
import { SectionMap } from "@/components/SectionMap";
import { UniversalFilters } from "@/components/UniversalFilters";
import BusinessCard from "@/components/BusinessCard";
import { useBusiness } from "@/hooks/useBusiness";
import { useBusinessSubmissions } from "@/hooks/useBusinessSubmissions";
import { useGeocoding } from "@/hooks/useGeocoding";
import { geocodeBusinesses } from "@/utils/geocodeBusinesses";
import { Business } from "@/types/business";
import { BusinessSubmission } from "@/types/submissions";
import { toast } from "sonner";

export const BusinessTab = () => {
  const { data: businesses, isLoading: businessLoading, refetch: refetchBusinesses } = useBusiness();
  const { data: businessSubmissions, isLoading: businessSubmissionsLoading } = useBusinessSubmissions();
  const { geocode, isReady } = useGeocoding();
  const [hasGeocodedBusinesses, setHasGeocodedBusinesses] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  
  // Filter states
  const [selectedType, setSelectedType] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedNeighborhood, setSelectedNeighborhood] = useState("all");
  const [selectedVillage, setSelectedVillage] = useState("all");
  
  const allBusinesses: (Business | BusinessSubmission)[] = [
    ...(businesses || []),
    ...(businessSubmissions || [])
  ];

  const isBusinessLoading = businessLoading || businessSubmissionsLoading;

  // Debug log the businesses data
  useEffect(() => {
    if (businesses && businesses.length > 0) {
      console.log('🏢 BusinessTab: Loaded businesses:', {
        count: businesses.length,
        samples: businesses.slice(0, 2).map(b => ({
          id: b.id,
          title: b.title,
          address: b.address,
          lat: b.latitude,
          lng: b.longitude
        }))
      });
    }
  }, [businesses]);

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
        filteredItemsCount={allBusinesses.length}
        itemType="businesses"
      />
      
      <SectionMap height="400px" />
      
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
      ) : allBusinesses && allBusinesses.length > 0 ? (
        <div>
          <div className="mb-4 text-sm text-gray-600">
            Showing {allBusinesses.length} businesses 
            {businesses && (
              <span> • {businesses.filter(b => b.latitude && b.longitude && Number(b.latitude) !== 0 && Number(b.longitude) !== 0).length} with map locations</span>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allBusinesses.map((business) => (
              <BusinessCard key={business.id} business={business} />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No businesses found. Be the first to add one!
        </div>
      )}
    </div>
  );
};


import { useState, useEffect } from "react";
import { SectionMap } from "@/components/SectionMap";
import BusinessCard from "@/components/BusinessCard";
import { useBusiness } from "@/hooks/useBusiness";
import { useBusinessSubmissions } from "@/hooks/useBusinessSubmissions";
import { useGeocoding } from "@/hooks/useGeocoding";
import { geocodeBusinesses } from "@/utils/geocodeBusinesses";
import { Business } from "@/types/business";
import { BusinessSubmission } from "@/types/submissions";

export const BusinessTab = () => {
  const { data: businesses, isLoading: businessLoading } = useBusiness();
  const { data: businessSubmissions, isLoading: businessSubmissionsLoading } = useBusinessSubmissions();
  const { geocode, isReady } = useGeocoding();
  const [hasGeocodedBusinesses, setHasGeocodedBusinesses] = useState(false);
  
  const allBusinesses: (Business | BusinessSubmission)[] = [
    ...(businesses || []),
    ...(businessSubmissions || [])
  ];

  const isBusinessLoading = businessLoading || businessSubmissionsLoading;

  // Only geocode if we have businesses without coordinates and geocoding is ready
  useEffect(() => {
    const geocodeBusinessesIfNeeded = async () => {
      if (!isReady || hasGeocodedBusinesses || isBusinessLoading || !businesses || businesses.length === 0) {
        return;
      }

      // Only geocode items that actually need geocoding (have address but no coordinates)
      const businessesNeedingGeocode = businesses.filter(business => 
        business.address && 
        business.address.trim() !== '' &&
        (!business.latitude || !business.longitude || 
         business.latitude === null || business.longitude === null)
      );

      if (businessesNeedingGeocode.length > 0) {
        console.log(`Found ${businessesNeedingGeocode.length} businesses that need geocoding`);
        try {
          await geocodeBusinesses(businessesNeedingGeocode, geocode);
          setHasGeocodedBusinesses(true);
        } catch (error) {
          console.error('Error geocoding businesses:', error);
        }
      } else {
        setHasGeocodedBusinesses(true); // No items need geocoding
      }
    };

    geocodeBusinessesIfNeeded();
  }, [businesses, isReady, geocode, hasGeocodedBusinesses, isBusinessLoading]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Local Businesses</h2>
      
      <SectionMap height="400px" />
      
      {isBusinessLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading businesses...</p>
        </div>
      ) : allBusinesses && allBusinesses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allBusinesses.map((business) => (
            <BusinessCard key={business.id} business={business} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No businesses found. Be the first to add one!
        </div>
      )}
    </div>
  );
};

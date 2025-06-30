
import { useState, useEffect } from "react";
import { SectionMap } from "@/components/SectionMap";
import LocalServiceCard from "@/components/LocalServiceCard";
import LocalServiceSubmissionCard from "@/components/LocalServiceSubmissionCard";
import { useLocalServices } from "@/hooks/useLocalServices";
import { useLocalServiceSubmissions } from "@/hooks/useLocalServiceSubmissions";
import { useGeocoding } from "@/hooks/useGeocoding";
import { geocodeLocalServices } from "@/utils/geocodeLocalServices";
import { LocalService, LocalServiceSubmission } from "@/types/localServices";

export const LocalServicesTab = () => {
  const { data: localServices, isLoading: localServicesLoading, refetch: refetchLocalServices } = useLocalServices();
  const { data: localServiceSubmissions, isLoading: localServiceSubmissionsLoading, refetch: refetchLocalServiceSubmissions } = useLocalServiceSubmissions();
  const { geocode, isReady } = useGeocoding();
  const [hasGeocodedServices, setHasGeocodedServices] = useState(false);
  
  const allLocalServices: (LocalService | LocalServiceSubmission)[] = [
    ...(localServices || []),
    ...(localServiceSubmissions || [])
  ];

  const isLocalServicesLoading = localServicesLoading || localServiceSubmissionsLoading;

  const isLocalServiceSubmission = (item: LocalService | LocalServiceSubmission): item is LocalServiceSubmission => {
    return 'status' in item;
  };

  const handleLocalServicesUpdate = () => {
    refetchLocalServices();
    refetchLocalServiceSubmissions();
  };

  // Automatically geocode local services that don't have coordinates
  useEffect(() => {
    const geocodeServicesIfNeeded = async () => {
      if (!isReady || hasGeocodedServices || isLocalServicesLoading || !localServices || localServices.length === 0) {
        return;
      }

      const servicesNeedingGeocode = localServices.filter(service => 
        (!service.latitude || !service.longitude) && service.address
      );

      if (servicesNeedingGeocode.length > 0) {
        console.log(`Found ${servicesNeedingGeocode.length} local services that need geocoding`);
        try {
          await geocodeLocalServices(servicesNeedingGeocode, geocode);
          setHasGeocodedServices(true);
        } catch (error) {
          console.error('Error geocoding local services:', error);
        }
      }
    };

    geocodeServicesIfNeeded();
  }, [localServices, isReady, geocode, hasGeocodedServices, isLocalServicesLoading]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Local Services & Nonprofits</h2>
      
      <SectionMap height="400px" />
      
      {isLocalServicesLoading ? (
        <div className="text-center py-8">Loading local services...</div>
      ) : allLocalServices && allLocalServices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allLocalServices.map((service) => (
            isLocalServiceSubmission(service) ? (
              <LocalServiceSubmissionCard key={service.id} submission={service} onUpdate={handleLocalServicesUpdate} />
            ) : (
              <LocalServiceCard key={service.id} localService={service} />
            )
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No local services found. Be the first to add one!
        </div>
      )}
    </div>
  );
};

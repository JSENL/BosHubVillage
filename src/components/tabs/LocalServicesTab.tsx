
import { useState, useEffect } from "react";
import { SectionMap } from "@/components/SectionMap";
import { UniversalFilters } from "@/components/UniversalFilters";
import LocalServiceCard from "@/components/LocalServiceCard";
import LocalServiceSubmissionCard from "@/components/LocalServiceSubmissionCard";
import { useLocalServices } from "@/hooks/useLocalServices";
import { useLocalServiceSubmissions } from "@/hooks/useLocalServiceSubmissions";
import { useGeocoding } from "@/hooks/useGeocoding";
import { geocodeLocalServices } from "@/utils/geocodeLocalServices";
import { LocalResource, LocalResourceSubmission } from "@/types/localServices";

export const LocalServicesTab = () => {
  const { data: localResources, isLoading: localResourcesLoading, refetch: refetchLocalResources } = useLocalServices();
  const { data: localResourceSubmissions, isLoading: localResourceSubmissionsLoading, refetch: refetchLocalResourceSubmissions } = useLocalServiceSubmissions();
  const { geocode, isReady } = useGeocoding();
  const [hasGeocodedResources, setHasGeocodedResources] = useState(false);
  
  // Filter states
  const [selectedType, setSelectedType] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedNeighborhood, setSelectedNeighborhood] = useState("all");
  const [selectedVillage, setSelectedVillage] = useState("all");
  
  // Only include approved submissions that haven't been moved to main table
  const approvedSubmissions = (localResourceSubmissions || []).filter(submission => 
    submission.status === 'approved'
  );
  
  // Create a Set of existing resource names/addresses to avoid duplicates
  const existingResources = new Set(
    (localResources || []).map(resource => `${resource.name}-${resource.address}`)
  );
  
  // Filter out submissions that already exist in the main resources table
  const uniqueSubmissions = approvedSubmissions.filter(submission => 
    !existingResources.has(`${submission.name}-${submission.address}`)
  );
  
  const allLocalResources: (LocalResource | LocalResourceSubmission)[] = [
    ...(localResources || []),
    ...uniqueSubmissions
  ];

  const isLocalResourcesLoading = localResourcesLoading || localResourceSubmissionsLoading;

  const isLocalResourceSubmission = (item: LocalResource | LocalResourceSubmission): item is LocalResourceSubmission => {
    return 'status' in item;
  };

  const handleLocalResourcesUpdate = () => {
    refetchLocalResources();
    refetchLocalResourceSubmissions();
  };

  // Automatically geocode local resources that don't have coordinates
  useEffect(() => {
    const geocodeResourcesIfNeeded = async () => {
      if (!isReady || hasGeocodedResources || isLocalResourcesLoading || !localResources || localResources.length === 0) {
        return;
      }

      const resourcesNeedingGeocode = localResources.filter(resource => 
        (!resource.latitude || !resource.longitude) && resource.address
      );

      if (resourcesNeedingGeocode.length > 0) {
        console.log(`Found ${resourcesNeedingGeocode.length} local resources that need geocoding`);
        try {
          await geocodeLocalServices(resourcesNeedingGeocode, geocode);
          setHasGeocodedResources(true);
        } catch (error) {
          console.error('Error geocoding local resources:', error);
        }
      }
    };

    geocodeResourcesIfNeeded();
  }, [localResources, isReady, geocode, hasGeocodedResources, isLocalResourcesLoading]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Local Resources</h2>
      
      <UniversalFilters
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedNeighborhood={selectedNeighborhood}
        onNeighborhoodChange={setSelectedNeighborhood}
        selectedVillage={selectedVillage}
        onVillageChange={setSelectedVillage}
        filteredItemsCount={allLocalResources.length}
        itemType="local-services"
      />
      
      <SectionMap height="400px" />
      
      {isLocalResourcesLoading ? (
        <div className="text-center py-8">Loading local resources...</div>
      ) : allLocalResources && allLocalResources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allLocalResources.map((resource) => (
            isLocalResourceSubmission(resource) ? (
              <LocalServiceSubmissionCard key={resource.id} submission={resource} onUpdate={handleLocalResourcesUpdate} />
            ) : (
              <LocalServiceCard key={resource.id} localService={resource} />
            )
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No local resources found. Be the first to add one!
        </div>
      )}
    </div>
  );
};

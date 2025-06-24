
import { SectionMap } from "@/components/SectionMap";
import BusinessCard from "@/components/BusinessCard";
import { useBusiness } from "@/hooks/useBusiness";
import { useBusinessSubmissions } from "@/hooks/useBusinessSubmissions";
import { Business } from "@/types/business";
import { BusinessSubmission } from "@/types/submissions";

export const BusinessTab = () => {
  const { data: businesses, isLoading: businessLoading } = useBusiness();
  const { data: businessSubmissions, isLoading: businessSubmissionsLoading } = useBusinessSubmissions();
  
  const allBusinesses: (Business | BusinessSubmission)[] = [
    ...(businesses || []),
    ...(businessSubmissions || [])
  ];

  const isBusinessLoading = businessLoading || businessSubmissionsLoading;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Local Businesses</h2>
      
      <SectionMap height="400px" />
      
      {isBusinessLoading ? (
        <div className="text-center py-8">Loading businesses...</div>
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

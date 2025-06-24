
import { SectionMap } from "@/components/SectionMap";
import LocalServiceCard from "@/components/LocalServiceCard";
import LocalServiceSubmissionCard from "@/components/LocalServiceSubmissionCard";
import { useLocalServices } from "@/hooks/useLocalServices";
import { useLocalServiceSubmissions } from "@/hooks/useLocalServiceSubmissions";
import { LocalService, LocalServiceSubmission } from "@/types/localServices";

export const LocalServicesTab = () => {
  const { data: localServices, isLoading: localServicesLoading, refetch: refetchLocalServices } = useLocalServices();
  const { data: localServiceSubmissions, isLoading: localServiceSubmissionsLoading, refetch: refetchLocalServiceSubmissions } = useLocalServiceSubmissions();
  
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

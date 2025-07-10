
import { Building } from 'lucide-react';

export const BusinessEmptyState = () => {
  return (
    <div className="text-center p-8">
      <Building className="h-16 w-16 mx-auto mb-4 text-gray-300" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">No Published Business</h3>
      <p className="text-gray-600">Published business will appear here.</p>
    </div>
  );
};

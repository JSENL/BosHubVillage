
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdminSubmissions } from '@/hooks/useAdminSubmissions';
import { SubmissionsOverviewCards } from '@/components/admin/SubmissionsOverviewCards';
import { SubmissionsTabs } from '@/components/admin/SubmissionsTabs';
import { 
  CheckCircle, 
  Clock,
  AlertCircle
} from 'lucide-react';

const AdminSubmissionsPanel = () => {
  const { isAdmin } = useAuth();
  const {
    newsSubmissions,
    eventSubmissions,
    localResourceSubmissions,
    loading,
    error,
    fetchAllSubmissions
  } = useAdminSubmissions();

  if (!isAdmin) {
    return null;
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Clock className="h-8 w-8 animate-spin mx-auto mb-4 text-purple-600" />
          <p>Loading submissions...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <AlertCircle className="h-8 w-8 mx-auto mb-4 text-red-500" />
          <h3 className="text-lg font-semibold text-red-700 mb-2">Error Loading Submissions</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={fetchAllSubmissions}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
          >
            Retry
          </button>
        </CardContent>
      </Card>
    );
  }

  const totalPendingSubmissions = newsSubmissions.length + eventSubmissions.length + localResourceSubmissions.length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-gray-900">
            <CheckCircle className="h-5 w-5 mr-2 text-purple-600" />
            Pending Submissions Overview ({totalPendingSubmissions} total)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SubmissionsOverviewCards
            newsSubmissions={newsSubmissions}
            eventSubmissions={eventSubmissions}
            localResourceSubmissions={localResourceSubmissions}
          />

          {totalPendingSubmissions > 0 && (
            <SubmissionsTabs
              newsSubmissions={newsSubmissions}
              eventSubmissions={eventSubmissions}
              localResourceSubmissions={localResourceSubmissions}
              onUpdate={fetchAllSubmissions}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSubmissionsPanel;

import { useBusinessSubmissions } from '@/hooks/useBusinessSubmissions';
import { useBusiness } from '@/hooks/useBusiness';
import { Card, CardContent } from '@/components/ui/card';
import { Clock } from 'lucide-react';
import { BusinessSubmissionCard } from '@/components/BusinessSubmissionCard';
import { PublishedBusinessTable } from '@/components/admin/PublishedBusinessTable';

const AdminBusinessApproval = () => {
  const { submissions, loading } = useBusinessSubmissions();
  const { data: businesses, refetch: fetchBusinesses } = useBusiness();

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Clock className="h-8 w-8 animate-spin mx-auto mb-4 text-purple-600" />
          <p>Loading business submissions...</p>
        </CardContent>
      </Card>
    );
  }

  const pendingSubmissions = submissions.filter(sub => sub.status === 'pending');
  const recentlyReviewed = submissions.filter(sub => sub.status !== 'pending');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Business Management</h2>
      </div>
      
      {/* Pending Business Submissions */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold mb-4">
            Pending Business Submissions ({pendingSubmissions.length})
          </h3>
          {pendingSubmissions.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No pending business submissions
            </p>
          ) : (
            <div className="space-y-4">
              {pendingSubmissions.map((submission) => (
                <BusinessSubmissionCard
                  key={submission.id}
                  submission={submission}
                  onUpdate={() => fetchBusinesses()}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Published Businesses Table */}
      {businesses && (
        <PublishedBusinessTable 
          businesses={businesses}
          onUpdate={() => fetchBusinesses()}
        />
      )}

      {/* Recently Reviewed Submissions */}
      {recentlyReviewed.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4">
              Recently Reviewed ({recentlyReviewed.length})
            </h3>
            <div className="space-y-4">
              {recentlyReviewed.slice(0, 5).map((submission) => (
                <BusinessSubmissionCard
                  key={submission.id}
                  submission={submission}
                  onUpdate={() => fetchBusinesses()}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminBusinessApproval;
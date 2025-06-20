
import { useEventSubmissions } from '@/hooks/useEventSubmissions';
import { useEvents } from '@/hooks/useEvents';
import { Card, CardContent } from '@/components/ui/card';
import { Clock } from 'lucide-react';
import { PendingEventSubmissions } from '@/components/admin/PendingEventSubmissions';
import { PublishedEventsTable } from '@/components/admin/PublishedEventsTable';
import { RecentlyReviewedSubmissions } from '@/components/admin/RecentlyReviewedSubmissions';

const AdminEventApproval = () => {
  const { submissions, loading } = useEventSubmissions();
  const { events, fetchEvents } = useEvents();

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

  return (
    <div className="space-y-6">
      <PendingEventSubmissions 
        submissions={submissions} 
        onUpdate={() => window.location.reload()} 
      />
      <PublishedEventsTable 
        events={events} 
        onUpdate={fetchEvents} 
      />
      <RecentlyReviewedSubmissions 
        submissions={submissions} 
        onUpdate={() => window.location.reload()} 
      />
    </div>
  );
};

export default AdminEventApproval;

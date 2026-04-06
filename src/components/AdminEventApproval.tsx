
import { useEventSubmissions } from '@/hooks/useEventSubmissions';
import { useEvents } from '@/hooks/useEvents';
import { Card, CardContent } from '@/components/ui/card';
import { Clock } from 'lucide-react';
import { PendingEventSubmissions } from '@/components/admin/PendingEventSubmissions';
import { PublishedEventsTable } from '@/components/admin/PublishedEventsTable';
import { RecentlyReviewedSubmissions } from '@/components/admin/RecentlyReviewedSubmissions';
import { GeocodeAllEventsButton } from '@/components/GeocodeAllEventsButton';

const AdminEventApproval = () => {
  const { submissions, loading, fetchSubmissions } = useEventSubmissions();
  const { events, fetchEvents } = useEvents();

  const handleListsUpdated = () => {
    void fetchSubmissions();
    void fetchEvents();
  };

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
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Event Management</h2>
        <GeocodeAllEventsButton />
      </div>
      
      <PendingEventSubmissions 
        submissions={submissions} 
        onUpdate={handleListsUpdated} 
      />
      <PublishedEventsTable 
        events={events} 
        onUpdate={fetchEvents} 
      />
      <RecentlyReviewedSubmissions 
        submissions={submissions} 
        onUpdate={handleListsUpdated} 
      />
    </div>
  );
};

export default AdminEventApproval;

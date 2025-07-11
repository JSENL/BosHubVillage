
import { 
  CheckCircle, 
  Clock,
  Building,
  Newspaper,
  Calendar,
  Heart
} from 'lucide-react';
import { NewsSubmission } from '@/types/submissions';
import { EventSubmission } from '@/hooks/useEventSubmissions';
import { LocalResourceSubmission } from '@/types/localServices';

interface SubmissionsOverviewCardsProps {
  newsSubmissions: NewsSubmission[];
  eventSubmissions: EventSubmission[];
  localResourceSubmissions: LocalResourceSubmission[];
}

export const SubmissionsOverviewCards = ({
  newsSubmissions, 
  eventSubmissions,
  localResourceSubmissions
}: SubmissionsOverviewCardsProps) => {
  const totalPendingSubmissions = newsSubmissions.length + eventSubmissions.length + localResourceSubmissions.length;

  if (totalPendingSubmissions === 0) {
    return (
      <div className="text-center p-8">
        <CheckCircle className="h-16 w-16 mx-auto mb-4 text-gray-300" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">All Caught Up!</h3>
        <p className="text-gray-600">No pending submissions to review.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex items-center">
          <Calendar className="h-8 w-8 text-blue-600 mr-3" />
          <div>
            <p className="text-2xl font-bold text-blue-600">{eventSubmissions.length}</p>
            <p className="text-sm text-gray-600">Event Submissions</p>
          </div>
        </div>
      </div>
      <div className="bg-orange-50 p-4 rounded-lg">
        <div className="flex items-center">
          <Newspaper className="h-8 w-8 text-orange-600 mr-3" />
          <div>
            <p className="text-2xl font-bold text-orange-600">{newsSubmissions.length}</p>
            <p className="text-sm text-gray-600">News Submissions</p>
          </div>
        </div>
      </div>
      <div className="bg-purple-50 p-4 rounded-lg">
        <div className="flex items-center">
          <Heart className="h-8 w-8 text-purple-600 mr-3" />
          <div>
            <p className="text-2xl font-bold text-purple-600">{localResourceSubmissions.length}</p>
            <p className="text-sm text-gray-600">Local Resource Submissions</p>
          </div>
        </div>
      </div>
    </div>
  );
};

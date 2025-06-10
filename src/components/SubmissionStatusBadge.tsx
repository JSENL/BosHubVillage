
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, XCircle } from 'lucide-react';

interface SubmissionStatusBadgeProps {
  status: 'pending' | 'approved' | 'rejected';
}

export const SubmissionStatusBadge = ({ status }: SubmissionStatusBadgeProps) => {
  switch (status) {
    case 'pending':
      return (
        <Badge variant="outline" className="text-yelp-orange border-yelp-orange">
          <Clock className="h-3 w-3 mr-1" />
          Pending
        </Badge>
      );
    case 'approved':
      return (
        <Badge variant="outline" className="text-green-600 border-green-600">
          <CheckCircle className="h-3 w-3 mr-1" />
          Approved
        </Badge>
      );
    case 'rejected':
      return (
        <Badge variant="outline" className="text-yelp-red border-yelp-red">
          <XCircle className="h-3 w-3 mr-1" />
          Rejected
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

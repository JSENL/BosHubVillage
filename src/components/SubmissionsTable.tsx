
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Calendar, MapPin } from 'lucide-react';
import { EventSubmission } from '@/hooks/useEventSubmissions';
import { SubmissionStatusBadge } from './SubmissionStatusBadge';

interface SubmissionsTableProps {
  submissions: EventSubmission[];
}

export const SubmissionsTable = ({ submissions }: SubmissionsTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Event</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Submitted</TableHead>
          <TableHead>Notes</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {submissions.map((submission) => (
          <TableRow key={submission.id}>
            <TableCell>
              <div>
                <div className="font-medium">{submission.title}</div>
                <div className="text-sm text-gray-500 flex items-center mt-1">
                  <MapPin className="h-3 w-3 mr-1" />
                  {submission.location}
                </div>
              </div>
            </TableCell>
            <TableCell>
              <SubmissionStatusBadge status={submission.status} />
            </TableCell>
            <TableCell>
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-1" />
                {new Date(submission.date).toLocaleDateString()}
              </div>
            </TableCell>
            <TableCell>
              {new Date(submission.created_at).toLocaleDateString()}
            </TableCell>
            <TableCell>
              <div className="max-w-xs truncate text-sm text-gray-600">
                {submission.admin_notes || '-'}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

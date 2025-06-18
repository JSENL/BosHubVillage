
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, ExternalLink } from 'lucide-react';
import { NewsSubmission } from '@/types/submissions';
import { format } from 'date-fns';

interface NewsSubmissionCardProps {
  submission: NewsSubmission;
}

const NewsSubmissionCard = ({ submission }: NewsSubmissionCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg font-semibold line-clamp-2">
          {submission.title}
        </CardTitle>
        <div className="flex flex-wrap gap-2 text-xs text-gray-600">
          <div className="flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            {format(new Date(submission.date_posted), 'MMM d, yyyy')}
          </div>
          <div className="flex items-center">
            <MapPin className="h-3 w-3 mr-1" />
            {submission.location}
          </div>
          <div className="flex items-center">
            <ExternalLink className="h-3 w-3 mr-1" />
            {submission.source}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 line-clamp-3">
          {submission.content}
        </p>
        <Badge variant="outline" className="mt-2 text-xs">
          Pending Approval
        </Badge>
      </CardContent>
    </Card>
  );
};

export default NewsSubmissionCard;

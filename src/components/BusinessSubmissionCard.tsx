
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Building } from 'lucide-react';
import { BusinessSubmission } from '@/types/submissions';

interface BusinessSubmissionCardProps {
  submission: BusinessSubmission;
}

const BusinessSubmissionCard = ({ submission }: BusinessSubmissionCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold line-clamp-2">
            {submission.title}
          </CardTitle>
          <Badge variant="secondary" className="ml-2">
            <Building className="h-3 w-3 mr-1" />
            {submission.business_type}
          </Badge>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <MapPin className="h-4 w-4 mr-1" />
          {submission.address}, {submission.neighborhood}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 line-clamp-3">
          {submission.short_description || submission.description}
        </p>
        <Badge variant="outline" className="mt-2 text-xs">
          Pending Approval
        </Badge>
      </CardContent>
    </Card>
  );
};

export default BusinessSubmissionCard;

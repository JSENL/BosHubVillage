
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Building, Check, X, Clock } from 'lucide-react';
import { LocalServiceSubmission } from '@/types/localServices';
import { SubmissionStatusBadge } from '@/components/SubmissionStatusBadge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

interface LocalServiceSubmissionCardProps {
  submission: LocalServiceSubmission;
  onUpdate: () => void;
}

const LocalServiceSubmissionCard = ({ submission, onUpdate }: LocalServiceSubmissionCardProps) => {
  const { isAdmin, user } = useAuth();

  const handleApprove = async () => {
    try {
      // First, insert into the main local_services_nonprofits table
      const { error: insertError } = await supabase
        .from('local_services_nonprofits')
        .insert({
          name: submission.name,
          category: submission.category,
          address: submission.address,
          neighborhood: submission.neighborhood,
          village: submission.village,
          description: submission.description,
          latitude: submission.latitude,
          longitude: submission.longitude,
        });

      if (insertError) throw insertError;

      // Then update the submission status
      const { error: updateError } = await supabase
        .from('local_services_nonprofits_submissions')
        .update({
          status: 'approved',
          reviewed_by: user?.id,
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', submission.id);

      if (updateError) throw updateError;

      toast.success('Local service approved successfully!');
      onUpdate();
    } catch (error: any) {
      console.error('Error approving local service:', error);
      toast.error('Failed to approve local service: ' + error.message);
    }
  };

  const handleReject = async () => {
    try {
      const { error } = await supabase
        .from('local_services_nonprofits_submissions')
        .update({
          status: 'rejected',
          reviewed_by: user?.id,
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', submission.id);

      if (error) throw error;

      toast.success('Local service rejected successfully!');
      onUpdate();
    } catch (error: any) {
      console.error('Error rejecting local service:', error);
      toast.error('Failed to reject local service: ' + error.message);
    }
  };

  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2">
            {submission.name}
          </CardTitle>
          <div className="flex flex-col items-end space-y-2">
            <Badge variant="secondary" className="flex-shrink-0">
              <Building className="h-3 w-3 mr-1" />
              {submission.category}
            </Badge>
            <SubmissionStatusBadge status={submission.status} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-start text-gray-600">
          <MapPin className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <p>{submission.address}</p>
            <p className="text-xs text-gray-500">
              {submission.neighborhood}
              {submission.village && `, ${submission.village}`}
            </p>
          </div>
        </div>
        
        {submission.description && (
          <p className="text-sm text-gray-600 line-clamp-3">
            {submission.description}
          </p>
        )}
        
        <div className="pt-2 border-t">
          <p className="text-xs text-gray-500">
            Submitted {new Date(submission.created_at).toLocaleDateString()}
          </p>
        </div>

        {isAdmin && submission.status === 'pending' && (
          <div className="flex space-x-2 pt-3 border-t">
            <Button
              onClick={handleApprove}
              size="sm"
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              <Check className="h-4 w-4 mr-1" />
              Approve
            </Button>
            <Button
              onClick={handleReject}
              size="sm"
              variant="destructive"
              className="flex-1"
            >
              <X className="h-4 w-4 mr-1" />
              Reject
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LocalServiceSubmissionCard;

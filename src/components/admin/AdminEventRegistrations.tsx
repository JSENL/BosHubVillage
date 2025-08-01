import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { User, Mail, Phone, MessageSquare, CheckCircle, XCircle, Clock, Send } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface EventRegistration {
  id: string;
  event_id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  user_phone?: string;
  additional_info?: string;
  status: string;
  reviewed_by?: string;
  reviewed_at?: string;
  admin_notes?: string;
  created_at: string;
  updated_at: string;
  events?: {
    title: string;
    date: string;
    location: string;
  };
}

export const AdminEventRegistrations = () => {
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const { data, error } = await supabase
        .from('event_registrations')
        .select(`
          *,
          events (
            title,
            date,
            location
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching registrations:', error);
        toast.error('Failed to load registrations');
        return;
      }

      setRegistrations((data as any) || []);
    } catch (error) {
      console.error('Error fetching registrations:', error);
      toast.error('Failed to load registrations');
    } finally {
      setLoading(false);
    }
  };

  const updateRegistrationStatus = async (
    registrationId: string, 
    status: 'approved' | 'rejected',
    adminNotes?: string
  ) => {
    setProcessingId(registrationId);
    
    try {
      const { error } = await supabase
        .from('event_registrations')
        .update({
          status,
          admin_notes: adminNotes,
          reviewed_at: new Date().toISOString(),
          reviewed_by: (await supabase.auth.getUser()).data.user?.id
        })
        .eq('id', registrationId);

      if (error) {
        console.error('Error updating registration:', error);
        toast.error('Failed to update registration');
        return;
      }

      toast.success(`Registration ${status} successfully`);
      await fetchRegistrations();
    } catch (error) {
      console.error('Error updating registration:', error);
      toast.error('Failed to update registration');
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-700">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-700">Rejected</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-700">Pending</Badge>;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="flex items-center justify-center">
            <Clock className="h-6 w-6 animate-spin mr-2" />
            Loading registrations...
          </div>
        </CardContent>
      </Card>
    );
  }

  const pendingRegistrations = registrations.filter(r => r.status === 'pending');
  const reviewedRegistrations = registrations.filter(r => r.status !== 'pending');

  return (
    <div className="space-y-6">
      {/* Pending Registrations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-purple-700">
            <Clock className="h-5 w-5 mr-2" />
            Pending Registrations ({pendingRegistrations.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pendingRegistrations.length === 0 ? (
            <div className="text-center p-8">
              <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-500" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">All Caught Up!</h3>
              <p className="text-gray-600">No pending registrations to review.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingRegistrations.map((registration) => (
                <RegistrationCard
                  key={registration.id}
                  registration={registration}
                  onUpdateStatus={updateRegistrationStatus}
                  isProcessing={processingId === registration.id}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reviewed Registrations */}
      {reviewedRegistrations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-gray-700">
              <CheckCircle className="h-5 w-5 mr-2" />
              Reviewed Registrations ({reviewedRegistrations.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reviewedRegistrations.map((registration) => (
                <RegistrationCard
                  key={registration.id}
                  registration={registration}
                  onUpdateStatus={updateRegistrationStatus}
                  isProcessing={processingId === registration.id}
                  readonly
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

interface RegistrationCardProps {
  registration: EventRegistration;
  onUpdateStatus: (id: string, status: 'approved' | 'rejected', notes?: string) => void;
  isProcessing: boolean;
  readonly?: boolean;
}

const RegistrationCard: React.FC<RegistrationCardProps> = ({
  registration,
  onUpdateStatus,
  isProcessing,
  readonly = false
}) => {
  const [adminNotes, setAdminNotes] = useState(registration.admin_notes || '');
  const [showNotes, setShowNotes] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-700">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-700">Rejected</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-700">Pending</Badge>;
    }
  };

  const handleApprove = () => {
    onUpdateStatus(registration.id, 'approved', adminNotes);
  };

  const handleReject = () => {
    if (!adminNotes.trim()) {
      toast.error('Please provide admin notes when rejecting a registration');
      setShowNotes(true);
      return;
    }
    onUpdateStatus(registration.id, 'rejected', adminNotes);
  };

  return (
    <Card className="border-l-4 border-l-purple-400">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              {registration.events?.title || 'Event Not Found'}
            </h3>
            <p className="text-sm text-gray-600">
              {registration.events?.date} • {registration.events?.location}
            </p>
          </div>
          {getStatusBadge(registration.status)}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="flex items-center">
            <User className="h-4 w-4 mr-2 text-purple-500" />
            <span>{registration.user_name}</span>
          </div>
          <div className="flex items-center">
            <Mail className="h-4 w-4 mr-2 text-purple-500" />
            <span>{registration.user_email}</span>
          </div>
          {registration.user_phone && (
            <div className="flex items-center">
              <Phone className="h-4 w-4 mr-2 text-purple-500" />
              <span>{registration.user_phone}</span>
            </div>
          )}
        </div>

        {registration.additional_info && (
          <div className="mb-4">
            <Label className="text-sm font-medium text-gray-700 flex items-center mb-2">
              <MessageSquare className="h-4 w-4 mr-1" />
              Additional Information
            </Label>
            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
              {registration.additional_info}
            </p>
          </div>
        )}

        {!readonly && registration.status === 'pending' && (
          <div className="space-y-4">
            <div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowNotes(!showNotes)}
                className="mb-2"
              >
                {showNotes ? 'Hide' : 'Add'} Admin Notes
              </Button>
              
              {showNotes && (
                <div>
                  <Label htmlFor="admin-notes" className="text-sm font-medium text-gray-700">
                    Admin Notes
                  </Label>
                  <Textarea
                    id="admin-notes"
                    placeholder="Add notes about this registration..."
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    className="mt-1"
                    rows={3}
                  />
                </div>
              )}
            </div>

            <div className="flex space-x-3">
              <Button
                onClick={handleApprove}
                disabled={isProcessing}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {isProcessing ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve
                  </>
                )}
              </Button>
              <Button
                onClick={handleReject}
                disabled={isProcessing}
                variant="destructive"
              >
                {isProcessing ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {registration.admin_notes && readonly && (
          <div className="mt-4">
            <Label className="text-sm font-medium text-gray-700 flex items-center mb-2">
              <MessageSquare className="h-4 w-4 mr-1" />
              Admin Notes
            </Label>
            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
              {registration.admin_notes}
            </p>
          </div>
        )}

        <div className="text-xs text-gray-500 mt-4">
          Submitted: {new Date(registration.created_at).toLocaleString()}
          {registration.reviewed_at && (
            <span> • Reviewed: {new Date(registration.reviewed_at).toLocaleString()}</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
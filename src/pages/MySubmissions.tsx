import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Navigation } from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, CheckCircle, XCircle, MessageSquare, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface UserSubmission {
  id: string;
  title: string;
  status: 'pending' | 'approved' | 'rejected';
  admin_notes?: string;
  created_at: string;
  reviewed_at?: string;
  type: 'event' | 'business' | 'news' | 'local_resource';
}

const MySubmissions = () => {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<UserSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchUserSubmissions = async () => {
      try {
        setLoading(true);
        
        // Fetch from all submission tables
        const [eventSubs, businessSubs, newsSubs, localResourceSubs] = await Promise.all([
          supabase
            .from('event_submissions')
            .select('id, title, status, admin_notes, created_at, reviewed_at')
            .eq('submitted_by', user.id)
            .order('created_at', { ascending: false }),
          supabase
            .from('business_submissions')
            .select('id, title, status, admin_notes, created_at, reviewed_at')
            .eq('submitted_by', user.id)
            .order('created_at', { ascending: false }),
          supabase
            .from('news_submissions')
            .select('id, title, status, admin_notes, created_at, reviewed_at')
            .eq('submitted_by', user.id)
            .order('created_at', { ascending: false }),
          supabase
            .from('local_resources_submissions')
            .select('id, name as title, status, admin_notes, created_at, reviewed_at')
            .eq('submitted_by', user.id)
            .order('created_at', { ascending: false })
        ]);

        const eventData = eventSubs.data as any[] || [];
        const businessData = businessSubs.data as any[] || [];
        const newsData = newsSubs.data as any[] || [];
        const localResourceData = localResourceSubs.data as any[] || [];

        const allSubmissions: UserSubmission[] = [
          ...eventData.map(sub => ({ 
            id: sub.id,
            title: sub.title,
            status: sub.status,
            admin_notes: sub.admin_notes,
            created_at: sub.created_at,
            reviewed_at: sub.reviewed_at,
            type: 'event' as const 
          })),
          ...businessData.map(sub => ({ 
            id: sub.id,
            title: sub.title,
            status: sub.status,
            admin_notes: sub.admin_notes,
            created_at: sub.created_at,
            reviewed_at: sub.reviewed_at,
            type: 'business' as const 
          })),
          ...newsData.map(sub => ({ 
            id: sub.id,
            title: sub.title,
            status: sub.status,
            admin_notes: sub.admin_notes,
            created_at: sub.created_at,
            reviewed_at: sub.reviewed_at,
            type: 'news' as const 
          })),
          ...localResourceData.map(sub => ({ 
            id: sub.id,
            title: sub.title,
            status: sub.status,
            admin_notes: sub.admin_notes,
            created_at: sub.created_at,
            reviewed_at: sub.reviewed_at,
            type: 'local_resource' as const 
          }))
        ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

        setSubmissions(allSubmissions);
      } catch (error) {
        console.error('Error fetching submissions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserSubmissions();
  }, [user]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <Badge variant="outline" className="text-green-600 border-green-600">
            <CheckCircle className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="outline" className="text-red-600 border-red-600">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-orange-600 border-orange-600">
            <Clock className="h-3 w-3 mr-1" />
            Pending Review
          </Badge>
        );
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'event': return 'Event';
      case 'business': return 'Business';
      case 'news': return 'News';
      case 'local_resource': return 'Local Resource';
      default: return 'Submission';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const pendingSubmissions = submissions.filter(sub => sub.status === 'pending');
  const reviewedSubmissions = submissions.filter(sub => sub.status !== 'pending');
  const rejectedWithMessages = submissions.filter(sub => sub.status === 'rejected' && sub.admin_notes);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please log in to view your submissions.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Submissions</h1>
          <p className="text-gray-600">Track the status of your submissions and view admin feedback</p>
        </div>

        {rejectedWithMessages.length > 0 && (
          <Alert className="mb-6 border-orange-200 bg-orange-50">
            <MessageSquare className="h-4 w-4" />
            <AlertDescription>
              You have {rejectedWithMessages.length} rejected submission{rejectedWithMessages.length > 1 ? 's' : ''} with admin feedback. 
              Please review the messages below to understand why they were rejected.
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All ({submissions.length})</TabsTrigger>
            <TabsTrigger value="pending">Pending ({pendingSubmissions.length})</TabsTrigger>
            <TabsTrigger value="reviewed">Reviewed ({reviewedSubmissions.length})</TabsTrigger>
            <TabsTrigger value="messages">Messages ({rejectedWithMessages.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <SubmissionsList submissions={submissions} loading={loading} />
          </TabsContent>

          <TabsContent value="pending">
            <SubmissionsList submissions={pendingSubmissions} loading={loading} />
          </TabsContent>

          <TabsContent value="reviewed">
            <SubmissionsList submissions={reviewedSubmissions} loading={loading} />
          </TabsContent>

          <TabsContent value="messages">
            <div className="space-y-4">
              {rejectedWithMessages.map((submission) => (
                <Card key={submission.id} className="border-red-200">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{submission.title}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary">{getTypeLabel(submission.type)}</Badge>
                          {getStatusBadge(submission.status)}
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        Reviewed: {submission.reviewed_at ? formatDate(submission.reviewed_at) : 'N/A'}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-start gap-2">
                        <XCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-red-800 mb-2">Rejection Reason</h4>
                          <p className="text-red-700">{submission.admin_notes}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {rejectedWithMessages.length === 0 && (
                <Card>
                  <CardContent className="py-8 text-center text-gray-500">
                    No rejection messages to display
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

interface SubmissionsListProps {
  submissions: UserSubmission[];
  loading: boolean;
}

const SubmissionsList = ({ submissions, loading }: SubmissionsListProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <Badge variant="outline" className="text-green-600 border-green-600">
            <CheckCircle className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="outline" className="text-red-600 border-red-600">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-orange-600 border-orange-600">
            <Clock className="h-3 w-3 mr-1" />
            Pending Review
          </Badge>
        );
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'event': return 'Event';
      case 'business': return 'Business';
      case 'news': return 'News';
      case 'local_resource': return 'Local Resource';
      default: return 'Submission';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <Clock className="h-8 w-8 animate-spin mx-auto mb-4 text-purple-600" />
          <p>Loading your submissions...</p>
        </CardContent>
      </Card>
    );
  }

  if (submissions.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-gray-500">
          <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>No submissions found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {submissions.map((submission) => (
        <Card key={submission.id} className={submission.status === 'rejected' && submission.admin_notes ? 'border-red-200' : ''}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">{submission.title}</CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary">{getTypeLabel(submission.type)}</Badge>
                  {getStatusBadge(submission.status)}
                </div>
              </div>
              <div className="text-sm text-gray-500">
                <div>Submitted: {formatDate(submission.created_at)}</div>
                {submission.reviewed_at && (
                  <div>Reviewed: {formatDate(submission.reviewed_at)}</div>
                )}
              </div>
            </div>
          </CardHeader>
          
          {submission.admin_notes && (
            <CardContent>
              <div className={`p-4 rounded-lg border ${
                submission.status === 'rejected' 
                  ? 'bg-red-50 border-red-200' 
                  : 'bg-blue-50 border-blue-200'
              }`}>
                <div className="flex items-start gap-2">
                  {submission.status === 'rejected' ? (
                    <XCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                  ) : (
                    <MessageSquare className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  )}
                  <div>
                    <h4 className={`font-semibold mb-1 ${
                      submission.status === 'rejected' ? 'text-red-800' : 'text-blue-800'
                    }`}>
                      {submission.status === 'rejected' ? 'Rejection Reason' : 'Admin Notes'}
                    </h4>
                    <p className={submission.status === 'rejected' ? 'text-red-700' : 'text-blue-700'}>
                      {submission.admin_notes}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
};

export default MySubmissions;
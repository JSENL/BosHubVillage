
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useEventSubmissions } from '@/hooks/useEventSubmissions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import EventSubmissionForm from '@/components/EventSubmissionForm';
import AdminEventApproval from '@/components/AdminEventApproval';
import { 
  Send, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Calendar, 
  MapPin,
  Shield
} from 'lucide-react';

const SubmitEvent = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const { submissions, loading } = useEventSubmissions();
  const [activeTab, setActiveTab] = useState('submit');
  
  // Filter user's own submissions
  const userSubmissions = submissions.filter(s => s.submitted_by === user?.id);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-yellow-600 border-yellow-600"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'approved':
        return <Badge variant="outline" className="text-green-600 border-green-600"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="text-red-600 border-red-600"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Clock className="h-8 w-8 animate-spin mx-auto mb-4 text-purple-600" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-purple-500 mb-4">
                <Send className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Authentication Required</h3>
              <p className="text-gray-600 mb-4">You need to sign in to submit events for approval.</p>
              <Button 
                onClick={() => window.location.href = '/auth'}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                Sign In
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'submit', label: 'Submit Event', icon: Send },
    { id: 'submissions', label: `My Submissions (${userSubmissions.length})`, icon: Clock },
    ...(isAdmin ? [{ id: 'admin', label: 'Admin Panel', icon: Shield }] : [])
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Event Management
          </h1>
          <p className="text-gray-600">Submit events for approval and manage submissions</p>
        </div>

        {/* Custom Tab Navigation */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'submit' && <EventSubmissionForm />}
          
          {activeTab === 'submissions' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  My Event Submissions
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center p-8">
                    <Clock className="h-6 w-6 animate-spin mr-2" />
                    Loading submissions...
                  </div>
                ) : userSubmissions.length === 0 ? (
                  <div className="text-center p-8">
                    <Send className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Submissions Yet</h3>
                    <p className="text-gray-600">Submit your first event using the form above.</p>
                  </div>
                ) : (
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
                      {userSubmissions.map((submission) => (
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
                            {getStatusBadge(submission.status)}
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
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === 'admin' && isAdmin && <AdminEventApproval />}
        </div>
      </div>
    </div>
  );
};

export default SubmitEvent;

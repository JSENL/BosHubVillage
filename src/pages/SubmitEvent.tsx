
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useEventSubmissions } from '@/hooks/useEventSubmissions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import EventSubmissionForm from '@/components/EventSubmissionForm';
import AdminEventApproval from '@/components/AdminEventApproval';
import { SubmissionsTable } from '@/components/SubmissionsTable';
import { 
  Send, 
  Clock, 
  Shield,
  ArrowLeft
} from 'lucide-react';

const SubmitEvent = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const { submissions, loading } = useEventSubmissions();
  const [activeTab, setActiveTab] = useState('submit');
  
  // Filter user's own submissions
  const userSubmissions = submissions.filter(s => s.submitted_by === user?.id);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Clock className="h-8 w-8 animate-spin mx-auto mb-4 text-yelp-red" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-yelp-light-gray py-8">
        <div className="max-w-4xl mx-auto px-4">
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-yelp-red mb-4">
                <Send className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-yelp-gray mb-2">Authentication Required</h3>
              <p className="text-gray-600 mb-4">You need to sign in to submit events for approval.</p>
              <Button 
                onClick={() => window.location.href = '/auth'}
                className="yelp-gradient hover:opacity-90 text-white"
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
    <div className="min-h-screen bg-yelp-light-gray py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => window.location.href = '/'}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          <h1 className="text-4xl font-bold text-yelp-gray mb-2">
            Event Management
          </h1>
          <p className="text-gray-600">Submit events for approval and manage submissions</p>
        </div>

        {/* Custom Tab Navigation */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-white rounded-lg p-1 yelp-shadow">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'yelp-gradient text-white yelp-shadow'
                      : 'text-yelp-gray hover:text-yelp-red hover:bg-gray-100'
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
                <CardTitle className="flex items-center text-yelp-gray">
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
                    <Send className="h-16 w-16 mx-auto mb-4 text-yelp-light-gray" />
                    <h3 className="text-lg font-semibold text-yelp-gray mb-2">No Submissions Yet</h3>
                    <p className="text-gray-600">Submit your first event using the form above.</p>
                  </div>
                ) : (
                  <SubmissionsTable submissions={userSubmissions} />
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

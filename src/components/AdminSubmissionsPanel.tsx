
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { BusinessSubmission, NewsSubmission } from '@/types/submissions';
import { BusinessSubmissionCard } from '@/components/BusinessSubmissionCard';
import { NewsSubmissionCard } from '@/components/NewsSubmissionCard';
import { EventSubmission } from '@/hooks/useEventSubmissions';
import { EventSubmissionCard } from '@/components/EventSubmissionCard';
import { LocalResourceSubmission } from '@/types/localServices';
import LocalServiceSubmissionCard from '@/components/LocalServiceSubmissionCard';
import { 
  CheckCircle, 
  Clock,
  Building,
  Newspaper,
  Calendar,
  Heart,
  AlertCircle
} from 'lucide-react';

const AdminSubmissionsPanel = () => {
  const { isAdmin, user } = useAuth();
  const [businessSubmissions, setBusinessSubmissions] = useState<BusinessSubmission[]>([]);
  const [newsSubmissions, setNewsSubmissions] = useState<NewsSubmission[]>([]);
  const [eventSubmissions, setEventSubmissions] = useState<EventSubmission[]>([]);
  const [localResourceSubmissions, setLocalResourceSubmissions] = useState<LocalResourceSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllSubmissions = async () => {
    if (!isAdmin || !user) {
      console.log('User is not admin or not authenticated');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching all submissions for admin user:', user.id);
      
      // Fetch business submissions
      const { data: businessData, error: businessError } = await supabase
        .from('business_submissions')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (businessError) {
        console.error('Business submissions error:', businessError);
        throw new Error(`Business submissions: ${businessError.message}`);
      }

      // Fetch news submissions
      const { data: newsData, error: newsError } = await supabase
        .from('news_submissions')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (newsError) {
        console.error('News submissions error:', newsError);
        throw new Error(`News submissions: ${newsError.message}`);
      }

      // Fetch event submissions
      const { data: eventData, error: eventError } = await supabase
        .from('event_submissions')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (eventError) {
        console.error('Event submissions error:', eventError);
        throw new Error(`Event submissions: ${eventError.message}`);
      }

      // Fetch local resource submissions
      const { data: localResourceData, error: localResourceError } = await supabase
        .from('local_resources_submissions')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (localResourceError) {
        console.error('Local resource submissions error:', localResourceError);
        throw new Error(`Local resource submissions: ${localResourceError.message}`);
      }

      // Type cast the data to ensure status field is properly typed
      const typedBusinessData = (businessData || []).map(submission => ({
        ...submission,
        status: submission.status as 'pending' | 'approved' | 'rejected'
      }));

      const typedNewsData = (newsData || []).map(submission => ({
        ...submission,
        status: submission.status as 'pending' | 'approved' | 'rejected'
      }));

      const typedEventData = (eventData || []).map(submission => ({
        ...submission,
        status: submission.status as 'pending' | 'approved' | 'rejected'
      }));

      const typedLocalResourceData = (localResourceData || []).map(submission => ({
        ...submission,
        status: submission.status as 'pending' | 'approved' | 'rejected'
      }));

      console.log('Successfully fetched submissions:', {
        business: typedBusinessData.length,
        news: typedNewsData.length,
        events: typedEventData.length,
        localResources: typedLocalResourceData.length
      });

      setBusinessSubmissions(typedBusinessData);
      setNewsSubmissions(typedNewsData);
      setEventSubmissions(typedEventData);
      setLocalResourceSubmissions(typedLocalResourceData);
    } catch (error: any) {
      console.error('Error fetching submissions:', error);
      setError(error.message || 'Failed to load submissions');
      toast.error('Failed to load submissions: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin && user) {
      console.log('Admin user detected, fetching submissions...');
      fetchAllSubmissions();
    } else {
      console.log('Not admin or no user, skipping fetch');
      setLoading(false);
    }
  }, [isAdmin, user]);

  if (!isAdmin) {
    return null;
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Clock className="h-8 w-8 animate-spin mx-auto mb-4 text-purple-600" />
          <p>Loading submissions...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <AlertCircle className="h-8 w-8 mx-auto mb-4 text-red-500" />
          <h3 className="text-lg font-semibold text-red-700 mb-2">Error Loading Submissions</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={fetchAllSubmissions}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
          >
            Retry
          </button>
        </CardContent>
      </Card>
    );
  }

  const totalPendingSubmissions = businessSubmissions.length + newsSubmissions.length + eventSubmissions.length + localResourceSubmissions.length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-gray-900">
            <CheckCircle className="h-5 w-5 mr-2 text-purple-600" />
            Pending Submissions Overview ({totalPendingSubmissions} total)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-blue-600">{eventSubmissions.length}</p>
                  <p className="text-sm text-gray-600">Event Submissions</p>
                </div>
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center">
                <Building className="h-8 w-8 text-green-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-green-600">{businessSubmissions.length}</p>
                  <p className="text-sm text-gray-600">Business Submissions</p>
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

          {totalPendingSubmissions === 0 ? (
            <div className="text-center p-8">
              <CheckCircle className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">All Caught Up!</h3>
              <p className="text-gray-600">No pending submissions to review.</p>
            </div>
          ) : (
            <Tabs defaultValue="business" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="business" className="flex items-center">
                  <Building className="h-4 w-4 mr-2" />
                  Business ({businessSubmissions.length})
                </TabsTrigger>
                <TabsTrigger value="news" className="flex items-center">
                  <Newspaper className="h-4 w-4 mr-2" />
                  News ({newsSubmissions.length})
                </TabsTrigger>
                <TabsTrigger value="events" className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Events ({eventSubmissions.length})
                </TabsTrigger>
                <TabsTrigger value="local-resources" className="flex items-center">
                  <Heart className="h-4 w-4 mr-2" />
                  Local Resources ({localResourceSubmissions.length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="business">
                <div className="space-y-4">
                  {businessSubmissions.length === 0 ? (
                    <div className="text-center p-8">
                      <Building className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-gray-600">No pending business submissions.</p>
                    </div>
                  ) : (
                    businessSubmissions.map((submission) => (
                      <BusinessSubmissionCard
                        key={submission.id}
                        submission={submission}
                        onUpdate={fetchAllSubmissions}
                      />
                    ))
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="news">
                <div className="space-y-4">
                  {newsSubmissions.length === 0 ? (
                    <div className="text-center p-8">
                      <Newspaper className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-gray-600">No pending news submissions.</p>
                    </div>
                  ) : (
                    newsSubmissions.map((submission) => (
                      <NewsSubmissionCard
                        key={submission.id}
                        submission={submission}
                        onUpdate={fetchAllSubmissions}
                      />
                    ))
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="events">
                <div className="space-y-4">
                  {eventSubmissions.length === 0 ? (
                    <div className="text-center p-8">
                      <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-gray-600">No pending event submissions.</p>
                    </div>
                  ) : (
                    eventSubmissions.map((submission) => (
                      <EventSubmissionCard
                        key={submission.id}
                        submission={submission}
                        onUpdate={fetchAllSubmissions}
                      />
                    ))
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="local-resources">
                <div className="space-y-4">
                  {localResourceSubmissions.length === 0 ? (
                    <div className="text-center p-8">
                      <Heart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-gray-600">No pending local resource submissions.</p>
                    </div>
                  ) : (
                    localResourceSubmissions.map((submission) => (
                      <LocalServiceSubmissionCard
                        key={submission.id}
                        submission={submission}
                        onUpdate={fetchAllSubmissions}
                      />
                    ))
                  )}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSubmissionsPanel;

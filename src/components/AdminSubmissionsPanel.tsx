
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
import { 
  CheckCircle, 
  Clock,
  Building,
  Newspaper,
  Calendar
} from 'lucide-react';

const AdminSubmissionsPanel = () => {
  const { isAdmin } = useAuth();
  const [businessSubmissions, setBusinessSubmissions] = useState<BusinessSubmission[]>([]);
  const [newsSubmissions, setNewsSubmissions] = useState<NewsSubmission[]>([]);
  const [eventSubmissions, setEventSubmissions] = useState<EventSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAllSubmissions = async () => {
    if (!isAdmin) return;
    
    try {
      setLoading(true);
      
      // Fetch business submissions
      const { data: businessData, error: businessError } = await supabase
        .from('business_submissions')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (businessError) throw businessError;

      // Fetch news submissions
      const { data: newsData, error: newsError } = await supabase
        .from('news_submissions')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (newsError) throw newsError;

      // Fetch event submissions
      const { data: eventData, error: eventError } = await supabase
        .from('event_submissions')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (eventError) throw eventError;

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

      setBusinessSubmissions(typedBusinessData);
      setNewsSubmissions(typedNewsData);
      setEventSubmissions(typedEventData);
    } catch (error: any) {
      console.error('Error fetching submissions:', error);
      toast.error('Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllSubmissions();
  }, [isAdmin]);

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

  const totalPendingSubmissions = businessSubmissions.length + newsSubmissions.length + eventSubmissions.length;

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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
          </div>

          {totalPendingSubmissions === 0 ? (
            <div className="text-center p-8">
              <CheckCircle className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">All Caught Up!</h3>
              <p className="text-gray-600">No pending submissions to review.</p>
            </div>
          ) : (
            <Tabs defaultValue="business" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
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
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSubmissionsPanel;

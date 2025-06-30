
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { BusinessSubmission, NewsSubmission } from '@/types/submissions';
import { EventSubmission } from '@/hooks/useEventSubmissions';
import { LocalResourceSubmission } from '@/types/localServices';

export const useAdminSubmissions = () => {
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

  return {
    businessSubmissions,
    newsSubmissions,
    eventSubmissions,
    localResourceSubmissions,
    loading,
    error,
    fetchAllSubmissions
  };
};


import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { NewsSubmission, BusinessSubmission } from '@/types/submissions';
import { EventSubmission } from '@/hooks/useEventSubmissions';
import { LocalResourceSubmission } from '@/types/localresources';

export const useAdminSubmissions = () => {
  const { isAdmin, user } = useAuth();
  const [newsSubmissions, setNewsSubmissions] = useState<NewsSubmission[]>([]);
  const [eventSubmissions, setEventSubmissions] = useState<EventSubmission[]>([]);
  const [localResourceSubmissions, setLocalResourceSubmissions] = useState<LocalResourceSubmission[]>([]);
  const [businessSubmissions, setBusinessSubmissions] = useState<BusinessSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllSubmissions = async () => {
    if (!isAdmin || !user) {
      return;
    }
    
    try {
      setLoading(true);
      setError(null);

      const [
        { data: newsData, error: newsError },
        { data: eventData, error: eventError },
        { data: localResourceData, error: localResourceError },
        { data: businessData, error: businessError },
      ] = await Promise.all([
        supabase
          .from('news_submissions')
          .select('*')
          .eq('status', 'pending')
          .order('created_at', { ascending: false }),
        supabase
          .from('event_submissions')
          .select('*')
          .eq('status', 'pending')
          .order('created_at', { ascending: false }),
        supabase
          .from('local_resources_submissions')
          .select('*')
          .eq('status', 'pending')
          .order('created_at', { ascending: false }),
        supabase
          .from('business_submissions')
          .select('*')
          .eq('status', 'pending')
          .order('created_at', { ascending: false }),
      ]);

      if (newsError) {
        console.error('Culture submissions error:', newsError);
        throw new Error(`Culture submissions: ${newsError.message}`);
      }
      if (eventError) {
        console.error('Event submissions error:', eventError);
        throw new Error(`Event submissions: ${eventError.message}`);
      }
      if (localResourceError) {
        console.error('Local resource submissions error:', localResourceError);
        throw new Error(`Local resource submissions: ${localResourceError.message}`);
      }
      if (businessError) {
        console.error('Business submissions error:', businessError);
        throw new Error(`Business submissions: ${businessError.message}`);
      }

      // Type cast the data to ensure status field is properly typed
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

      const typedBusinessData = (businessData || []).map(submission => ({
        ...submission,
        status: submission.status as 'pending' | 'approved' | 'rejected'
      }));

      setNewsSubmissions(typedNewsData);
      setEventSubmissions(typedEventData);
      setLocalResourceSubmissions(typedLocalResourceData);
      setBusinessSubmissions(typedBusinessData);
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
      fetchAllSubmissions();
    } else {
      setLoading(false);
    }
  }, [isAdmin, user]);

  return {
    newsSubmissions,
    eventSubmissions,
    localResourceSubmissions,
    businessSubmissions,
    loading,
    error,
    fetchAllSubmissions
  };
};

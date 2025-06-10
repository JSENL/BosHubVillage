
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from './useAuth';

export interface EventSubmission {
  id: string;
  title: string;
  description: string | null;
  category: string;
  date: string;
  time: string | null;
  location: string;
  price: number;
  max_attendees: number | null;
  is_recurring: boolean;
  recurring_pattern: string | null;
  status: 'pending' | 'approved' | 'rejected';
  submitted_by: string;
  reviewed_by: string | null;
  reviewed_at: string | null;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
  latitude: number | null;
  longitude: number | null;
}

interface CreateEventSubmissionData {
  title: string;
  description: string;
  category: string;
  date: string;
  time: string;
  location: string;
  price: number;
  max_attendees: number | null;
  is_recurring: boolean;
  recurring_pattern: string | null;
  latitude: number | null;
  longitude: number | null;
}

export const useEventSubmissions = () => {
  const [submissions, setSubmissions] = useState<EventSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('event_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setSubmissions(data || []);
    } catch (error: any) {
      console.error('Error fetching event submissions:', error);
      toast.error('Failed to load event submissions');
    } finally {
      setLoading(false);
    }
  };

  const submitEvent = async (eventData: CreateEventSubmissionData) => {
    try {
      if (!user) {
        throw new Error('User not authenticated');
      }

      console.log('Submitting event with coordinates:', {
        title: eventData.title,
        location: eventData.location,
        latitude: eventData.latitude,
        longitude: eventData.longitude
      });

      const { data, error } = await supabase
        .from('event_submissions')
        .insert({
          ...eventData,
          submitted_by: user.id
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Event submitted successfully! It will be reviewed by our admin team.');
      fetchSubmissions(); // Refresh the list
      return data;
    } catch (error: any) {
      console.error('Error submitting event:', error);
      toast.error('Failed to submit event');
      throw error;
    }
  };

  const approveSubmission = async (submissionId: string, adminNotes?: string) => {
    try {
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Get the submission data
      const { data: submission, error: fetchError } = await supabase
        .from('event_submissions')
        .select('*')
        .eq('id', submissionId)
        .single();

      if (fetchError) throw fetchError;

      // Create the event in the events table
      const { error: createError } = await supabase
        .from('events')
        .insert({
          title: submission.title,
          description: submission.description,
          category: submission.category,
          date: submission.date,
          time: submission.time,
          location: submission.location,
          price: submission.price,
          max_attendees: submission.max_attendees,
          is_recurring: submission.is_recurring,
          recurring_pattern: submission.recurring_pattern,
          latitude: submission.latitude,
          longitude: submission.longitude,
          created_by: submission.submitted_by
        });

      if (createError) throw createError;

      // Update the submission status
      const { error: updateError } = await supabase
        .from('event_submissions')
        .update({
          status: 'approved',
          reviewed_by: user.id,
          reviewed_at: new Date().toISOString(),
          admin_notes: adminNotes
        })
        .eq('id', submissionId);

      if (updateError) throw updateError;

      toast.success('Event approved and published!');
      fetchSubmissions();
    } catch (error: any) {
      console.error('Error approving submission:', error);
      toast.error('Failed to approve event');
      throw error;
    }
  };

  const rejectSubmission = async (submissionId: string, adminNotes: string) => {
    try {
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('event_submissions')
        .update({
          status: 'rejected',
          reviewed_by: user.id,
          reviewed_at: new Date().toISOString(),
          admin_notes: adminNotes
        })
        .eq('id', submissionId);

      if (error) throw error;

      toast.success('Event submission rejected');
      fetchSubmissions();
    } catch (error: any) {
      console.error('Error rejecting submission:', error);
      toast.error('Failed to reject event');
      throw error;
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  return {
    submissions,
    loading,
    fetchSubmissions,
    submitEvent,
    approveSubmission,
    rejectSubmission
  };
};


import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface EventSubmission {
  id: string;
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
  submitted_by: string;
  status: 'pending' | 'approved' | 'rejected';
  admin_notes: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
}

export const useEventSubmissions = () => {
  const [submissions, setSubmissions] = useState<EventSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('event_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setSubmissions(data || []);
    } catch (error: any) {
      console.error('Error fetching submissions:', error);
      toast.error('Failed to load event submissions');
    } finally {
      setLoading(false);
    }
  };

  const submitEvent = async (eventData: Omit<EventSubmission, 'id' | 'submitted_by' | 'status' | 'admin_notes' | 'reviewed_by' | 'reviewed_at' | 'created_at' | 'updated_at'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('event_submissions')
        .insert({
          ...eventData,
          submitted_by: user.id
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Event submitted for approval!');
      fetchSubmissions();
      return data;
    } catch (error: any) {
      console.error('Error submitting event:', error);
      toast.error('Failed to submit event');
      throw error;
    }
  };

  const updateSubmissionStatus = async (submissionId: string, status: 'approved' | 'rejected', adminNotes?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const updateData: any = {
        status,
        reviewed_by: user.id,
        reviewed_at: new Date().toISOString()
      };

      if (adminNotes) {
        updateData.admin_notes = adminNotes;
      }

      const { error } = await supabase
        .from('event_submissions')
        .update(updateData)
        .eq('id', submissionId);

      if (error) throw error;

      // If approved, create the actual event
      if (status === 'approved') {
        await approveAndCreateEvent(submissionId);
      }

      toast.success(`Event ${status} successfully!`);
      fetchSubmissions();
    } catch (error: any) {
      console.error('Error updating submission:', error);
      toast.error(`Failed to ${status} event`);
    }
  };

  const approveAndCreateEvent = async (submissionId: string) => {
    try {
      // Get the submission data
      const { data: submission, error: fetchError } = await supabase
        .from('event_submissions')
        .select('*')
        .eq('id', submissionId)
        .single();

      if (fetchError) throw fetchError;

      // Create the actual event
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
          created_by: submission.submitted_by
        });

      if (createError) throw createError;

    } catch (error: any) {
      console.error('Error creating approved event:', error);
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
    updateSubmissionStatus
  };
};

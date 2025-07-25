import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Announcement {
  id: string;
  title: string;
  message: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  sent_at: string | null;
  recipients_count: number;
  status: 'draft' | 'sent';
}

export const useAnnouncements = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchAnnouncements = async () => {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setAnnouncements((data || []) as Announcement[]);
    } catch (error: any) {
      console.error('Error fetching announcements:', error);
      toast.error('Failed to load announcements');
    } finally {
      setLoading(false);
    }
  };

  const createAnnouncement = async (title: string, message: string) => {
    setActionLoading(true);
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('announcements')
        .insert({
          title,
          message,
          created_by: user.user.id,
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Announcement created successfully');
      fetchAnnouncements();
      return data;
    } catch (error: any) {
      console.error('Error creating announcement:', error);
      toast.error('Failed to create announcement');
      throw error;
    } finally {
      setActionLoading(false);
    }
  };

  const updateAnnouncement = async (id: string, title: string, message: string) => {
    setActionLoading(true);
    try {
      const { error } = await supabase
        .from('announcements')
        .update({ title, message })
        .eq('id', id);

      if (error) throw error;

      toast.success('Announcement updated successfully');
      fetchAnnouncements();
    } catch (error: any) {
      console.error('Error updating announcement:', error);
      toast.error('Failed to update announcement');
      throw error;
    } finally {
      setActionLoading(false);
    }
  };

  const deleteAnnouncement = async (id: string) => {
    setActionLoading(true);
    try {
      const { error } = await supabase
        .from('announcements')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Announcement deleted successfully');
      fetchAnnouncements();
    } catch (error: any) {
      console.error('Error deleting announcement:', error);
      toast.error('Failed to delete announcement');
      throw error;
    } finally {
      setActionLoading(false);
    }
  };

  const sendAnnouncement = async (id: string) => {
    setActionLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-announcement', {
        body: { announcementId: id },
      });

      if (error) throw error;

      toast.success(`Announcement sent to ${data.recipients_count} users!`);
      fetchAnnouncements();
      return data;
    } catch (error: any) {
      console.error('Error sending announcement:', error);
      toast.error('Failed to send announcement');
      throw error;
    } finally {
      setActionLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  return {
    announcements,
    loading,
    actionLoading,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    sendAnnouncement,
    fetchAnnouncements,
  };
};
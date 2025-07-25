import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Announcement } from './useAnnouncements';

export const useUserAnnouncements = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSentAnnouncements = async () => {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .eq('status', 'sent')
        .order('sent_at', { ascending: false });

      if (error) throw error;

      setAnnouncements((data || []) as Announcement[]);
    } catch (error) {
      console.error('Error fetching sent announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSentAnnouncements();

    // Set up real-time subscription for new announcements
    const channel = supabase
      .channel('announcements-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'announcements',
          filter: 'status=eq.sent'
        },
        (payload) => {
          console.log('New announcement sent:', payload);
          // Add the new announcement to the list
          setAnnouncements(prev => [payload.new as Announcement, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    announcements,
    loading,
    refreshAnnouncements: fetchSentAnnouncements,
  };
};
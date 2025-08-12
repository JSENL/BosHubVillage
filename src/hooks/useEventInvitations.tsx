import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export interface EventInvitation {
  id: string;
  event_id: string;
  invited_user_id: string;
  invited_by: string;
  status: 'pending' | 'accepted' | 'declined';
  created_at: string;
  updated_at: string;
}

export const useEventInvitations = () => {
  const [invitations, setInvitations] = useState<EventInvitation[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchInvitations = async () => {
    try {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('event_invitations')
        .select('*')
        .eq('invited_user_id', user.id);

      if (error) throw error;
      setInvitations(data as EventInvitation[] || []);
    } catch (error) {
      console.error('Error fetching invitations:', error);
      toast.error('Failed to load invitations');
    } finally {
      setLoading(false);
    }
  };

  const inviteUsers = async (eventId: string, userIds: string[]) => {
    try {
      if (!user) throw new Error('User not authenticated');

      const invitations = userIds.map(userId => ({
        event_id: eventId,
        invited_user_id: userId,
        invited_by: user.id,
        status: 'pending' as const
      }));

      const { error } = await supabase
        .from('event_invitations')
        .insert(invitations);

      if (error) throw error;
      
      toast.success(`Invited ${userIds.length} user(s) to event`);
      fetchInvitations();
    } catch (error) {
      console.error('Error inviting users:', error);
      toast.error('Failed to send invitations');
    }
  };

  const respondToInvitation = async (invitationId: string, status: 'accepted' | 'declined') => {
    try {
      const { error } = await supabase
        .from('event_invitations')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', invitationId);

      if (error) throw error;
      
      toast.success(`Invitation ${status}`);
      fetchInvitations();
    } catch (error) {
      console.error('Error responding to invitation:', error);
      toast.error('Failed to respond to invitation');
    }
  };

  useEffect(() => {
    fetchInvitations();
  }, [user]);

  return {
    invitations,
    loading,
    inviteUsers,
    respondToInvitation,
    refetch: fetchInvitations
  };
};
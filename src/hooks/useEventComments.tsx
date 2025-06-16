
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface EventComment {
  id: string;
  event_id: string;
  user_id: string;
  comment: string;
  rating: number;
  created_at: string;
  updated_at: string;
  profiles?: {
    full_name: string | null;
    email: string;
  };
  user_roles?: {
    role: string;
  }[];
}

export const useEventComments = (eventId: string | null) => {
  const [comments, setComments] = useState<EventComment[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchComments = async () => {
    if (!eventId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('event_comments')
        .select(`
          *,
          profiles (
            full_name,
            email
          ),
          user_roles!inner (
            role
          )
        `)
        .eq('event_id', eventId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setComments(data || []);
    } catch (error: any) {
      console.error('Error fetching comments:', error);
      toast.error('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const addComment = async (commentText: string, rating: number) => {
    if (!eventId) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('event_comments')
        .insert({
          event_id: eventId,
          user_id: user.id,
          comment: commentText,
          rating: rating
        })
        .select(`
          *,
          profiles (
            full_name,
            email
          ),
          user_roles!inner (
            role
          )
        `)
        .single();

      if (error) throw error;

      setComments(prev => [data, ...prev]);
      toast.success('Comment added successfully!');
      return data;
    } catch (error: any) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
      throw error;
    }
  };

  const deleteComment = async (commentId: string) => {
    try {
      const { error } = await supabase
        .from('event_comments')
        .delete()
        .eq('id', commentId);

      if (error) throw error;

      setComments(prev => prev.filter(comment => comment.id !== commentId));
      toast.success('Comment deleted successfully!');
    } catch (error: any) {
      console.error('Error deleting comment:', error);
      toast.error('Failed to delete comment');
    }
  };

  useEffect(() => {
    fetchComments();
  }, [eventId]);

  return {
    comments,
    loading,
    addComment,
    deleteComment,
    refetchComments: fetchComments
  };
};

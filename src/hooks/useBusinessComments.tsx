
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { organizeComments } from '@/utils/commentUtils';

export interface BusinessComment {
  id: string;
  business_id: string;
  user_id: string;
  comment: string;
  rating: number;
  created_at: string;
  updated_at: string;
  parent_comment_id?: string | null;
  profiles?: {
    full_name: string | null;
    email: string;
    user_roles?: {
      role: string;
    }[];
  };
  replies?: BusinessComment[];
}

export const useBusinessComments = (businessId: string) => {
  const [comments, setComments] = useState<BusinessComment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('business_comments')
        .select(`
          *,
          profiles (
            full_name,
            email,
            user_roles (role)
          )
        `)
        .eq('business_id', businessId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const organizedComments = organizeComments(data || []);
      setComments(organizedComments);
    } catch (error: any) {
      console.error('Error fetching business comments:', error);
      toast.error('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const addComment = async (commentText: string, rating: number, mediaFiles?: File[], parentCommentId?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('business_comments')
        .insert({
          business_id: businessId,
          user_id: user.id,
          comment: commentText,
          rating: parentCommentId ? 5 : rating, // Replies don't have ratings
          parent_comment_id: parentCommentId || null
        })
        .select()
        .single();

      if (error) throw error;

      toast.success(parentCommentId ? 'Reply added successfully!' : 'Comment added successfully!');
      fetchComments();
      return data;
    } catch (error: any) {
      console.error('Error adding business comment:', error);
      toast.error('Failed to add comment');
      throw error;
    }
  };

  const deleteComment = async (commentId: string) => {
    try {
      const { error } = await supabase
        .from('business_comments')
        .delete()
        .eq('id', commentId);

      if (error) throw error;

      toast.success('Comment deleted successfully!');
      fetchComments();
    } catch (error: any) {
      console.error('Error deleting business comment:', error);
      toast.error('Failed to delete comment');
      throw error;
    }
  };

  useEffect(() => {
    if (businessId) {
      fetchComments();
    }
  }, [businessId]);

  return {
    comments,
    loading,
    addComment,
    deleteComment,
    refetch: fetchComments
  };
};

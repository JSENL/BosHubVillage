import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BusinessComment } from '@/types/business';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export const useBusinessComments = (businessId: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: comments = [], isLoading } = useQuery({
    queryKey: ['business-comments', businessId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('business_comments')
        .select(`
          *,
          profiles (
            full_name,
            email
          )
        `)
        .eq('business_id', businessId)
        .is('parent_comment_id', null)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch replies for each comment
      const commentsWithReplies = await Promise.all(
        (data || []).map(async (comment) => {
          const { data: replies, error: repliesError } = await supabase
            .from('business_comments')
            .select(`
              *,
              profiles (
                full_name,
                email
              )
            `)
            .eq('parent_comment_id', comment.id)
            .order('created_at', { ascending: true });

          if (repliesError) throw repliesError;

          return {
            ...comment,
            replies: replies || []
          };
        })
      );

      return commentsWithReplies as BusinessComment[];
    },
  });

  const addCommentMutation = useMutation({
    mutationFn: async ({ 
      comment, 
      rating = 5, 
      parentCommentId 
    }: { 
      comment: string; 
      rating?: number; 
      parentCommentId?: string;
    }) => {
      if (!user) throw new Error('User must be logged in to comment');

      const { data, error } = await supabase
        .from('business_comments')
        .insert({
          business_id: businessId,
          user_id: user.id,
          comment,
          rating,
          parent_comment_id: parentCommentId || null,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business-comments', businessId] });
      toast.success('Comment added successfully!');
    },
    onError: (error) => {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment. Please try again.');
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId: string) => {
      const { error } = await supabase
        .from('business_comments')
        .delete()
        .eq('id', commentId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business-comments', businessId] });
      toast.success('Comment deleted successfully!');
    },
    onError: (error) => {
      console.error('Error deleting comment:', error);
      toast.error('Failed to delete comment. Please try again.');
    },
  });

  const addComment = async (commentText: string, rating: number = 5, mediaFiles?: File[], parentCommentId?: string) => {
    await addCommentMutation.mutateAsync({ 
      comment: commentText, 
      rating, 
      parentCommentId 
    });
  };

  const replyToComment = async (parentCommentId: string, replyText: string) => {
    await addCommentMutation.mutateAsync({ 
      comment: replyText, 
      rating: 5, 
      parentCommentId 
    });
  };

  const deleteComment = async (commentId: string) => {
    await deleteCommentMutation.mutateAsync(commentId);
  };

  return {
    comments,
    isLoading,
    addComment,
    replyToComment,
    deleteComment,
    isAddingComment: addCommentMutation.isPending,
    isDeletingComment: deleteCommentMutation.isPending,
  };
};
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface LocalResourceComment {
  id: string;
  comment: string;
  rating: number;
  created_at: string;
  updated_at: string;
  user_id: string;
  local_resource_id: string;
  parent_comment_id?: string | null;
  profiles?: {
    full_name: string | null;
    email: string;
    user_roles?: {
      role: string;
    }[];
  };
  replies?: LocalResourceComment[];
}

export const useLocalResourceComments = (localResourceId: string) => {
  const queryClient = useQueryClient();

  const { data: comments = [], isLoading } = useQuery({
    queryKey: ['local-resource-comments', localResourceId],
    queryFn: async () => {
      console.log('Fetching comments for local resource:', localResourceId);
      
      const { data, error } = await supabase
        .from('local_resources_comments')
        .select(`
          *,
          profiles (
            full_name,
            email,
            user_roles (
              role
            )
          )
        `)
        .eq('local_resource_id', localResourceId)
        .is('parent_comment_id', null)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching local resource comments:', error);
        throw error;
      }

      // Fetch replies for each comment
      const commentsWithReplies = await Promise.all(
        (data || []).map(async (comment) => {
          const { data: replies, error: repliesError } = await supabase
            .from('local_resources_comments')
            .select(`
              *,
              profiles (
                full_name,
                email,
                user_roles (
                  role
                )
              )
            `)
            .eq('parent_comment_id', comment.id)
            .order('created_at', { ascending: true });

          if (repliesError) {
            console.error('Error fetching replies:', repliesError);
            return { ...comment, replies: [] };
          }

          return { ...comment, replies: replies || [] };
        })
      );

      return commentsWithReplies;
    },
    enabled: !!localResourceId,
  });

  const addCommentMutation = useMutation({
    mutationFn: async ({ comment, rating, parentCommentId }: { 
      comment: string; 
      rating: number; 
      parentCommentId?: string | null;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('local_resources_comments')
        .insert({
          local_resource_id: localResourceId,
          comment,
          rating,
          user_id: user.id,
          parent_comment_id: parentCommentId
        })
        .select(`
          *,
          profiles (
            full_name,
            email,
            user_roles (
              role
            )
          )
        `)
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['local-resource-comments', localResourceId] });
      toast.success('Comment added successfully!');
    },
    onError: (error: Error) => {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment. Please try again.');
    }
  });

  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId: string) => {
      const { error } = await supabase
        .from('local_resources_comments')
        .delete()
        .eq('id', commentId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['local-resource-comments', localResourceId] });
      toast.success('Comment deleted successfully!');
    },
    onError: (error: Error) => {
      console.error('Error deleting comment:', error);
      toast.error('Failed to delete comment. Please try again.');
    }
  });

  const addComment = async (comment: string, rating: number = 5, mediaFiles?: File[]): Promise<void> => {
    return new Promise((resolve, reject) => {
      addCommentMutation.mutate(
        { comment, rating },
        {
          onSuccess: () => resolve(),
          onError: (error) => reject(error)
        }
      );
    });
  };

  const replyToComment = async (parentCommentId: string, comment: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      addCommentMutation.mutate(
        { comment, rating: 5, parentCommentId },
        {
          onSuccess: () => resolve(),
          onError: (error) => reject(error)
        }
      );
    });
  };

  const deleteComment = async (commentId: string, isOwnComment: boolean) => {
    if (isOwnComment) {
      deleteCommentMutation.mutate(commentId);
    } else {
      toast.error('You can only delete your own comments.');
    }
  };

  return {
    comments,
    isLoading,
    addComment,
    replyToComment,
    deleteComment,
    isAddingComment: addCommentMutation.isPending,
    isDeletingComment: deleteCommentMutation.isPending
  };
};
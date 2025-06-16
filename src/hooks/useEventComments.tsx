
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { EventComment, CommentMedia } from '@/types/comments';
import { organizeComments } from '@/utils/commentUtils';
import { uploadMediaFiles } from '@/services/mediaUploadService';

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
            email,
            user_roles (
              role
            )
          ),
          comment_media (
            id,
            file_path,
            file_name,
            file_type,
            file_size
          )
        `)
        .eq('event_id', eventId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      
      const organizedComments = organizeComments(data || []);
      setComments(organizedComments);
    } catch (error: any) {
      console.error('Error fetching comments:', error);
      toast.error('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const addComment = async (commentText: string, rating: number, mediaFiles?: File[], parentCommentId?: string) => {
    if (!eventId) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Insert the comment first
      const { data: commentData, error: commentError } = await supabase
        .from('event_comments')
        .insert({
          event_id: eventId,
          user_id: user.id,
          comment: commentText,
          rating: rating,
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

      if (commentError) throw commentError;

      // Upload media files if any
      let mediaData: CommentMedia[] = [];
      if (mediaFiles && mediaFiles.length > 0) {
        const uploadedFiles = await uploadMediaFiles(mediaFiles, user.id);
        
        // Insert media records
        const mediaInserts = uploadedFiles.map(file => ({
          comment_id: commentData.id,
          file_path: file.path,
          file_name: file.name,
          file_type: file.type,
          file_size: file.size
        }));

        const { data: insertedMedia, error: mediaError } = await supabase
          .from('comment_media')
          .insert(mediaInserts)
          .select();

        if (mediaError) throw mediaError;
        mediaData = insertedMedia || [];
      }

      const newComment = {
        ...commentData,
        comment_media: mediaData
      };

      // Refresh comments to get the updated tree structure
      await fetchComments();
      toast.success('Comment added successfully!');
      return newComment;
    } catch (error: any) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
      throw error;
    }
  };

  const deleteComment = async (commentId: string) => {
    try {
      // Delete associated media files from storage
      const { data: mediaFiles } = await supabase
        .from('comment_media')
        .select('file_path')
        .eq('comment_id', commentId);

      if (mediaFiles && mediaFiles.length > 0) {
        const filePaths = mediaFiles.map(media => media.file_path);
        await supabase.storage
          .from('comment-media')
          .remove(filePaths);
      }

      // Delete the comment (media records will be deleted by CASCADE)
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

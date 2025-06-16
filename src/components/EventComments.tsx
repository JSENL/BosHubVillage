
import { useAuth } from '@/hooks/useAuth';
import { useEventComments } from '@/hooks/useEventComments';
import { CommentsHeader } from './comments/CommentsHeader';
import { CommentForm } from './comments/CommentForm';
import { CommentsList } from './comments/CommentsList';
import { toast } from 'sonner';

interface EventCommentsProps {
  eventId: string;
}

const EventComments = ({ eventId }: EventCommentsProps) => {
  const { user, isAdmin } = useAuth();
  const { comments, loading, addComment, deleteComment } = useEventComments(eventId);

  const averageRating = comments.length > 0 
    ? comments.reduce((sum, comment) => sum + comment.rating, 0) / comments.length 
    : 0;

  const handleSubmitComment = async (commentText: string, rating: number, mediaFiles?: File[]) => {
    // For now, we'll ignore media files until storage is set up
    // TODO: Implement media file upload to Supabase storage
    if (mediaFiles && mediaFiles.length > 0) {
      toast.info('Media upload will be available soon!');
    }
    await addComment(commentText, rating);
  };

  const handleDeleteComment = async (commentId: string, isOwnComment: boolean) => {
    await deleteComment(commentId);
  };

  const handleReplyToComment = async (commentId: string, replyText: string) => {
    // For now, we'll add the reply as a regular comment with a mention
    // TODO: Implement proper nested replies in the database
    const replyComment = `@reply: ${replyText}`;
    await addComment(replyComment, 5);
    toast.success('Reply added!');
  };

  return (
    <div className="space-y-4">
      <CommentsHeader 
        commentsCount={comments.length} 
        averageRating={averageRating} 
      />

      <CommentForm 
        user={user} 
        onSubmitComment={handleSubmitComment}
      />

      <CommentsList
        comments={comments}
        loading={loading}
        user={user}
        isAdmin={isAdmin}
        onDeleteComment={handleDeleteComment}
        onReplyToComment={handleReplyToComment}
      />
    </div>
  );
};

export default EventComments;

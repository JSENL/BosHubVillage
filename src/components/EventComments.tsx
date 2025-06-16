
import { useAuth } from '@/hooks/useAuth';
import { useEventComments } from '@/hooks/useEventComments';
import { CommentsHeader } from './comments/CommentsHeader';
import { CommentForm } from './comments/CommentForm';
import { CommentsList } from './comments/CommentsList';

interface EventCommentsProps {
  eventId: string;
}

const EventComments = ({ eventId }: EventCommentsProps) => {
  const { user, isAdmin } = useAuth();
  const { comments, loading, addComment, deleteComment } = useEventComments(eventId);

  const averageRating = comments.length > 0 
    ? comments.reduce((sum, comment) => sum + comment.rating, 0) / comments.length 
    : 0;

  const handleSubmitComment = async (commentText: string, rating: number) => {
    await addComment(commentText, rating);
  };

  const handleDeleteComment = async (commentId: string, isOwnComment: boolean) => {
    await deleteComment(commentId);
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
      />
    </div>
  );
};

export default EventComments;

import { useAuth } from '@/hooks/useAuth';
import { useBusinessComments } from '@/hooks/useBusinessComments';
import { CommentsHeader } from './comments/CommentsHeader';
import { CommentForm } from './comments/CommentForm';
import { GenericCommentsList } from './comments/GenericCommentsList';

interface BusinessCommentsProps {
  businessId: string;
}

const BusinessComments = ({ businessId }: BusinessCommentsProps) => {
  const { user, isAdmin } = useAuth();
  const { comments, isLoading, addComment, deleteComment, replyToComment } = useBusinessComments(businessId);

  const averageRating = comments.length > 0 
    ? comments.reduce((sum, comment) => sum + comment.rating, 0) / comments.length 
    : 0;

  const handleSubmitComment = async (commentText: string, rating: number, mediaFiles?: File[]) => {
    await addComment(commentText, rating, mediaFiles);
  };

  const handleDeleteComment = async (commentId: string, isOwnComment: boolean) => {
    await deleteComment(commentId);
  };

  const handleReplyToComment = async (commentId: string, replyText: string) => {
    await replyToComment(commentId, replyText);
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

      <GenericCommentsList
        comments={comments}
        loading={isLoading}
        user={user}
        isAdmin={isAdmin}
        onDeleteComment={handleDeleteComment}
        onReplyToComment={handleReplyToComment}
      />
    </div>
  );
};

export default BusinessComments;
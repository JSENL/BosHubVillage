
import { useAuth } from '@/hooks/useAuth';
import { useNewsComments } from '@/hooks/useNewsComments';
import { CommentsHeader } from './comments/CommentsHeader';
import { CommentForm } from './comments/CommentForm';
import { GenericCommentsList } from './comments/GenericCommentsList';

interface NewsCommentsProps {
  newsId: string;
}

const NewsComments = ({ newsId }: NewsCommentsProps) => {
  const { user, isAdmin } = useAuth();
  const { comments, loading, addComment, deleteComment } = useNewsComments(newsId);

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
    await addComment(replyText, 5, undefined, commentId);
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
        loading={loading}
        user={user}
        isAdmin={isAdmin}
        onDeleteComment={handleDeleteComment}
        onReplyToComment={handleReplyToComment}
      />
    </div>
  );
};

export default NewsComments;

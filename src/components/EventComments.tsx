
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { MessageCircle, Trash2, User, Star, Shield } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useEventComments, EventComment } from '@/hooks/useEventComments';
import { formatDistanceToNow } from 'date-fns';

interface EventCommentsProps {
  eventId: string;
}

const EventComments = ({ eventId }: EventCommentsProps) => {
  const [newComment, setNewComment] = useState('');
  const [selectedRating, setSelectedRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, isAdmin } = useAuth();
  const { comments, loading, addComment, deleteComment } = useEventComments(eventId);

  // Sample names for demo purposes
  const sampleNames = [
    'Alice Johnson', 'Bob Smith', 'Carol Williams', 'David Brown', 'Emma Davis',
    'Frank Miller', 'Grace Wilson', 'Henry Moore', 'Ivy Taylor', 'Jack Anderson',
    'Clyde Everyman'
  ];

  const getDisplayName = (comment: EventComment, index: number) => {
    // Use actual profile name if available, otherwise use sample names
    if (comment.profiles?.full_name) {
      return comment.profiles.full_name;
    }
    if (comment.profiles?.email) {
      return comment.profiles.email;
    }
    // Use a sample name based on the comment index for demo
    return sampleNames[index % sampleNames.length] || 'Anonymous User';
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await addComment(newComment.trim(), selectedRating);
      setNewComment('');
      setSelectedRating(5);
    } catch (error) {
      // Error is handled in the hook
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string, isOwnComment: boolean) => {
    const confirmMessage = isOwnComment 
      ? 'Are you sure you want to delete this comment?' 
      : 'Are you sure you want to delete this user\'s comment? (Admin action)';
    
    if (window.confirm(confirmMessage)) {
      await deleteComment(commentId);
    }
  };

  const canDeleteComment = (comment: EventComment) => {
    // User can delete their own comments, or admin can delete any comment
    return user?.id === comment.user_id || isAdmin;
  };

  const renderStars = (rating: number, interactive: boolean = false, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating 
                ? 'fill-yellow-400 text-yellow-400' 
                : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
            onClick={interactive && onRatingChange ? () => onRatingChange(star) : undefined}
          />
        ))}
      </div>
    );
  };

  const averageRating = comments.length > 0 
    ? comments.reduce((sum, comment) => sum + comment.rating, 0) / comments.length 
    : 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <MessageCircle className="h-5 w-5 text-purple-600" />
          <h3 className="text-lg font-semibold">Comments ({comments.length})</h3>
        </div>
        {comments.length > 0 && (
          <div className="flex items-center space-x-2">
            {renderStars(Math.round(averageRating))}
            <span className="text-sm text-gray-600">
              ({averageRating.toFixed(1)} avg)
            </span>
          </div>
        )}
      </div>

      {/* Add Comment Form */}
      {user ? (
        <form onSubmit={handleSubmitComment} className="space-y-3">
          <div className="space-y-2">
            <label className="text-sm font-medium">Your Rating</label>
            {renderStars(selectedRating, true, setSelectedRating)}
          </div>
          <Textarea
            placeholder="Share your thoughts about this event..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[80px]"
            disabled={isSubmitting}
          />
          <Button 
            type="submit" 
            disabled={!newComment.trim() || isSubmitting}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            {isSubmitting ? 'Posting...' : 'Post Comment'}
          </Button>
        </form>
      ) : (
        <Card className="border-purple-100">
          <CardContent className="p-4 text-center">
            <p className="text-gray-600">Please sign in to leave a comment</p>
          </CardContent>
        </Card>
      )}

      {/* Comments List */}
      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-4">
            <p className="text-gray-500">Loading comments...</p>
          </div>
        ) : comments.length === 0 ? (
          <Card className="border-purple-100">
            <CardContent className="p-4 text-center">
              <MessageCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">No comments yet. Be the first to share your thoughts!</p>
            </CardContent>
          </Card>
        ) : (
          comments.map((comment: EventComment, index: number) => {
            const isOwnComment = user?.id === comment.user_id;
            const showDeleteButton = canDeleteComment(comment);
            
            return (
              <Card key={comment.id} className="border-purple-100">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-gray-800">
                            {getDisplayName(comment, index)}
                          </span>
                          <span className="text-sm text-gray-500">
                            {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                          </span>
                          {isAdmin && !isOwnComment && (
                            <Shield className="h-3 w-3 text-amber-500" title="Admin can delete this comment" />
                          )}
                        </div>
                        <div className="mb-2">
                          {renderStars(comment.rating)}
                        </div>
                        <p className="text-gray-700">{comment.comment}</p>
                      </div>
                    </div>
                    {showDeleteButton && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteComment(comment.id, isOwnComment)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        title={isOwnComment ? "Delete your comment" : "Delete comment (Admin)"}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default EventComments;

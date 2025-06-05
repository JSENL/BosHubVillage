
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { MessageCircle, Trash2, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useEventComments, EventComment } from '@/hooks/useEventComments';
import { formatDistanceToNow } from 'date-fns';

interface EventCommentsProps {
  eventId: string;
}

const EventComments = ({ eventId }: EventCommentsProps) => {
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { comments, loading, addComment, deleteComment } = useEventComments(eventId);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await addComment(newComment.trim());
      setNewComment('');
    } catch (error) {
      // Error is handled in the hook
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      await deleteComment(commentId);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <MessageCircle className="h-5 w-5 text-purple-600" />
        <h3 className="text-lg font-semibold">Comments ({comments.length})</h3>
      </div>

      {/* Add Comment Form */}
      {user ? (
        <form onSubmit={handleSubmitComment} className="space-y-3">
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
          comments.map((comment: EventComment) => (
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
                          {comment.profiles?.full_name || comment.profiles?.email || 'Anonymous User'}
                        </span>
                        <span className="text-sm text-gray-500">
                          {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-gray-700">{comment.comment}</p>
                    </div>
                  </div>
                  {user?.id === comment.user_id && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteComment(comment.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default EventComments;

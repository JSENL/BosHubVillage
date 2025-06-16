
import { Card, CardContent } from '@/components/ui/card';
import { MessageCircle } from 'lucide-react';
import { CommentItem } from './CommentItem';
import { EventComment } from '@/types/comments';
import { User } from '@supabase/supabase-js';

interface CommentsListProps {
  comments: EventComment[];
  loading: boolean;
  user: User | null;
  isAdmin: boolean;
  onDeleteComment: (commentId: string, isOwnComment: boolean) => Promise<void>;
  onReplyToComment?: (commentId: string, replyText: string) => Promise<void>;
}

export const CommentsList = ({ 
  comments, 
  loading, 
  user, 
  isAdmin, 
  onDeleteComment,
  onReplyToComment
}: CommentsListProps) => {
  if (loading) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-500">Loading comments...</p>
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <Card className="border-purple-100">
        <CardContent className="p-4 text-center">
          <MessageCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500">No comments yet. Be the first to share your thoughts!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {comments.map((comment: EventComment, index: number) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          index={index}
          user={user}
          isAdmin={isAdmin}
          onDeleteComment={onDeleteComment}
          onReplyToComment={onReplyToComment}
          userIsAdmin={isAdmin}
        />
      ))}
    </div>
  );
};

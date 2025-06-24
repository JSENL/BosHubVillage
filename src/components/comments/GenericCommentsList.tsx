
import { Card, CardContent } from '@/components/ui/card';
import { MessageCircle } from 'lucide-react';
import { CommentItem } from './CommentItem';
import { User } from '@supabase/supabase-js';

interface BaseComment {
  id: string;
  comment: string;
  created_at: string;
  updated_at: string;
  parent_comment_id?: string | null;
  rating: number;
  user_id: string;
  profiles?: {
    full_name: string | null;
    email: string;
    user_roles?: {
      role: string;
    }[];
  };
  replies?: BaseComment[];
}

interface GenericCommentsListProps<T extends BaseComment> {
  comments: T[];
  loading: boolean;
  user: User | null;
  isAdmin: boolean;
  onDeleteComment: (commentId: string, isOwnComment: boolean) => Promise<void>;
  onReplyToComment?: (commentId: string, replyText: string) => Promise<void>;
}

export const GenericCommentsList = <T extends BaseComment>({ 
  comments, 
  loading, 
  user, 
  isAdmin, 
  onDeleteComment,
  onReplyToComment
}: GenericCommentsListProps<T>) => {
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
      {comments.map((comment: T, index: number) => (
        <CommentItem
          key={comment.id}
          comment={comment as any} // Type assertion for compatibility with CommentItem
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

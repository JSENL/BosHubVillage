import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Trash2, User, Shield, Reply, Image, Video } from 'lucide-react';
import { StarRating } from './StarRating';
import { EventComment } from '@/hooks/useEventComments';
import { formatDistanceToNow } from 'date-fns';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface CommentItemProps {
  comment: EventComment;
  index: number;
  user: SupabaseUser | null;
  isAdmin: boolean;
  onDeleteComment: (commentId: string, isOwnComment: boolean) => Promise<void>;
  onReplyToComment?: (commentId: string, replyText: string) => Promise<void>;
  userIsAdmin?: boolean;
}

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

const isCommentByAdmin = (comment: EventComment) => {
  // Check if the user has admin role from the actual user_roles data
  return comment.user_roles?.some(role => role.role === 'admin') || false;
};

export const CommentItem = ({ 
  comment, 
  index, 
  user, 
  isAdmin, 
  onDeleteComment,
  onReplyToComment,
  userIsAdmin = false
}: CommentItemProps) => {
  const isOwnComment = user?.id === comment.user_id;
  const canDeleteComment = isOwnComment || isAdmin;
  const commentByAdmin = isCommentByAdmin(comment);

  const handleDeleteComment = async () => {
    const confirmMessage = isOwnComment 
      ? 'Are you sure you want to delete this comment?' 
      : 'Are you sure you want to delete this user\'s comment? (Admin action)';
    
    if (window.confirm(confirmMessage)) {
      await onDeleteComment(comment.id, isOwnComment);
    }
  };

  const handleReply = () => {
    const replyText = prompt('Enter your reply:');
    if (replyText && onReplyToComment) {
      onReplyToComment(comment.id, replyText);
    }
  };

  return (
    <Card className="border-purple-100">
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
                {commentByAdmin && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                    <Shield className="h-3 w-3 mr-1" />
                    Admin
                  </span>
                )}
                <span className="text-sm text-gray-500">
                  {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                </span>
                {isAdmin && !isOwnComment && (
                  <div className="relative group">
                    <Shield className="h-3 w-3 text-amber-500" />
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      Admin can delete this comment
                    </div>
                  </div>
                )}
              </div>
              <div className="mb-2">
                <StarRating rating={comment.rating} />
              </div>
              <p className="text-gray-700 mb-2">{comment.comment}</p>
              
              {/* Media placeholder - will be implemented when media URLs are stored */}
              <div className="flex space-x-2 mb-2">
                {/* Placeholder for media attachments */}
              </div>

              {/* Action buttons */}
              <div className="flex items-center space-x-2">
                {user && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleReply}
                    className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                  >
                    <Reply className="h-3 w-3 mr-1" />
                    Reply
                  </Button>
                )}
              </div>
            </div>
          </div>
          {canDeleteComment && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDeleteComment}
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

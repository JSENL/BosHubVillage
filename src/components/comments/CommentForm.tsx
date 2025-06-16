
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { StarRating } from './StarRating';
import { User } from '@supabase/supabase-js';

interface CommentFormProps {
  user: User | null;
  onSubmitComment: (comment: string, rating: number) => Promise<void>;
}

export const CommentForm = ({ user, onSubmitComment }: CommentFormProps) => {
  const [newComment, setNewComment] = useState('');
  const [selectedRating, setSelectedRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSubmitComment(newComment.trim(), selectedRating);
      setNewComment('');
      setSelectedRating(5);
    } catch (error) {
      // Error is handled in the parent component
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <Card className="border-purple-100">
        <CardContent className="p-4 text-center">
          <p className="text-gray-600">Please sign in to leave a comment</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmitComment} className="space-y-3">
      <div className="space-y-2">
        <label className="text-sm font-medium">Your Rating</label>
        <StarRating rating={selectedRating} interactive onRatingChange={setSelectedRating} />
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
  );
};

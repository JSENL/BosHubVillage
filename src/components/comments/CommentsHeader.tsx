
import { MessageCircle } from 'lucide-react';
import { StarRating } from './StarRating';

interface CommentsHeaderProps {
  commentsCount: number;
  averageRating: number;
}

export const CommentsHeader = ({ commentsCount, averageRating }: CommentsHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-2">
        <MessageCircle className="h-5 w-5 text-caribbean-teal" />
        <h3 className="text-lg font-semibold">Comments ({commentsCount})</h3>
      </div>
      {commentsCount > 0 && (
        <div className="flex items-center space-x-2">
          <StarRating rating={Math.round(averageRating)} />
          <span className="text-sm text-gray-600">
            ({averageRating.toFixed(1)} avg)
          </span>
        </div>
      )}
    </div>
  );
};

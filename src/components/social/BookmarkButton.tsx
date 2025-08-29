import { Button } from '@/components/ui/button';
import { useBookmarks, BookmarkItemType } from '@/hooks/useBookmarks';
import { useAuth } from '@/hooks/useAuth';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BookmarkButtonProps {
  itemType: BookmarkItemType;
  itemId: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
  showText?: boolean;
  className?: string;
}

export const BookmarkButton = ({ 
  itemType, 
  itemId, 
  size = 'md',
  variant = 'outline',
  showText = false,
  className 
}: BookmarkButtonProps) => {
  const { user } = useAuth();
  const { useIsBookmarked, addBookmark, removeBookmark, isAddingBookmark, isRemovingBookmark } = useBookmarks();
  const { data: isBookmarked } = useIsBookmarked(itemType, itemId);

  if (!user) return null;

  const handleBookmarkClick = () => {
    if (isBookmarked) {
      removeBookmark({ itemType, itemId });
    } else {
      addBookmark({ itemType, itemId });
    }
  };

  const isLoading = isAddingBookmark || isRemovingBookmark;

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-9 w-9',
    lg: 'h-10 w-10',
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  return (
    <Button
      onClick={handleBookmarkClick}
      disabled={isLoading}
      variant={variant}
      size={showText ? 'sm' : 'icon'}
      className={cn(
        !showText && sizeClasses[size],
        isBookmarked && 'text-yellow-600 hover:text-yellow-700',
        className
      )}
    >
      {isBookmarked ? (
        <BookmarkCheck className={iconSizes[size]} />
      ) : (
        <Bookmark className={iconSizes[size]} />
      )}
      {showText && (
        <span className="ml-2">
          {isLoading 
            ? (isBookmarked ? 'Removing...' : 'Saving...') 
            : (isBookmarked ? 'Bookmarked' : 'Bookmark')
          }
        </span>
      )}
    </Button>
  );
};
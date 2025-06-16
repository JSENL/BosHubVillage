
import { EventComment } from '@/types/comments';

export const organizeComments = (flatComments: EventComment[]): EventComment[] => {
  const commentMap = new Map<string, EventComment>();
  const rootComments: EventComment[] = [];

  // First pass: create map and initialize replies array
  flatComments.forEach(comment => {
    commentMap.set(comment.id, { ...comment, replies: [] });
  });

  // Second pass: organize into tree structure
  flatComments.forEach(comment => {
    const mappedComment = commentMap.get(comment.id)!;
    
    if (comment.parent_comment_id) {
      const parent = commentMap.get(comment.parent_comment_id);
      if (parent) {
        parent.replies!.push(mappedComment);
      }
    } else {
      rootComments.push(mappedComment);
    }
  });

  return rootComments;
};

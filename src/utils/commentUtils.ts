
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

export const organizeComments = <T extends BaseComment>(flatComments: T[]): T[] => {
  const commentMap = new Map<string, T>();
  const rootComments: T[] = [];

  // First pass: create map and initialize replies array
  flatComments.forEach(comment => {
    commentMap.set(comment.id, { ...comment, replies: [] } as T);
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

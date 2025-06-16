
export interface CommentMedia {
  id: string;
  file_path: string;
  file_name: string;
  file_type: string;
  file_size: number;
}

export interface EventComment {
  id: string;
  event_id: string;
  user_id: string;
  comment: string;
  rating: number;
  created_at: string;
  updated_at: string;
  parent_comment_id?: string | null;
  profiles?: {
    full_name: string | null;
    email: string;
    user_roles?: {
      role: string;
    }[];
  };
  comment_media?: CommentMedia[];
  replies?: EventComment[];
}

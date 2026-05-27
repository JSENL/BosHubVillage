import { supabase } from '@/integrations/supabase/client';
import { uploadMediaFiles } from '@/services/mediaUploadService';

const MAX_BYTES = 10 * 1024 * 1024;

/** Upload a single cover image to comment-media and return its public URL. */
export async function uploadCoverImage(file: File, userId: string): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Cover must be an image file');
  }
  if (file.size > MAX_BYTES) {
    throw new Error('Cover image must be 10MB or smaller');
  }

  const [uploaded] = await uploadMediaFiles([file], userId);
  const { data: urlData } = supabase.storage.from('comment-media').getPublicUrl(uploaded.path);
  const publicUrl = urlData?.publicUrl;
  if (!publicUrl) {
    throw new Error('Could not resolve cover image URL');
  }
  return publicUrl;
}

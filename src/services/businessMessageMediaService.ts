import { supabase } from '@/integrations/supabase/client';

export interface MediaUploadResult {
  file_path: string;
  file_name: string;
  file_type: string;
  file_size: number;
}

export const uploadBusinessMessageMedia = async (
  file: File,
  userId: string
): Promise<MediaUploadResult> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `${userId}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('business-message-media')
    .upload(filePath, file);

  if (uploadError) {
    throw new Error(`Upload failed: ${uploadError.message}`);
  }

  return {
    file_path: filePath,
    file_name: file.name,
    file_type: file.type,
    file_size: file.size
  };
};

export const saveMediaRecord = async (
  businessMessageId: string,
  mediaData: MediaUploadResult
) => {
  const { error } = await supabase
    .from('business_message_media')
    .insert({
      business_message_id: businessMessageId,
      file_name: mediaData.file_name,
      file_path: mediaData.file_path,
      file_type: mediaData.file_type,
      file_size: mediaData.file_size
    });

  if (error) {
    throw new Error(`Failed to save media record: ${error.message}`);
  }
};

export const getMediaUrl = (filePath: string): string => {
  const { data } = supabase.storage
    .from('business-message-media')
    .getPublicUrl(filePath);
  
  return data.publicUrl;
};

export const deleteMedia = async (filePath: string) => {
  const { error } = await supabase.storage
    .from('business-message-media')
    .remove([filePath]);

  if (error) {
    throw new Error(`Failed to delete media: ${error.message}`);
  }
};
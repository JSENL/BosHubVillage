
import { supabase } from '@/integrations/supabase/client';

export interface UploadedFile {
  path: string;
  name: string;
  type: string;
  size: number;
}

export const uploadMediaFiles = async (files: File[], userId: string): Promise<UploadedFile[]> => {
  const uploadedFiles: UploadedFile[] = [];
  
  for (const file of files) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('comment-media')
      .upload(fileName, file);

    if (error) throw error;
    
    uploadedFiles.push({
      path: data.path,
      name: file.name,
      type: file.type,
      size: file.size
    });
  }
  
  return uploadedFiles;
};

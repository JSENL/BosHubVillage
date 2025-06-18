
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { NewsSubmission } from '@/types/submissions';

export const useNewsSubmissions = () => {
  return useQuery({
    queryKey: ['news-submissions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('news_submissions')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as NewsSubmission[];
    },
  });
};

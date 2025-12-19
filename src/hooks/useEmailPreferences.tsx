import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/components/ui/use-toast';

interface EmailPreferences {
  id: string;
  user_id: string;
  weekly_digest: boolean;
  digest_day: string;
  last_digest_sent_at: string | null;
  created_at: string;
  updated_at: string;
}

export const useEmailPreferences = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: preferences, isLoading } = useQuery({
    queryKey: ['email-preferences', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from('email_preferences')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return data as EmailPreferences | null;
    },
    enabled: !!user?.id,
  });

  const upsertPreferencesMutation = useMutation({
    mutationFn: async (updates: {
      weekly_digest?: boolean;
      digest_day?: string;
    }) => {
      if (!user?.id) throw new Error('Not authenticated');

      // Check if preferences exist
      const { data: existing } = await supabase
        .from('email_preferences')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (existing) {
        // Update existing
        const { data, error } = await supabase
          .from('email_preferences')
          .update(updates)
          .eq('user_id', user.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        // Insert new
        const { data, error } = await supabase
          .from('email_preferences')
          .insert({
            user_id: user.id,
            ...updates,
          })
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-preferences', user?.id] });
      toast({
        title: "Preferences saved",
        description: "Your email preferences have been updated.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save preferences. Please try again.",
        variant: "destructive",
      });
    },
  });

  return {
    preferences,
    isLoading,
    updatePreferences: upsertPreferencesMutation.mutate,
    isUpdating: upsertPreferencesMutation.isPending,
  };
};

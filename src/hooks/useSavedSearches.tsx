import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/components/ui/use-toast';

interface SearchCriteria {
  searchTerm?: string;
  selectedCategory?: string;
  selectedNeighborhood?: string;
  selectedVillage?: string;
  selectedType?: string;
}

interface SavedSearch {
  id: string;
  user_id: string;
  name: string;
  search_criteria: SearchCriteria;
  notify_email: boolean;
  notify_in_app: boolean;
  last_checked_at: string;
  created_at: string;
  updated_at: string;
}

export const useSavedSearches = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: savedSearches, isLoading } = useQuery({
    queryKey: ['saved-searches', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('saved_searches')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as SavedSearch[];
    },
    enabled: !!user?.id,
  });

  const saveSearchMutation = useMutation({
    mutationFn: async ({
      name,
      criteria,
      notifyEmail = true,
      notifyInApp = true,
    }: {
      name: string;
      criteria: SearchCriteria;
      notifyEmail?: boolean;
      notifyInApp?: boolean;
    }) => {
      if (!user?.id) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('saved_searches')
        .insert([{
          user_id: user.id,
          name,
          search_criteria: JSON.parse(JSON.stringify(criteria)),
          notify_email: notifyEmail,
          notify_in_app: notifyInApp,
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-searches', user?.id] });
      toast({
        title: "Search saved",
        description: "You'll be notified when new matches are found.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save search. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateSearchMutation = useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: {
        name?: string;
        notify_email?: boolean;
        notify_in_app?: boolean;
        search_criteria?: SearchCriteria;
      };
    }) => {
      if (!user?.id) throw new Error('Not authenticated');

      const dbUpdates: Record<string, unknown> = {};
      if (updates.name !== undefined) dbUpdates.name = updates.name;
      if (updates.notify_email !== undefined) dbUpdates.notify_email = updates.notify_email;
      if (updates.notify_in_app !== undefined) dbUpdates.notify_in_app = updates.notify_in_app;
      if (updates.search_criteria !== undefined) dbUpdates.search_criteria = updates.search_criteria;

      const { data, error } = await supabase
        .from('saved_searches')
        .update(dbUpdates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-searches', user?.id] });
      toast({
        title: "Search updated",
        description: "Your saved search has been updated.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update search. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteSearchMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!user?.id) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('saved_searches')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-searches', user?.id] });
      toast({
        title: "Search deleted",
        description: "Your saved search has been removed.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete search. Please try again.",
        variant: "destructive",
      });
    },
  });

  return {
    savedSearches: savedSearches || [],
    isLoading,
    saveSearch: saveSearchMutation.mutate,
    updateSearch: updateSearchMutation.mutate,
    deleteSearch: deleteSearchMutation.mutate,
    isSaving: saveSearchMutation.isPending,
    isUpdating: updateSearchMutation.isPending,
    isDeleting: deleteSearchMutation.isPending,
  };
};

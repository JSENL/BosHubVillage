import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useToast } from "@/components/ui/use-toast";

type NotificationPreferenceRow =
  import("@/integrations/supabase/types").Database["public"]["Tables"]["notification_preferences"]["Row"];

type NotificationPreferenceUpdate =
  import("@/integrations/supabase/types").Database["public"]["Tables"]["notification_preferences"]["Update"];

const defaultPreferences: Omit<NotificationPreferenceRow, "id" | "created_at" | "updated_at" | "user_id"> = {
  instant_email: true,
  instant_in_app: true,
  recommendations_enabled: true,
  subscribed_item_types: ["event", "news", "local-resource"],
  neighborhoods: [],
  keywords: [],
};

export const useNotificationPreferences = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: preferences, isLoading } = useQuery({
    queryKey: ["notification-preferences", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from("notification_preferences")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      if (error) throw error;
      return data as NotificationPreferenceRow | null;
    },
    enabled: !!user?.id,
  });

  const upsertMutation = useMutation({
    mutationFn: async (updates: NotificationPreferenceUpdate) => {
      if (!user?.id) throw new Error("Not authenticated");

      if (preferences?.id) {
        const { data, error } = await supabase
          .from("notification_preferences")
          .update(updates)
          .eq("user_id", user.id)
          .select("*")
          .single();
        if (error) throw error;
        return data;
      }

      const { data, error } = await supabase
        .from("notification_preferences")
        .insert({
          user_id: user.id,
          ...defaultPreferences,
          ...updates,
        })
        .select("*")
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notification-preferences", user?.id] });
      toast({
        title: "Notification preferences updated",
        description: "We'll keep your alerts personalized.",
      });
    },
    onError: () => {
      toast({
        title: "Could not update preferences",
        description: "Please try again.",
        variant: "destructive",
      });
    },
  });

  return {
    preferences,
    defaults: defaultPreferences,
    isLoading,
    updatePreferences: upsertMutation.mutate,
    isUpdating: upsertMutation.isPending,
  };
};


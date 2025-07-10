
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export const useBusinessOperations = (onUpdate: () => void) => {
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const handleDeleteBusiness = async (businessId: string) => {
    setActionLoading(businessId);
    try {
      const { error } = await supabase
        .from('business')
        .delete()
        .eq('id', businessId);

      if (error) throw error;

      toast.success('Business deleted successfully');
      onUpdate();
    } catch (error: any) {
      console.error('Error deleting business:', error);
      toast.error('Failed to delete business');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteAllBusinesses = async () => {
    setActionLoading('all');
    try {
      const { error } = await supabase
        .from('business')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');

      if (error) throw error;

      toast.success('All business deleted successfully');
      onUpdate();
    } catch (error: any) {
      console.error('Error deleting all business:', error);
      toast.error('Failed to delete all business');
    } finally {
      setActionLoading(null);
    }
  };

  return {
    handleDeleteBusiness,
    handleDeleteAllBusinesses,
    actionLoading
  };
};

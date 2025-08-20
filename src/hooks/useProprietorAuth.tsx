import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

export const useProprietorAuth = () => {
  const { user, loading: authLoading } = useAuth();
  const [isProprietor, setIsProprietor] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkProprietorRole = async () => {
      if (!user) {
        setIsProprietor(false);
        setLoading(false);
        return;
      }

      try {
        const { data } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'proprietor')
          .single();
        
        setIsProprietor(!!data);
      } catch (error) {
        setIsProprietor(false);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      checkProprietorRole();
    }
  }, [user, authLoading]);

  return { isProprietor, loading: authLoading || loading };
};
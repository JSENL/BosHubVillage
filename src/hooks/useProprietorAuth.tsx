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
        console.log('👤 No user, not checking proprietor role');
        setIsProprietor(false);
        setLoading(false);
        return;
      }

      console.log('🔍 Checking proprietor role for user:', user.id);

      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'proprietor')
          .single();
        
        console.log('📋 Proprietor role check result:', { data, error });
        setIsProprietor(!!data);
      } catch (error) {
        console.log('❌ Error checking proprietor role:', error);
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
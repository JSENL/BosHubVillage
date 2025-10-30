
import { useState, useEffect, createContext, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { cleanupAuthState } from '@/utils/authCleanup';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  

  useEffect(() => {
    // Set up auth state listener with automatic token refresh
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔐 Auth event:', event);
        
        // Handle token refresh
        if (event === 'TOKEN_REFRESHED') {
          console.log('✅ Token refreshed successfully');
        }
        
        // Handle expired token
        if (event === 'SIGNED_OUT' || !session) {
          console.log('🚪 User signed out or session expired');
          cleanupAuthState();
          setSession(null);
          setUser(null);
          setIsAdmin(false);
          setLoading(false);
          return;
        }
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Check admin status asynchronously
          setTimeout(async () => {
            try {
              const { data: roles, error } = await supabase
                .from('user_roles')
                .select('role')
                .eq('user_id', session.user.id);
              
              // If we get a JWT error, the session is invalid
              if (error?.code === 'PGRST301' || error?.message?.includes('JWT')) {
                console.error('❌ Session expired, forcing sign out');
                cleanupAuthState();
                await supabase.auth.signOut({ scope: 'global' });
                setSession(null);
                setUser(null);
                setIsAdmin(false);
                return;
              }
              
              const userRoles = roles?.map(r => r.role) || [];
              setIsAdmin(userRoles.includes('admin'));
            } catch (error) {
              console.error('Error fetching user roles:', error);
              setIsAdmin(false);
            }
          }, 0);
        } else {
          setIsAdmin(false);
        }
        
        setLoading(false);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      // Check if session exists but might be expired
      if (session?.user) {
        try {
          // Test the session with a simple query
          const { error } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', session.user.id)
            .limit(1);
          
          // If we get a JWT error, the session is expired
          if (error?.code === 'PGRST301' || error?.message?.includes('JWT')) {
            console.error('❌ Expired session detected on load, cleaning up');
            cleanupAuthState();
            await supabase.auth.signOut({ scope: 'global' });
            setSession(null);
            setUser(null);
            setIsAdmin(false);
            setLoading(false);
            return;
          }
          
          // Session is valid, proceed normally
          setSession(session);
          setUser(session.user);
          const { data: roles } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', session.user.id);
          const userRoles = roles?.map(r => r.role) || [];
          setIsAdmin(userRoles.includes('admin'));
        } catch (error) {
          console.error('Error validating initial session:', error);
          cleanupAuthState();
          setSession(null);
          setUser(null);
          setIsAdmin(false);
        }
      }
      setLoading(false);
    }).catch((error) => {
      console.error('Error getting initial session:', error);
      cleanupAuthState();
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      // Clean up auth state first
      cleanupAuthState();
      // Attempt global sign out
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Ignore errors from global sign out
      }
      // Hard refresh to ensure clean state
      window.location.href = '/auth';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, isAdmin, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

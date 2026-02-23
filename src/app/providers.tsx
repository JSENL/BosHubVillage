'use client';

import '@/i18n/config';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/hooks/useAuth';
import { MapboxProvider } from '@/contexts/MapboxContext';
import { FilterProvider } from '@/contexts/FilterContext';
import { AppStateProvider } from '@/contexts/AppStateProvider';
import { supabase } from '@/integrations/supabase/client';
import { useState } from 'react';

// Configure React Query
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: (failureCount, error: unknown) => {
          const err = error as { code?: string; message?: string };
          if (err?.code === 'PGRST301' || err?.message?.includes('JWT')) {
            return false;
          }
          return failureCount < 2;
        },
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
      },
    },
  });
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(makeQueryClient);

  if (typeof window !== 'undefined') {
    supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
        queryClient.clear();
      }
    });
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <MapboxProvider>
            <FilterProvider>
              <AppStateProvider>
                <Toaster />
                <Sonner />
                {children}
              </AppStateProvider>
            </FilterProvider>
          </MapboxProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

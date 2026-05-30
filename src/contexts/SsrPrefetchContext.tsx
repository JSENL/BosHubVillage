import { createContext, useContext, type ReactNode } from 'react';
import type { SsrPrefetchPayload } from '@/lib/ssr/prefetchTypes';

const SsrPrefetchContext = createContext<SsrPrefetchPayload | null>(null);

export function SsrPrefetchProvider({
  value,
  children,
}: {
  value: SsrPrefetchPayload | null;
  children: ReactNode;
}) {
  return (
    <SsrPrefetchContext.Provider value={value}>{children}</SsrPrefetchContext.Provider>
  );
}

export function useSsrPrefetch(): SsrPrefetchPayload | null {
  return useContext(SsrPrefetchContext);
}

export function readSsrPrefetchScript(): SsrPrefetchPayload | null {
  if (typeof window === 'undefined') return null;
  const win = window as Window & { __SSR_PREFETCH__?: SsrPrefetchPayload };
  const data = win.__SSR_PREFETCH__;
  if (data !== undefined) {
    delete win.__SSR_PREFETCH__;
  }
  return data ?? null;
}

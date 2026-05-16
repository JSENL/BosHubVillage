/** @vitest-environment jsdom */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PublishedNewsTable } from '@/components/admin/PublishedNewsTable';
import type { News } from '@/types/news';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (_key: string, opts?: { defaultValue?: string }) => opts?.defaultValue ?? _key,
  }),
}));

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

const { eqMock, fromMock } = vi.hoisted(() => {
  const eqMock = vi.fn(() => Promise.resolve({ error: null as null }));
  const deleteMock = vi.fn(() => ({ eq: eqMock }));
  const fromMock = vi.fn(() => ({ delete: deleteMock }));
  return { eqMock, fromMock };
});

vi.mock('@/integrations/supabase/client', () => ({
  supabase: { from: fromMock },
}));

const baseArticle = (overrides: Partial<News> = {}): News => ({
  id: 'news-1',
  title: 'Culture piece',
  content: 'Preview text',
  location: 'Boston',
  date_posted: '2025-06-01T12:00:00.000Z',
  source: 'Community',
  villages: [],
  created_at: '2025-06-01T12:00:00.000Z',
  updated_at: '2025-06-01T12:00:00.000Z',
  ...overrides,
});

function renderTable(news: News[], onUpdate: () => void | Promise<void>) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');
  const result = render(
    <QueryClientProvider client={queryClient}>
      <PublishedNewsTable news={news} onUpdate={onUpdate} />
    </QueryClientProvider>,
  );
  return { ...result, queryClient, invalidateSpy };
}

describe('PublishedNewsTable delete', () => {
  beforeEach(() => {
    vi.stubGlobal('confirm', vi.fn(() => true));
    eqMock.mockClear();
    fromMock.mockClear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('after confirm, deletes in Supabase, invalidates news cache, and runs onUpdate', async () => {
    const onUpdate = vi.fn().mockResolvedValue(undefined);
    const article = baseArticle();
    const { invalidateSpy } = renderTable([article], onUpdate);

    fireEvent.click(screen.getByRole('button', { name: /^delete$/i }));

    await waitFor(() => {
      expect(fromMock).toHaveBeenCalledWith('news');
    });
    expect(eqMock).toHaveBeenCalledWith('id', 'news-1');

    await waitFor(() => {
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['news'] });
    });
    await waitFor(() => {
      expect(onUpdate).toHaveBeenCalledTimes(1);
    });
  });

  it('does not call delete when confirm is cancelled', async () => {
    vi.stubGlobal('confirm', vi.fn(() => false));
    const onUpdate = vi.fn();
    renderTable([baseArticle()], onUpdate);

    fireEvent.click(screen.getByRole('button', { name: /^delete$/i }));

    await new Promise((r) => setTimeout(r, 50));
    expect(eqMock).not.toHaveBeenCalled();
    expect(onUpdate).not.toHaveBeenCalled();
  });
});

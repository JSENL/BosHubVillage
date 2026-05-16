/** @vitest-environment jsdom */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PublishedNewsTable } from '@/components/admin/PublishedNewsTable';
import type { News } from '@/types/news';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, opts?: { defaultValue?: string }) => {
      const map: Record<string, string> = {
        'navigation.news': 'Culture',
      };
      return map[key] ?? opts?.defaultValue ?? key;
    },
  }),
}));

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

const { eqMock, inMock, fromMock } = vi.hoisted(() => {
  const eqMock = vi.fn(() => Promise.resolve({ error: null as null }));
  const inMock = vi.fn(() => Promise.resolve({ error: null as null }));
  const deleteMock = vi.fn(() => ({ eq: eqMock, in: inMock }));
  const fromMock = vi.fn(() => ({ delete: deleteMock }));
  return { eqMock, inMock, fromMock };
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
    inMock.mockClear();
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

  it('removes the article row from the table (UI) immediately after delete succeeds, before parent refetch', async () => {
    let resolveUpdate!: () => void;
    const onUpdate = () =>
      new Promise<void>((resolve) => {
        resolveUpdate = resolve;
      });

    const title = 'Culture headline unique xyz-123';
    renderTable([baseArticle({ title })], onUpdate);

    expect(screen.getByText(title)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /^delete$/i }));

    await waitFor(() => {
      expect(screen.queryByText(title)).not.toBeInTheDocument();
    });

    expect(screen.getByText(/published culture \(0\)/i)).toBeInTheDocument();

    await act(async () => {
      resolveUpdate();
    });
  });

  it('only removes the deleted row when multiple articles are listed', async () => {
    const onUpdate = vi.fn().mockResolvedValue(undefined);
    const keepTitle = 'Keep this culture story';
    renderTable(
      [
        baseArticle({ id: 'a', title: 'Delete me' }),
        baseArticle({ id: 'b', title: keepTitle }),
      ],
      onUpdate,
    );

    const deleteButtons = screen.getAllByRole('button', { name: /^delete$/i });
    fireEvent.click(deleteButtons[0]!);

    await waitFor(() => {
      expect(screen.queryByText('Delete me')).not.toBeInTheDocument();
    });
    expect(screen.getByText(keepTitle)).toBeInTheDocument();
    expect(screen.getByText(/published culture \(1\)/i)).toBeInTheDocument();
  });
});

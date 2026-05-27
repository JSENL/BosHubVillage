import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AdminContentCoverImageSection } from './AdminContentCoverImageSection';
import { uploadCoverImage } from '@/lib/coverImageUpload';

const { updateEq, updateMock, fromMock } = vi.hoisted(() => {
  const eq = vi.fn().mockResolvedValue({ error: null });
  const upd = vi.fn(() => ({ eq }));
  const from = vi.fn(() => ({ update: upd }));
  return { updateEq: eq, updateMock: upd, fromMock: from };
});

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({ user: { id: 'admin-user-id' } }),
}));

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: fromMock,
  },
}));

vi.mock('@/lib/coverImageUpload', () => ({
  uploadCoverImage: vi.fn(),
}));

function renderHero(
  props: React.ComponentProps<typeof AdminContentCoverImageSection>
) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={client}>
      <AdminContentCoverImageSection {...props} />
    </QueryClientProvider>
  );
}

describe('AdminDialogHeroEditor (admin dashboard cover upload)', () => {
  const onImageUrlChange = vi.fn();
  const onPersisted = vi.fn();

  beforeEach(() => {
    vi.mocked(uploadCoverImage).mockReset();
    fromMock.mockClear();
    updateMock.mockClear();
    updateEq.mockClear();
    onImageUrlChange.mockClear();
    onPersisted.mockClear();
    updateEq.mockResolvedValue({ error: null });
  });

  it('uploads an image, persists image_url to events, and notifies parent', async () => {
    vi.mocked(uploadCoverImage).mockResolvedValue(
      'https://test.supabase.co/storage/comment-media/admin-user-id/hero.png'
    );

    renderHero({
      table: 'events',
      recordId: 'evt-42',
      imageUrl: null,
      onImageUrlChange,
      onPersisted,
    });

    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    expect(fileInput).toBeTruthy();

    const file = new File(['x'], 'hero.png', { type: 'image/png' });
    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(uploadCoverImage).toHaveBeenCalledWith(file, 'admin-user-id');
    });

    await waitFor(() => {
      expect(updateMock).toHaveBeenCalled();
    });

    expect(fromMock).toHaveBeenCalledWith('events');

    const updatePayload = updateMock.mock.calls[0][0];
    expect(updatePayload.image_url).toBe(
      'https://test.supabase.co/storage/comment-media/admin-user-id/hero.png'
    );
    expect(updateEq).toHaveBeenCalledWith('id', 'evt-42');

    expect(onImageUrlChange).toHaveBeenCalledWith(updatePayload.image_url);
    expect(onPersisted).toHaveBeenCalled();
  });

  it('uploads an image and persists image_url to news', async () => {
    vi.mocked(uploadCoverImage).mockResolvedValue(
      'https://test.supabase.co/storage/comment-media/admin-user-id/cover.jpg'
    );

    renderHero({
      table: 'news',
      recordId: 'news-99',
      imageUrl: null,
      onImageUrlChange,
      onPersisted,
    });

    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    const file = new File(['y'], 'cover.jpg', { type: 'image/jpeg' });
    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(updateMock).toHaveBeenCalled();
    });

    expect(fromMock).toHaveBeenCalledWith('news');

    expect(updateMock.mock.calls[0][0].image_url).toContain(
      'admin-user-id/cover.jpg'
    );
    expect(updateEq).toHaveBeenCalledWith('id', 'news-99');
  });
});

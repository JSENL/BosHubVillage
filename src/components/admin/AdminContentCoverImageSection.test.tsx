import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { AdminContentCoverImageSection } from './AdminContentCoverImageSection';
import { uploadMediaFiles } from '@/services/mediaUploadService';

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
    storage: {
      from: vi.fn(() => ({
        getPublicUrl: vi.fn((path: string) => ({
          data: { publicUrl: `https://test.supabase.co/storage/comment-media/${path}` },
        })),
      })),
    },
  },
}));

vi.mock('@/services/mediaUploadService', () => ({
  uploadMediaFiles: vi.fn(),
}));

describe('AdminContentCoverImageSection (admin dashboard cover upload)', () => {
  const onImageUrlChange = vi.fn();
  const onPersisted = vi.fn();

  beforeEach(() => {
    vi.mocked(uploadMediaFiles).mockReset();
    fromMock.mockClear();
    updateMock.mockClear();
    updateEq.mockClear();
    onImageUrlChange.mockClear();
    onPersisted.mockClear();
    updateEq.mockResolvedValue({ error: null });
  });

  it('uploads an image, persists image_url to events, and notifies parent', async () => {
    vi.mocked(uploadMediaFiles).mockResolvedValue([
      {
        path: 'admin-user-id/hero.png',
        name: 'hero.png',
        type: 'image/png',
        size: 1200,
      },
    ]);

    render(
      <AdminContentCoverImageSection
        table="events"
        recordId="evt-42"
        imageUrl={null}
        onImageUrlChange={onImageUrlChange}
        onPersisted={onPersisted}
      />
    );

    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    expect(fileInput).toBeTruthy();

    const file = new File(['x'], 'hero.png', { type: 'image/png' });
    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(uploadMediaFiles).toHaveBeenCalledWith([expect.any(File)], 'admin-user-id');
    });

    await waitFor(() => {
      expect(updateMock).toHaveBeenCalled();
    });

    expect(fromMock).toHaveBeenCalledWith('events');

    const updatePayload = updateMock.mock.calls[0][0];
    expect(updatePayload.image_url).toBe(
      'https://test.supabase.co/storage/comment-media/admin-user-id/hero.png'
    );
    expect(updatePayload.updated_at).toEqual(expect.any(String));
    expect(updateEq).toHaveBeenCalledWith('id', 'evt-42');

    expect(onImageUrlChange).toHaveBeenCalledWith(updatePayload.image_url);
    expect(onPersisted).toHaveBeenCalled();
  });

  it('uploads an image and persists image_url to news', async () => {
    vi.mocked(uploadMediaFiles).mockResolvedValue([
      {
        path: 'admin-user-id/cover.jpg',
        name: 'cover.jpg',
        type: 'image/jpeg',
        size: 800,
      },
    ]);

    render(
      <AdminContentCoverImageSection
        table="news"
        recordId="news-99"
        imageUrl={null}
        onImageUrlChange={onImageUrlChange}
        onPersisted={onPersisted}
      />
    );

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

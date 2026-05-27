import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useEventSubmissionCreation } from './useEventSubmissionCreation';
import { uploadMediaFiles } from '@/services/mediaUploadService';

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({ user: { id: 'user-1' } }),
}));

vi.mock('@/hooks/useGeocoding', () => ({
  useGeocoding: () => ({
    geocode: vi.fn().mockResolvedValue({ latitude: 42.36, longitude: -71.06 }),
    isReady: true,
  }),
}));

const submissionUpdate = vi.fn(() => ({
  eq: vi.fn().mockResolvedValue({ error: null }),
}));

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn((table: string) => {
      if (table === 'event_submissions') {
        return {
          insert: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: { id: 'evt-sub-1' },
                error: null,
              }),
            }),
          }),
          update: submissionUpdate,
        };
      }
      if (table === 'event_submissions_media') {
        return {
          insert: vi.fn().mockResolvedValue({ error: null }),
        };
      }
      return { insert: vi.fn().mockResolvedValue({ error: null }) };
    }),
    storage: {
      from: vi.fn(() => ({
        getPublicUrl: vi.fn((path: string) => ({
          data: { publicUrl: `https://example.test/object/comment-media/${path}` },
        })),
      })),
    },
  },
}));

vi.mock('@/services/mediaUploadService', () => ({
  uploadMediaFiles: vi.fn(),
}));

vi.mock('@/lib/coverImageUpload', () => ({
  uploadCoverImage: vi.fn(),
}));

import { uploadCoverImage } from '@/lib/coverImageUpload';

const baseEventPayload = {
  title: 'Jazz Night',
  description: 'Live music',
  category: 'Music',
  event_type: 'event',
  date: '2026-06-15',
  start_time: '19:00',
  end_time: '22:00',
  location: '123 Main St, Boston, MA',
  website_link: null as string | null,
  price: 0,
  max_attendees: null as number | null,
  is_recurring: false,
  recurring_pattern: null as string | null,
  registration_required: false,
  neighborhoods: null as string[] | null,
  villages: null as string | null,
  latitude: 42.36,
  longitude: -71.06,
};

describe('useEventSubmissionCreation', () => {
  beforeEach(() => {
    vi.mocked(uploadMediaFiles).mockReset();
    vi.mocked(uploadCoverImage).mockReset();
    submissionUpdate.mockClear();
    submissionUpdate.mockImplementation(() => ({
      eq: vi.fn().mockResolvedValue({ error: null }),
    }));
  });

  it('updates event_submissions.image_url from the first uploaded image after media insert succeeds', async () => {
    vi.mocked(uploadMediaFiles).mockResolvedValue([
      {
        path: 'user-1/abc123.png',
        name: 'flyer.png',
        type: 'image/png',
        size: 2048,
      },
    ]);

    const { result } = renderHook(() => useEventSubmissionCreation());
    const png = new File(['x'], 'flyer.png', { type: 'image/png' });

    await result.current.submitEvent(baseEventPayload, [png]);

    await waitFor(() => {
      expect(uploadMediaFiles).toHaveBeenCalledWith([png], 'user-1');
    });

    expect(submissionUpdate).toHaveBeenCalledWith({
      image_url: 'https://example.test/object/comment-media/user-1/abc123.png',
    });
  });

  it('uses dedicated cover file and skips gallery image for image_url', async () => {
    vi.mocked(uploadCoverImage).mockResolvedValue('https://cover.test/hero.png');
    vi.mocked(uploadMediaFiles).mockResolvedValue([
      {
        path: 'user-1/gallery.png',
        name: 'gallery.png',
        type: 'image/png',
        size: 1024,
      },
    ]);

    const { result } = renderHook(() => useEventSubmissionCreation());
    const cover = new File(['c'], 'cover.png', { type: 'image/png' });
    const gallery = new File(['g'], 'gallery.png', { type: 'image/png' });

    await result.current.submitEvent(baseEventPayload, [gallery], cover);

    expect(uploadCoverImage).toHaveBeenCalledWith(cover, 'user-1');
    expect(submissionUpdate).not.toHaveBeenCalled();
  });

  it('does not set image_url when only video files are uploaded', async () => {
    vi.mocked(uploadMediaFiles).mockResolvedValue([
      {
        path: 'user-1/vid.webm',
        name: 'clip.webm',
        type: 'video/webm',
        size: 10000,
      },
    ]);

    const { result } = renderHook(() => useEventSubmissionCreation());
    const vid = new File(['x'], 'clip.webm', { type: 'video/webm' });

    await result.current.submitEvent(baseEventPayload, [vid]);

    await waitFor(() => {
      expect(uploadMediaFiles).toHaveBeenCalled();
    });

    expect(submissionUpdate).not.toHaveBeenCalled();
  });
});

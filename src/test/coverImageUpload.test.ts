import { describe, it, expect, vi, beforeEach } from 'vitest';
import { uploadCoverImage } from '@/lib/coverImageUpload';

vi.mock('@/services/mediaUploadService', () => ({
  uploadMediaFiles: vi.fn(),
}));

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    storage: {
      from: () => ({
        getPublicUrl: (path: string) => ({
          data: { publicUrl: `https://cdn.test/${path}` },
        }),
      }),
    },
  },
}));

import { uploadMediaFiles } from '@/services/mediaUploadService';

describe('uploadCoverImage', () => {
  beforeEach(() => {
    vi.mocked(uploadMediaFiles).mockReset();
  });

  it('rejects non-image files', async () => {
    const file = new File(['x'], 'doc.pdf', { type: 'application/pdf' });
    await expect(uploadCoverImage(file, 'user-1')).rejects.toThrow(/image/i);
  });

  it('returns public URL after upload', async () => {
    vi.mocked(uploadMediaFiles).mockResolvedValue([
      { path: 'user-1/cover.png', name: 'cover.png', type: 'image/png', size: 100 },
    ]);
    const file = new File(['x'], 'cover.png', { type: 'image/png' });
    const url = await uploadCoverImage(file, 'user-1');
    expect(url).toBe('https://cdn.test/user-1/cover.png');
    expect(uploadMediaFiles).toHaveBeenCalledWith([file], 'user-1');
  });
});

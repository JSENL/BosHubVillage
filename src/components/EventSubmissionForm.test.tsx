import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import EventSubmissionForm from './EventSubmissionForm';

/** Radix Select uses pointer capture APIs missing in jsdom */
beforeAll(() => {
  if (!Element.prototype.hasPointerCapture) {
    Element.prototype.hasPointerCapture = () => false;
  }
  if (!Element.prototype.setPointerCapture) {
    Element.prototype.setPointerCapture = () => {};
  }
  if (!Element.prototype.releasePointerCapture) {
    Element.prototype.releasePointerCapture = () => {};
  }
  window.HTMLElement.prototype.scrollIntoView = function () {};
  globalThis.URL.createObjectURL ??= () => 'blob:mock-preview';
  globalThis.URL.revokeObjectURL ??= () => {};
});

const submitEvent = vi.fn().mockResolvedValue({ id: 'new-sub' });

vi.mock('@/hooks/useEventSubmissions', () => ({
  useEventSubmissions: () => ({ submitEvent }),
}));

vi.mock('@/hooks/useGeocoding', () => ({
  useGeocoding: () => ({
    geocode: vi.fn().mockResolvedValue({ latitude: 42.36, longitude: -71.06 }),
    isGeocoding: false,
    isReady: true,
  }),
}));

vi.mock('@/hooks/useCategories', () => ({
  useEventCategories: () => ({
    data: [
      {
        id: 'cat-1',
        name: 'Music',
        type: 'event' as const,
        created_at: '2026-01-01',
      },
    ],
  }),
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
  },
}));

vi.mock('@/components/ui/rich-text-editor', () => ({
  RichTextEditor: ({
    value,
    onChange,
    id,
  }: {
    value: string;
    onChange: (html: string) => void;
    id?: string;
  }) => (
    <textarea
      id={id}
      aria-label="Description"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
}));

describe('EventSubmissionForm', () => {
  beforeEach(() => {
    submitEvent.mockClear();
  });

  it('shows the media section with image_url cover copy for reviewers', () => {
    render(<EventSubmissionForm />);

    const section = screen.getByTestId('event-submission-media-section');
    expect(section).toBeInTheDocument();
    expect(within(section).getByText(/image_url/i)).toBeInTheDocument();
    expect(
      within(section).getByText('Media Files (Images & Videos)')
    ).toBeInTheDocument();
  });

  it('passes selected image files to submitEvent when the form is submitted', async () => {
    render(<EventSubmissionForm />);

    fireEvent.change(screen.getByLabelText(/Event Title/i), {
      target: { value: 'Open Mic' },
    });
    fireEvent.change(screen.getByLabelText(/^Description/i), {
      target: { value: 'Weekly open mic' },
    });

    const comboboxes = screen.getAllByRole('combobox');
    fireEvent.click(comboboxes[0]);
    await waitFor(() => {
      expect(screen.getByRole('option', { name: 'Music' })).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('option', { name: 'Music' }));

    fireEvent.change(screen.getByLabelText(/Date/i), {
      target: { value: '2026-07-04' },
    });
    fireEvent.change(screen.getByLabelText(/^Location/i), {
      target: { value: '1 Boston Wharf, Boston, MA' },
    });

    const mediaSection = screen.getByTestId('event-submission-media-section');
    const fileInput = mediaSection.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    expect(fileInput).toBeTruthy();

    const file = new File(['fake'], 'poster.png', { type: 'image/png' });
    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText('poster.png')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /Submit for Approval/i }));

    await waitFor(() => {
      expect(submitEvent).toHaveBeenCalledTimes(1);
    });

    const [, mediaArg] = submitEvent.mock.calls[0];
    expect(mediaArg).toEqual([expect.objectContaining({ name: 'poster.png' })]);
  });
});

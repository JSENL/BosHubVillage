/** @vitest-environment jsdom */
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import type { UnifiedItem } from '@/types/unifiedItem';
import { CultureSpotlightSection } from '@/components/home/CultureSpotlightSection';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (_key: string, opts?: { defaultValue?: string }) => opts?.defaultValue ?? _key,
  }),
}));

vi.mock('@/components/NewsCard', () => ({
  default: ({ news }: { news: { id: string; title: string } }) => (
    <div className="mock-news-card">{news.title}</div>
  ),
}));

function newsItem(id: string, title: string, dateIso: string): UnifiedItem {
  return {
    id,
    title,
    description: '',
    latitude: null,
    longitude: null,
    type: 'news',
    date: dateIso,
    content: '',
    location: 'Boston',
    source: 'Test Source',
    originalData: {
      id,
      title,
      content: '',
      location: 'Boston',
      source: 'Test Source',
      date_posted: dateIso,
      created_at: dateIso,
      updated_at: dateIso,
    },
  };
}

function wrap(items: UnifiedItem[]) {
  return (
    <BrowserRouter>
      <CultureSpotlightSection items={items} isLoading={false} />
    </BrowserRouter>
  );
}

describe('CultureSpotlightSection matches feed after delete (Supabase-shaped items)', () => {
  it('does not render a culture story once it is removed from the items feed', () => {
    const deletedTitle = 'Will Be Removed From Spotlight';
    const before: UnifiedItem[] = [
      newsItem('n-new', deletedTitle, '2026-04-10T12:00:00.000Z'),
      newsItem('n-mid', 'Stays Middle', '2026-04-09T12:00:00.000Z'),
      newsItem('n-old', 'Stays Oldest', '2026-04-08T12:00:00.000Z'),
    ];

    const { rerender } = render(wrap(before));

    expect(screen.getByText(deletedTitle)).toBeInTheDocument();
    expect(screen.getAllByTestId('culture-spotlight-card')).toHaveLength(3);

    const afterDelete = before.filter((i) => i.id !== 'n-new');
    rerender(wrap(afterDelete));

    expect(screen.queryByText(deletedTitle)).not.toBeInTheDocument();
    expect(screen.getByText('Stays Middle')).toBeInTheDocument();
    expect(screen.getByText('Stays Oldest')).toBeInTheDocument();
    expect(screen.getAllByTestId('culture-spotlight-card')).toHaveLength(2);
  });
});

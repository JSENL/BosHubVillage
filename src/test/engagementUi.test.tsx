/** @vitest-environment jsdom */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { BookmarkButton } from '@/components/social/BookmarkButton';
import { NewsSubmitterLine } from '@/components/news/NewsSubmitterLine';
import { WeeklyDigestPreview } from '@/components/home/WeeklyDigestPreview';
import { EngagementOnboardingStrip } from '@/components/home/EngagementOnboardingStrip';
import { CommunityContributionPrompt } from '@/components/home/CommunityContributionPrompt';
import { RecentlyViewedSection } from '@/components/discovery/RecentlyViewedSection';
import { UserProfileCard } from '@/components/social/UserProfileCard';
import { UserContributions } from '@/components/profile/UserContributions';
import FeaturedArticle from '@/components/news/FeaturedArticle';
import SecondaryArticles from '@/components/news/SecondaryArticles';
import NewsGrid from '@/components/news/NewsGrid';
import { UnifiedItem } from '@/types/unifiedItem';
import { News } from '@/types/news';

const authState = vi.hoisted(() => ({
  user: null as { id: string; email?: string } | null,
}));

const recentlyViewedState = vi.hoisted(() => ({
  recentlyViewed: [] as Array<{ item_id: string; item_type: string }>,
  isLoading: false,
  addToRecentlyViewed: vi.fn(),
}));

const bookmarksState = vi.hoisted(() => ({
  isBookmarked: false,
  addBookmark: vi.fn(),
  removeBookmark: vi.fn(),
}));

vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    user: authState.user,
    loading: false,
    isAdmin: false,
    signOut: vi.fn(),
  }),
}));

vi.mock('@/hooks/useBookmarks', () => ({
  useBookmarks: () => ({
    useIsBookmarked: () => ({ data: bookmarksState.isBookmarked }),
    addBookmark: bookmarksState.addBookmark,
    removeBookmark: bookmarksState.removeBookmark,
    isAddingBookmark: false,
    isRemovingBookmark: false,
  }),
}));

vi.mock('@/hooks/useRecentlyViewed', () => ({
  useRecentlyViewed: () => ({
    recentlyViewed: recentlyViewedState.recentlyViewed,
    isLoading: recentlyViewedState.isLoading,
    addToRecentlyViewed: recentlyViewedState.addToRecentlyViewed,
  }),
}));

vi.mock('@/hooks/useFollowers', () => ({
  useFollowers: () => ({
    isFollowing: false,
    follow: vi.fn(),
    unfollow: vi.fn(),
    isFollowingUser: false,
    isUnfollowing: false,
  }),
}));

vi.mock('@/components/common/WeeklyEmailModal', () => ({
  WeeklyEmailModal: ({ trigger }: { trigger?: React.ReactNode }) => (
    <div data-testid="weekly-email-modal">{trigger}</div>
  ),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, fallback?: string) =>
      typeof fallback === 'string' ? fallback : key,
    i18n: { language: 'en' },
  }),
}));

vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual<typeof import('@tanstack/react-query')>(
    '@tanstack/react-query',
  );
  return {
    ...actual,
    useQuery: ({ queryKey }: { queryKey: unknown[] }) => {
      if (queryKey[0] === 'user-contributions') {
        return {
          isLoading: false,
          data: [
            {
              id: 'e1',
              title: 'Block Party',
              type: 'event',
              created_at: new Date().toISOString(),
              slug: 'block-party',
            },
            {
              id: 'b1',
              title: 'Corner Cafe',
              type: 'business',
              created_at: new Date().toISOString(),
            },
            {
              id: 'n1',
              title: 'Neighborhood Story',
              type: 'news',
              created_at: new Date().toISOString(),
            },
            {
              id: 'n2',
              title: 'Second Story',
              type: 'news',
              created_at: new Date().toISOString(),
            },
          ],
        };
      }
      return { isLoading: false, data: [] };
    },
  };
});

const wrap = (ui: React.ReactNode) => <MemoryRouter>{ui}</MemoryRouter>;

const sampleNews = (overrides: Partial<News> = {}): News => ({
  id: 'news-1',
  title: 'Community mural opens',
  content: '<p>A new mural debuted this weekend.</p>',
  location: 'Roxbury',
  date_posted: '2026-07-10',
  source: 'Hub Village',
  created_at: '2026-07-10T12:00:00Z',
  updated_at: '2026-07-10T12:00:00Z',
  created_by: 'user-42',
  submitter_name: 'Amina Writer',
  submitter_email: 'amina@example.com',
  ...overrides,
});

describe('Engagement UI changes', () => {
  beforeEach(() => {
    authState.user = null;
    bookmarksState.isBookmarked = false;
    bookmarksState.addBookmark.mockReset();
    bookmarksState.removeBookmark.mockReset();
    recentlyViewedState.recentlyViewed = [];
    recentlyViewedState.isLoading = false;
    recentlyViewedState.addToRecentlyViewed.mockReset();
    localStorage.clear();
  });

  afterEach(() => {
    cleanup();
  });

  describe('1. Guest save / BookmarkButton', () => {
    it('shows a sign-in save link for guests', () => {
      render(
        wrap(
          <BookmarkButton itemType="news" itemId="n1" showText />,
        ),
      );

      const link = screen.getByRole('link', { name: /sign in to save this item/i });
      expect(link).toHaveAttribute('href', '/auth');
      expect(screen.getByText('Save this')).toBeInTheDocument();
    });

    it('bookmarks for signed-in users', () => {
      authState.user = { id: 'u1' };
      render(wrap(<BookmarkButton itemType="event" itemId="e1" showText />));

      fireEvent.click(screen.getByRole('button', { name: /bookmark/i }));
      expect(bookmarksState.addBookmark).toHaveBeenCalledWith({
        itemType: 'event',
        itemId: 'e1',
      });
    });
  });

  describe('2. Post-auth onboarding strip', () => {
    it('hides for guests', () => {
      render(wrap(<EngagementOnboardingStrip />));
      expect(screen.queryByText('Make Hub Village yours')).toBeNull();
    });

    it('shows quick actions for signed-in users and dismisses', async () => {
      authState.user = { id: 'u1' };
      render(wrap(<EngagementOnboardingStrip />));

      expect(await screen.findByText('Make Hub Village yours')).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /find something to save/i })).toHaveAttribute(
        'href',
        '/search',
      );
      expect(screen.getByRole('link', { name: /submit culture/i })).toHaveAttribute(
        'href',
        '/submit-news',
      );

      fireEvent.click(screen.getByRole('button', { name: /dismiss suggestions/i }));
      await waitFor(() => {
        expect(screen.queryByText('Make Hub Village yours')).toBeNull();
      });
      expect(localStorage.getItem('hub-village-engagement-strip-dismissed')).toBe('true');
    });
  });

  describe('3. Submitter profile link', () => {
    it('links submitter name to the public profile', () => {
      render(wrap(<NewsSubmitterLine article={sampleNews()} />));

      const link = screen.getByRole('link', { name: 'Amina Writer' });
      expect(link).toHaveAttribute('href', '/user/user-42');
    });

    it('shows mailto when only email is present', () => {
      render(
        wrap(
          <NewsSubmitterLine
            article={sampleNews({
              submitter_name: null,
              created_by: undefined,
              submitter_email: 'only@example.com',
            })}
          />,
        ),
      );

      expect(screen.getByRole('link', { name: /only@example.com/i })).toHaveAttribute(
        'href',
        'mailto:only@example.com',
      );
    });
  });

  describe('6. Recently viewed', () => {
    it('renders continue-browsing links for matching items', () => {
      recentlyViewedState.recentlyViewed = [
        { item_id: 'news-1', item_type: 'news' },
        { item_id: 'biz-1', item_type: 'business' },
      ];

      const items: UnifiedItem[] = [
        {
          id: 'news-1',
          title: 'Culture piece',
          description: 'desc',
          latitude: null,
          longitude: null,
          type: 'news',
        },
        {
          id: 'biz-1',
          title: 'Local shop',
          description: 'desc',
          latitude: null,
          longitude: null,
          type: 'business',
        },
      ];

      render(wrap(<RecentlyViewedSection items={items} />));

      expect(screen.getByText('Continue browsing')).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /culture piece/i })).toHaveAttribute(
        'href',
        '/news/news-1',
      );
      expect(screen.getByRole('link', { name: /local shop/i })).toHaveAttribute(
        'href',
        '/business/biz-1',
      );
    });

    it('returns null when there is nothing to continue', () => {
      const { container } = render(wrap(<RecentlyViewedSection items={[]} />));
      expect(container).toBeEmptyDOMElement();
    });

    it('tracks recently viewed from detail pages and cards', () => {
      const roots = [
        'src/pages/NewsDetails.tsx',
        'src/pages/EventDetails.tsx',
        'src/pages/BusinessDetails.tsx',
        'src/pages/LocalServiceDetails.tsx',
        'src/components/UnifiedItemCard.tsx',
      ];

      for (const file of roots) {
        const source = readFileSync(resolve(process.cwd(), file), 'utf8');
        expect(source).toContain('addToRecentlyViewed');
      }
    });
  });

  describe('7. Contribution badges', () => {
    it('shows event/business/culture counts on profiles', async () => {
      render(wrap(<UserContributions userId="user-1" />));

      expect(await screen.findByText(/Contributions \(4\)/)).toBeInTheDocument();
      expect(screen.getByText('Events').previousElementSibling).toHaveTextContent('1');
      expect(screen.getByText('Businesses').previousElementSibling).toHaveTextContent('1');

      const cultureStatLabel = screen
        .getAllByText('Culture')
        .find((el) => el.className.includes('text-[11px]'));
      expect(cultureStatLabel?.previousElementSibling).toHaveTextContent('2');
    });
  });

  describe('8. Soft contribution prompt', () => {
    it('links to event and culture submit flows', () => {
      render(wrap(<CommunityContributionPrompt />));

      expect(
        screen.getByText('Know something the neighborhood should see?'),
      ).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /submit event/i })).toHaveAttribute(
        'href',
        '/submit-event',
      );
      expect(screen.getByRole('link', { name: /submit culture/i })).toHaveAttribute(
        'href',
        '/submit-news',
      );
    });
  });

  describe('9. Approval celebration toast', () => {
    it('opens the live article from the approval success action', () => {
      const source = readFileSync(
        resolve(process.cwd(), 'src/hooks/useNewsSubmissionOperations.tsx'),
        'utf8',
      );

      expect(source).toContain("toast.success('Culture article is live!'");
      expect(source).toContain("label: 'View'");
      expect(source).toContain('window.open(`/news/${newNewsId}`');
    });
  });

  describe('10. Digest preview', () => {
    it('renders digest preview CTA', () => {
      render(wrap(<WeeklyDigestPreview />));

      expect(screen.getByText('Weekly neighborhood digest')).toBeInTheDocument();
      expect(screen.getByText('Get the best of Hub Village every week')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /send me the digest/i })).toBeInTheDocument();
      expect(screen.getByTestId('weekly-email-modal')).toBeInTheDocument();
    });
  });

  describe('12. Comment teasers', () => {
    it('shows Read & comment on Culture cards', () => {
      const article = sampleNews();
      const { rerender } = render(wrap(<FeaturedArticle article={article} />));
      expect(screen.getByText('Read & comment')).toBeInTheDocument();

      rerender(wrap(<SecondaryArticles articles={[article]} />));
      expect(screen.getByText('Read & comment')).toBeInTheDocument();

      rerender(wrap(<NewsGrid articles={[article]} />));
      expect(screen.getByText('Read & comment')).toBeInTheDocument();
    });

    it('keeps submitter profile links outside article links', () => {
      render(wrap(<FeaturedArticle article={sampleNews()} />));

      const profileLink = screen.getByRole('link', { name: 'Amina Writer' });
      const articleLinks = screen.getAllByRole('link').filter((link) =>
        link.getAttribute('href')?.startsWith('/news/'),
      );

      expect(profileLink).toHaveAttribute('href', '/user/user-42');
      expect(articleLinks.length).toBeGreaterThan(0);
      expect(profileLink.closest('a[href^="/news/"]')).toBeNull();
    });

    it('includes open-to-comment cue on unified cards source', () => {
      const source = readFileSync(
        resolve(process.cwd(), 'src/components/UnifiedItemCard.tsx'),
        'utf8',
      );
      expect(source).toContain('Open to comment');
    });
  });

  describe('Guest follow CTA', () => {
    it('shows sign-in-to-follow for guests on other profiles', () => {
      render(
        wrap(
          <UserProfileCard
            profile={{
              id: 'other-user',
              email: 'other@example.com',
              full_name: 'Other User',
              avatar_url: null,
              bio: null,
              location: null,
              website: null,
              interests: null,
              is_verified: false,
              followers_count: 3,
              following_count: 1,
              created_at: '2026-01-01T00:00:00Z',
              updated_at: '2026-01-01T00:00:00Z',
            }}
            showFollowButton
          />,
        ),
      );

      expect(screen.getByRole('link', { name: /sign in to follow/i })).toHaveAttribute(
        'href',
        '/auth',
      );
    });
  });
});

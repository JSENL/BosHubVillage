import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { FeaturedSection } from '@/components/home/FeaturedSection';
import { UnifiedItem } from '@/types/unifiedItem';

// Mock the i18n
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'en' }
  })
}));

// Create test wrapper with router
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('FeaturedSection', () => {
  const createMockItem = (overrides: Partial<UnifiedItem> = {}): UnifiedItem => ({
    id: 'test-1',
    title: 'Test Item',
    description: 'Test description',
    latitude: 42.3,
    longitude: -71.1,
    type: 'business',
    is_sponsored: false,
    originalData: {
      id: 'test-1',
      title: 'Test Item',
      description: 'Test description',
      business_type: 'Restaurant',
      address: '123 Test St',
      neighborhood: 'Test Neighborhood',
      is_sponsored: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    ...overrides
  });

  it('should not render when there are no sponsored items', () => {
    const items: UnifiedItem[] = [
      createMockItem({ id: '1', is_sponsored: false }),
      createMockItem({ id: '2', is_sponsored: false }),
    ];

    const { container } = render(
      <TestWrapper>
        <FeaturedSection items={items} />
      </TestWrapper>
    );

    expect(container.querySelector('[data-testid="featured-section"]')).toBeNull();
  });

  it('should render when there are sponsored items', () => {
    const sponsoredItem = createMockItem({ 
      id: 'sponsored-1', 
      is_sponsored: true,
      originalData: {
        id: 'sponsored-1',
        title: 'Sponsored Business',
        description: 'A great business',
        business_type: 'Restaurant',
        address: '123 Main St',
        neighborhood: 'Downtown',
        is_sponsored: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    });

    const items: UnifiedItem[] = [
      createMockItem({ id: '1', is_sponsored: false }),
      sponsoredItem,
    ];

    const { container } = render(
      <TestWrapper>
        <FeaturedSection items={items} />
      </TestWrapper>
    );

    expect(container.querySelector('[data-testid="featured-section"]')).not.toBeNull();
  });

  it('should only display sponsored items in the featured section', () => {
    const sponsoredItem1 = createMockItem({ 
      id: 'sponsored-1', 
      is_sponsored: true,
      originalData: {
        id: 'sponsored-1',
        title: 'Sponsored 1',
        description: 'Desc',
        business_type: 'Restaurant',
        address: '123 Main St',
        neighborhood: 'Downtown',
        is_sponsored: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    });

    const sponsoredItem2 = createMockItem({ 
      id: 'sponsored-2', 
      is_sponsored: true,
      originalData: {
        id: 'sponsored-2',
        title: 'Sponsored 2',
        description: 'Desc',
        business_type: 'Retail',
        address: '456 Oak Ave',
        neighborhood: 'Midtown',
        is_sponsored: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    });

    const items: UnifiedItem[] = [
      createMockItem({ id: '1', is_sponsored: false }),
      sponsoredItem1,
      createMockItem({ id: '2', is_sponsored: false }),
      sponsoredItem2,
      createMockItem({ id: '3', is_sponsored: false }),
    ];

    const { container } = render(
      <TestWrapper>
        <FeaturedSection items={items} />
      </TestWrapper>
    );

    const featuredItems = container.querySelectorAll('[data-testid="featured-item"]');
    expect(featuredItems.length).toBe(2); // Only 2 sponsored items
  });

  it('should display correct count text for single sponsored item', () => {
    const sponsoredItem = createMockItem({ 
      id: 'sponsored-1', 
      is_sponsored: true,
      originalData: {
        id: 'sponsored-1',
        title: 'Sponsored',
        description: 'Desc',
        business_type: 'Restaurant',
        address: '123 Main St',
        neighborhood: 'Downtown',
        is_sponsored: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    });

    const { getByText } = render(
      <TestWrapper>
        <FeaturedSection items={[sponsoredItem]} />
      </TestWrapper>
    );

    expect(getByText('1 sponsored listing')).toBeInTheDocument();
  });

  it('should display correct count text for multiple sponsored items', () => {
    const items = [
      createMockItem({ 
        id: 'sponsored-1', 
        is_sponsored: true,
        originalData: {
          id: 'sponsored-1',
          title: 'Sponsored 1',
          description: 'Desc',
          business_type: 'Restaurant',
          address: '123 Main St',
          neighborhood: 'Downtown',
          is_sponsored: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      }),
      createMockItem({ 
        id: 'sponsored-2', 
        is_sponsored: true,
        originalData: {
          id: 'sponsored-2',
          title: 'Sponsored 2',
          description: 'Desc',
          business_type: 'Retail',
          address: '456 Oak Ave',
          neighborhood: 'Midtown',
          is_sponsored: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      }),
      createMockItem({ 
        id: 'sponsored-3', 
        is_sponsored: true,
        originalData: {
          id: 'sponsored-3',
          title: 'Sponsored 3',
          description: 'Desc',
          business_type: 'Services',
          address: '789 Elm Rd',
          neighborhood: 'Uptown',
          is_sponsored: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      }),
    ];

    const { getByText } = render(
      <TestWrapper>
        <FeaturedSection items={items} />
      </TestWrapper>
    );

    expect(getByText('3 sponsored listings')).toBeInTheDocument();
  });

  it('should render Featured header text', () => {
    const sponsoredItem = createMockItem({ 
      id: 'sponsored-1', 
      is_sponsored: true,
      originalData: {
        id: 'sponsored-1',
        title: 'Sponsored',
        description: 'Desc',
        business_type: 'Restaurant',
        address: '123 Main St',
        neighborhood: 'Downtown',
        is_sponsored: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    });

    const { getByText } = render(
      <TestWrapper>
        <FeaturedSection items={[sponsoredItem]} />
      </TestWrapper>
    );

    expect(getByText('Featured')).toBeInTheDocument();
  });
});

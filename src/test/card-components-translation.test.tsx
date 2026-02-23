import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import i18n from '@/i18n/config';
import { EventCard } from '@/components/EventCard';
import NewsCard from '@/components/NewsCard';
import BusinessCard from '@/components/BusinessCard';
import LocalServiceCard from '@/components/LocalServiceCard';
import type { News } from '@/types/news';
import type { Business } from '@/types/business';
import type { LocalResource } from '@/types/localServices';

beforeEach(() => {
  vi.spyOn(Math, 'random').mockReturnValue(0.5);
});

// Minimal mock data for each card
const mockEvent = {
  id: 'ev-1',
  title: 'Test Event',
  description: 'Test description',
  category: 'Festival',
  date: '2026-06-15',
  start_time: '10:00',
  end_time: '18:00',
  location: 'Boston Common',
  price: 0,
  max_attendees: 100,
  is_sponsored: false,
};

const mockNews: News = {
  id: 'news-1',
  title: 'Test News',
  content: 'Test content',
  location: 'Boston',
  date_posted: '2026-06-01',
  source: 'Test Source',
  created_at: '2026-06-01T00:00:00Z',
  updated_at: '2026-06-01T00:00:00Z',
  is_sponsored: false,
};

const mockBusiness: Business = {
  id: 'biz-1',
  title: 'Test Business',
  business_type: 'Restaurant',
  address: '123 Main St',
  neighborhood: 'Downtown',
  description: 'Test description',
  created_at: '2026-06-01T00:00:00Z',
  updated_at: '2026-06-01T00:00:00Z',
  is_sponsored: false,
};

const mockLocalService: LocalResource = {
  id: 'loc-1',
  name: 'Test Service',
  category: 'Health',
  address: '456 Oak Ave',
  neighborhood: 'Riverside',
  created_at: '2026-06-01T00:00:00Z',
  updated_at: '2026-06-01T00:00:00Z',
  description: 'Test description',
  is_sponsored: false,
};

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('Card components – Spanish (es) translations', () => {
  beforeEach(async () => {
    await act(async () => {
      await i18n.changeLanguage('es');
    });
  });

  it('EventCard shows Spanish card strings (Gratis, reseñas)', async () => {
    await act(async () => {
      render(<EventCard event={mockEvent} viewMode="grid" />, { wrapper });
    });
    expect(screen.getByText('Gratis')).toBeInTheDocument();
    expect(screen.getByText(/reseñas$/)).toBeInTheDocument();
  });

  it('NewsCard shows Spanish card strings (Cultura badge)', async () => {
    await act(async () => {
      render(<NewsCard news={mockNews} />, { wrapper });
    });
    expect(screen.getByText('Cultura')).toBeInTheDocument();
  });

  it('BusinessCard shows Spanish card strings (reseñas)', async () => {
    await act(async () => {
      render(<BusinessCard business={mockBusiness} />, { wrapper });
    });
    expect(screen.getByText(/reseñas$/)).toBeInTheDocument();
  });

  it('LocalServiceCard shows Spanish card strings (Agregado)', async () => {
    await act(async () => {
      render(<LocalServiceCard localService={mockLocalService} />, { wrapper });
    });
    expect(screen.getByText(/Agregado/)).toBeInTheDocument();
  });
});

describe('Card components – Vietnamese (vi) translations', () => {
  beforeEach(async () => {
    await act(async () => {
      await i18n.changeLanguage('vi');
    });
  });

  it('EventCard shows Vietnamese card strings (Miễn Phí, đánh giá)', async () => {
    await act(async () => {
      render(<EventCard event={mockEvent} viewMode="grid" />, { wrapper });
    });
    expect(screen.getByText('Miễn Phí')).toBeInTheDocument();
    expect(screen.getByText(/đánh giá$/)).toBeInTheDocument();
  });

  it('NewsCard shows Vietnamese card strings (Văn Hóa badge)', async () => {
    await act(async () => {
      render(<NewsCard news={mockNews} />, { wrapper });
    });
    expect(screen.getByText('Văn Hóa')).toBeInTheDocument();
  });

  it('BusinessCard shows Vietnamese card strings (đánh giá)', async () => {
    await act(async () => {
      render(<BusinessCard business={mockBusiness} />, { wrapper });
    });
    expect(screen.getByText(/đánh giá$/)).toBeInTheDocument();
  });

  it('LocalServiceCard shows Vietnamese card strings (Đã Thêm)', async () => {
    await act(async () => {
      render(<LocalServiceCard localService={mockLocalService} />, { wrapper });
    });
    expect(screen.getByText(/Đã Thêm/)).toBeInTheDocument();
  });
});

describe('Card components – English (en) baseline', () => {
  beforeEach(async () => {
    await act(async () => {
      await i18n.changeLanguage('en');
    });
  });

  it('EventCard shows English card strings', async () => {
    await act(async () => {
      render(<EventCard event={mockEvent} viewMode="grid" />, { wrapper });
    });
    expect(screen.getByText('Free')).toBeInTheDocument();
    expect(screen.getByText(/reviews$/)).toBeInTheDocument();
  });

  it('NewsCard shows English card strings (Culture)', async () => {
    await act(async () => {
      render(<NewsCard news={mockNews} />, { wrapper });
    });
    expect(screen.getByText('Culture')).toBeInTheDocument();
  });

  it('BusinessCard shows English card strings', async () => {
    await act(async () => {
      render(<BusinessCard business={mockBusiness} />, { wrapper });
    });
    expect(screen.getByText(/reviews$/)).toBeInTheDocument();
  });

  it('LocalServiceCard shows English card strings (Added)', async () => {
    await act(async () => {
      render(<LocalServiceCard localService={mockLocalService} />, { wrapper });
    });
    expect(screen.getByText(/Added/)).toBeInTheDocument();
  });
});

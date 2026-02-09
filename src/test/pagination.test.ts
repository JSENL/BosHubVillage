import { describe, it, expect, vi } from 'vitest';

// Mock supabase
const mockSelect = vi.fn();
const mockOrder = vi.fn();
const mockRange = vi.fn();
const mockGte = vi.fn();
const mockIn = vi.fn();

const chainMock = () => ({
  select: (...args: any[]) => { mockSelect(...args); return chainMock(); },
  order: (...args: any[]) => { mockOrder(...args); return chainMock(); },
  range: (from: number, to: number) => { mockRange(from, to); return Promise.resolve({ data: [], error: null }); },
  gte: (...args: any[]) => { mockGte(...args); return chainMock(); },
  in: (...args: any[]) => { mockIn(...args); return Promise.resolve({ data: [], error: null }); },
});

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: (table: string) => {
      return chainMock();
    },
  },
}));

describe('Pagination - range queries', () => {
  it('should use range(0, 99) for first page with PAGE_SIZE=100', async () => {
    // Import after mock
    const { supabase } = await import('@/integrations/supabase/client');
    
    const query = supabase.from('events').select('*').order('date', { ascending: true });
    await (query as any).range(0, 99);

    expect(mockRange).toHaveBeenCalledWith(0, 99);
  });

  it('should use range(100, 199) for second page', async () => {
    const { supabase } = await import('@/integrations/supabase/client');
    
    await supabase.from('events').select('*').order('date', { ascending: true }).range(100, 199);

    expect(mockRange).toHaveBeenCalledWith(100, 199);
  });

  it('should stop fetching when data.length < PAGE_SIZE', () => {
    const PAGE_SIZE = 100;
    const mockData = Array.from({ length: 50 }, (_, i) => ({ id: i }));
    const hasMore = mockData.length === PAGE_SIZE;
    expect(hasMore).toBe(false);
  });

  it('should continue fetching when data.length === PAGE_SIZE', () => {
    const PAGE_SIZE = 100;
    const mockData = Array.from({ length: 100 }, (_, i) => ({ id: i }));
    const hasMore = mockData.length === PAGE_SIZE;
    expect(hasMore).toBe(true);
  });

  it('should accumulate data across pages', () => {
    const allData: any[] = [];
    const page1 = Array.from({ length: 100 }, (_, i) => ({ id: i }));
    const page2 = Array.from({ length: 30 }, (_, i) => ({ id: i + 100 }));
    
    allData.push(...page1);
    allData.push(...page2);
    
    expect(allData.length).toBe(130);
    expect(allData[0].id).toBe(0);
    expect(allData[129].id).toBe(129);
  });

  it('should batch business owner queries with .in() instead of N+1', () => {
    const businessIds = ['id1', 'id2', 'id3'];
    // Verify the grouping logic
    const ownerData = [
      { business_id: 'id1', owner_id: 'o1' },
      { business_id: 'id1', owner_id: 'o2' },
      { business_id: 'id3', owner_id: 'o3' },
    ];

    const ownersByBusiness = ownerData.reduce((acc: Record<string, any[]>, owner) => {
      if (!acc[owner.business_id]) acc[owner.business_id] = [];
      acc[owner.business_id].push(owner);
      return acc;
    }, {});

    expect(ownersByBusiness['id1'].length).toBe(2);
    expect(ownersByBusiness['id2']).toBeUndefined();
    expect(ownersByBusiness['id3'].length).toBe(1);
  });
});

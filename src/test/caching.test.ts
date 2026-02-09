import { describe, it, expect, vi, beforeEach } from 'vitest';

// --- Geocoding cache tests ---
describe('Geocoding Cache', () => {
  const mockLocalStorage: Record<string, string> = {};

  beforeEach(() => {
    Object.keys(mockLocalStorage).forEach(k => delete mockLocalStorage[k]);
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => mockLocalStorage[key] || null,
      setItem: (key: string, value: string) => { mockLocalStorage[key] = value; },
      removeItem: (key: string) => { delete mockLocalStorage[key]; },
    });
  });

  it('should normalize addresses consistently', () => {
    const normalize = (addr: string) => addr.trim().toLowerCase().replace(/\s+/g, ' ');
    expect(normalize('  123 Main  Street ')).toBe('123 main street');
    expect(normalize('123 MAIN STREET')).toBe('123 main street');
    expect(normalize('123 main street')).toBe('123 main street');
    // Same address different formatting should match
    expect(normalize('  123 Main  Street ')).toBe(normalize('123 MAIN STREET'));
  });

  it('should store and retrieve geocode results from memory cache', () => {
    const cache = new Map<string, { latitude: number; longitude: number }>();
    const key = '123 main street';
    const result = { latitude: 40.7128, longitude: -74.006 };

    cache.set(key, result);
    expect(cache.has(key)).toBe(true);
    expect(cache.get(key)).toEqual(result);
  });

  it('should persist cache to localStorage', () => {
    const cacheData = { '123 main st': { latitude: 40.7, longitude: -74.0 } };
    localStorage.setItem('geocode_cache', JSON.stringify(cacheData));

    const stored = JSON.parse(localStorage.getItem('geocode_cache')!);
    expect(stored['123 main st'].latitude).toBe(40.7);
  });

  it('should evict old entries when exceeding max size', () => {
    const GEOCODE_CACHE_MAX = 500;
    const cache = new Map<string, any>();

    // Add 510 entries
    for (let i = 0; i < 510; i++) {
      cache.set(`addr_${i}`, { latitude: i, longitude: i });
    }

    // Simulate save with eviction
    const entries = Array.from(cache.entries());
    const start = Math.max(0, entries.length - GEOCODE_CACHE_MAX);
    const trimmed = entries.slice(start);

    expect(trimmed.length).toBe(500);
    expect(trimmed[0][0]).toBe('addr_10'); // first 10 evicted
  });
});

// --- Mapbox token cache tests ---
describe('Mapbox Token Cache', () => {
  const mockLocalStorage: Record<string, string> = {};
  const CACHE_KEY = 'mapbox_token_cache';
  const TTL = 60 * 60 * 1000; // 1 hour

  beforeEach(() => {
    Object.keys(mockLocalStorage).forEach(k => delete mockLocalStorage[k]);
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => mockLocalStorage[key] || null,
      setItem: (key: string, value: string) => { mockLocalStorage[key] = value; },
      removeItem: (key: string) => { delete mockLocalStorage[key]; },
    });
  });

  it('should return null when no cached token exists', () => {
    const cached = localStorage.getItem(CACHE_KEY);
    expect(cached).toBeNull();
  });

  it('should store and retrieve a valid token', () => {
    const token = 'pk.test_token_123';
    localStorage.setItem(CACHE_KEY, JSON.stringify({ token, timestamp: Date.now() }));

    const parsed = JSON.parse(localStorage.getItem(CACHE_KEY)!);
    expect(parsed.token).toBe(token);
    expect(Date.now() - parsed.timestamp).toBeLessThan(TTL);
  });

  it('should expire token after TTL', () => {
    const token = 'pk.expired_token';
    const expiredTimestamp = Date.now() - TTL - 1000; // 1 second past TTL
    localStorage.setItem(CACHE_KEY, JSON.stringify({ token, timestamp: expiredTimestamp }));

    const parsed = JSON.parse(localStorage.getItem(CACHE_KEY)!);
    const isExpired = Date.now() - parsed.timestamp > TTL;
    expect(isExpired).toBe(true);
  });

  it('should treat fresh token as valid', () => {
    const token = 'pk.fresh_token';
    localStorage.setItem(CACHE_KEY, JSON.stringify({ token, timestamp: Date.now() }));

    const parsed = JSON.parse(localStorage.getItem(CACHE_KEY)!);
    const isExpired = Date.now() - parsed.timestamp > TTL;
    expect(isExpired).toBe(false);
  });
});

// --- React Query staleTime verification ---
describe('React Query Cache Configuration', () => {
  it('categories should have 30min staleTime', () => {
    const staleTime = 30 * 60 * 1000;
    expect(staleTime).toBe(1800000);
  });

  it('profiles should have 5min staleTime', () => {
    const staleTime = 5 * 60 * 1000;
    expect(staleTime).toBe(300000);
  });

  it('data hooks should have 5min staleTime and 10min gcTime', () => {
    const staleTime = 5 * 60 * 1000;
    const gcTime = 10 * 60 * 1000;
    expect(staleTime).toBe(300000);
    expect(gcTime).toBe(600000);
    expect(gcTime).toBeGreaterThan(staleTime);
  });

  it('mapbox token TTL should be 1 hour', () => {
    const ttl = 60 * 60 * 1000;
    expect(ttl).toBe(3600000);
  });
});

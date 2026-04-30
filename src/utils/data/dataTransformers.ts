import { UnifiedItem, TranslationsObject } from '@/types/unifiedItem';

/** Normalize Supabase Json translation maps to string records Supabase client may return. */
function asTranslationRecord(json: unknown): TranslationsObject | undefined {
  if (json == null || typeof json !== 'object' || Array.isArray(json)) return undefined;
  const out: TranslationsObject = {};
  for (const [k, v] of Object.entries(json as Record<string, unknown>)) {
    if (typeof v === 'string' && v.trim() !== '') out[k] = v;
  }
  return Object.keys(out).length ? out : undefined;
}

interface RawDataSources {
  events: any[];
  news: any[];
  businesses: any[];
  businessSubmissions: any[];
  localresources: any[];
  localresourcesubmissions: any[];
}

export const transformDataToUnifiedItems = (data: RawDataSources): UnifiedItem[] => {
  const items: UnifiedItem[] = [];

  // Transform events
  items.push(...data.events.map(event => ({
    id: event.id,
    slug: event.slug,
    title: event.title,
    description: event.description || '',
    latitude: event.latitude,
    longitude: event.longitude,
    type: 'event' as const,
    location: event.location,
    address: event.address || event.location,
    category: event.category,
    date: event.date,
    start_time: event.start_time,
    end_time: event.end_time,
    price: Number(event.price || 0),
    neighborhoods: event.neighborhoods,
    villages: event.villages,
    is_sponsored: event.is_sponsored || false,
    title_translations: asTranslationRecord(event.title_translations),
    description_translations: asTranslationRecord(event.description_translations),
    location_translations: asTranslationRecord(event.location_translations),
    category_translations: asTranslationRecord(event.category_translations),
    originalData: event
  })));

  // Transform businesses
  const businessItems = data.businesses.map(business => ({
    id: business.id,
    title: business.title,
    description: business.description || '',
    latitude: business.latitude,
    longitude: business.longitude,
    type: 'business' as const,
    address: business.address,
    category: business.business_type,
    business_type: business.business_type,
    villages: business.villages,
    neighborhoods: business.neighborhood,
    is_sponsored: business.is_sponsored || false,
    title_translations: asTranslationRecord(business.title_translations),
    description_translations: asTranslationRecord(business.description_translations),
    short_description_translations: asTranslationRecord(business.short_description_translations),
    address_translations: asTranslationRecord(business.address_translations),
    category_translations:
      asTranslationRecord((business as { business_type_translations?: unknown }).business_type_translations) ??
      asTranslationRecord((business as { category_translations?: unknown }).category_translations),
    originalData: business
  }));
  
  items.push(...businessItems);

  // Transform business submissions
  const businessSubmissionItems = data.businessSubmissions.map(businessSubmission => ({
    id: businessSubmission.id,
    title: businessSubmission.title,
    description: businessSubmission.description || '',
    latitude: businessSubmission.latitude,
    longitude: businessSubmission.longitude,
    type: 'business' as const,
    address: businessSubmission.address,
    category: businessSubmission.business_type,
    business_type: businessSubmission.business_type,
    neighborhoods: businessSubmission.neighborhood,
    villages: undefined,
    is_sponsored: businessSubmission.is_sponsored || false,
    title_translations: asTranslationRecord(businessSubmission.title_translations),
    description_translations: asTranslationRecord(businessSubmission.description_translations),
    short_description_translations: asTranslationRecord(businessSubmission.short_description_translations),
    address_translations: asTranslationRecord(businessSubmission.address_translations),
    category_translations:
      asTranslationRecord(
        (businessSubmission as { business_type_translations?: unknown }).business_type_translations,
      ) ??
      asTranslationRecord((businessSubmission as { category_translations?: unknown }).category_translations),
    originalData: businessSubmission
  }));
  
  items.push(...businessSubmissionItems);

  // Transform local resources
  items.push(...data.localresources.map(localService => ({
    id: localService.id,
    title: localService.name,
    description: localService.description || '',
    latitude: localService.latitude,
    longitude: localService.longitude,
    type: 'local-service' as const,
    address: localService.address,
    category: localService.category,
    name: localService.name,
    neighborhoods: localService.neighborhood,
    villages: localService.village,
    is_sponsored: localService.is_sponsored || false,
    name_translations: asTranslationRecord(localService.name_translations),
    title_translations: asTranslationRecord(localService.name_translations),
    description_translations: asTranslationRecord(localService.description_translations),
    address_translations: asTranslationRecord(localService.address_translations),
    category_translations: asTranslationRecord(
      (localService as { category_translations?: unknown }).category_translations,
    ),
    originalData: localService
  })));

  // Transform local resource submissions
  items.push(...data.localresourcesubmissions.map(localresourcesubmission => ({
    id: localresourcesubmission.id,
    title: localresourcesubmission.name,
    description: localresourcesubmission.description || '',
    latitude: localresourcesubmission.latitude,
    longitude: localresourcesubmission.longitude,
    type: 'local-service' as const,
    address: localresourcesubmission.address,
    category: localresourcesubmission.category,
    name: localresourcesubmission.name,
    neighborhoods: localresourcesubmission.neighborhood,
    villages: localresourcesubmission.village,
    is_sponsored: localresourcesubmission.is_sponsored || false,
    name_translations: asTranslationRecord(localresourcesubmission.name_translations),
    title_translations: asTranslationRecord(localresourcesubmission.name_translations),
    description_translations: asTranslationRecord(localresourcesubmission.description_translations),
    address_translations: asTranslationRecord(localresourcesubmission.address_translations),
    category_translations: asTranslationRecord(
      (localresourcesubmission as { category_translations?: unknown }).category_translations,
    ),
    originalData: localresourcesubmission
  })));

  // Transform news
  items.push(...data.news.map(newsItem => ({
    id: newsItem.id,
    title: newsItem.title,
    description: newsItem.content || '',
    latitude: newsItem.latitude,
    longitude: newsItem.longitude,
    type: 'news' as const,
    address: newsItem.Address || newsItem.location,
    location: newsItem.location,
    content: newsItem.content,
    source: newsItem.source,
    date: newsItem.date_posted,
    villages: newsItem.villages,
    is_sponsored: newsItem.is_sponsored || false,
    title_translations: asTranslationRecord(newsItem.title_translations),
    content_translations: asTranslationRecord(newsItem.content_translations),
    location_translations: asTranslationRecord(newsItem.location_translations),
    originalData: newsItem
  })));

  return items;
};
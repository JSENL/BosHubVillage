import { useTranslation } from 'react-i18next';
import { useContentTranslation } from '@/hooks/useTranslation';
import { UnifiedItem } from '@/types/unifiedItem';

export const useMapTranslations = () => {
  const { t } = useTranslation();
  const { getTranslatedField, currentLanguage } = useContentTranslation();
  
  const getTranslatedMapData = (item: UnifiedItem) => {
    const tableMap = {
      event: 'events' as const,
      business: 'business' as const,
      'local-service': 'local_resources' as const,
      news: 'news' as const
    };
    
    const table = tableMap[item.type];
    if (!table) return {};

    return {
      title: getTranslatedField(item, 'title', table) || getTranslatedField(item, 'name', table),
      description: getTranslatedField(item, 'description', table),
      location: getTranslatedField(item, 'location', table) || getTranslatedField(item, 'address', table),
      address: getTranslatedField(item, 'address', table),
      category: getTranslatedField(item, 'category', table),
      'itemTypes.events': t('itemTypes.events'),
      'itemTypes.news': t('itemTypes.news'),
      'itemTypes.businesses': t('itemTypes.businesses'),
      'itemTypes.localServices': t('itemTypes.localServices'),
      'cards.viewDetails': t('cards.viewDetails'),
      'cards.free': t('cards.free'),
      'common.directions': t('common.directions'),
      'common.clickMarkerHint': t('common.clickMarkerHint')
    };
  };

  return {
    getTranslatedMapData,
    currentLanguage,
    isTranslationEnabled: currentLanguage !== 'en'
  };
};
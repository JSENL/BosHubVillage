
import { useTranslation } from 'react-i18next';
import { UnifiedItem } from '@/types/unifiedItem';

interface ResultsSummaryProps {
  allItems: UnifiedItem[];
  mappableItems: UnifiedItem[];
  selectedTypes: string[];
}

export const ResultsSummary = ({ allItems, mappableItems, selectedTypes }: ResultsSummaryProps) => {
  const { t } = useTranslation();
  const typeConfigs = [
    { type: 'event', label: t('types.event'), color: 'text-red-600', bgColor: 'bg-red-50' },
    { type: 'news', label: t('types.news'), color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { type: 'business', label: t('types.businesses'), color: 'text-green-600', bgColor: 'bg-green-50' },
    { type: 'local-service', label: t('types.services'), color: 'text-yellow-600', bgColor: 'bg-yellow-50' }
  ];

  // Add debug logging
  console.log('ResultsSummary - All items:', allItems.length);
  console.log('ResultsSummary - News items:', allItems.filter(item => item.type === 'news').length);
  console.log('ResultsSummary - Mappable news items:', mappableItems.filter(item => item.type === 'news').length);

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{t('summary.title')}</h2>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-500">{t('summary.realTimeUpdates')}</span>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {typeConfigs.map(({ type, label, color, bgColor }) => {
          const count = allItems.filter(item => item.type === type).length;
          const mappableCount = mappableItems.filter(item => item.type === type).length;
          
          console.log(`${label}: total=${count}, mappable=${mappableCount}`);
          
          return (
            <div key={type} className={`text-center p-4 rounded-lg ${bgColor}`}>
              <div className={`text-2xl font-bold ${color}`}>{count}</div>
              <div className="text-sm text-gray-600 font-medium">{label}</div>
              <div className="text-xs text-gray-400 mt-1">
                {mappableCount} {t('summary.onMap')}
              </div>
              <div className="text-xs text-gray-400">
                {selectedTypes.includes(type) ? t('summary.showing') : t('summary.hidden')}
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4 text-sm text-gray-500 flex justify-between items-center">
        <span>{t('summary.totalFiltered')}: {allItems.length} | {t('summary.itemsWithLocation')}: {mappableItems.length}</span>
        <span className="text-xs">{t('summary.lastUpdated')}: {new Date().toLocaleTimeString()}</span>
      </div>
    </div>
  );
};


import { UnifiedItem } from '@/types/unifiedItem';

interface ResultsSummaryProps {
  allItems: UnifiedItem[];
  mappableItems: UnifiedItem[];
  selectedTypes: string[];
}

export const ResultsSummary = ({ allItems, mappableItems, selectedTypes }: ResultsSummaryProps) => {
  const typeConfigs = [
    { type: 'event', label: 'Events', color: 'text-red-600', bgColor: 'bg-red-50' },
    { type: 'news', label: 'News', color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { type: 'business', label: 'Businesses', color: 'text-green-600', bgColor: 'bg-green-50' },
    { type: 'local-service', label: 'Services', color: 'text-yellow-600', bgColor: 'bg-yellow-50' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Live Results Summary</h2>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-500">Real-time updates</span>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {typeConfigs.map(({ type, label, color, bgColor }) => {
          const count = allItems.filter(item => item.type === type).length;
          const mappableCount = mappableItems.filter(item => item.type === type).length;
          
          return (
            <div key={type} className={`text-center p-4 rounded-lg ${bgColor}`}>
              <div className={`text-2xl font-bold ${color}`}>{count}</div>
              <div className="text-sm text-gray-600 font-medium">{label}</div>
              <div className="text-xs text-gray-400 mt-1">
                {mappableCount} on map
              </div>
              <div className="text-xs text-gray-400">
                {selectedTypes.includes(type) ? '✓ Showing' : '✗ Hidden'}
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4 text-sm text-gray-500 flex justify-between items-center">
        <span>Total filtered items: {allItems.length} | Items with location data: {mappableItems.length}</span>
        <span className="text-xs">Last updated: {new Date().toLocaleTimeString()}</span>
      </div>
    </div>
  );
};

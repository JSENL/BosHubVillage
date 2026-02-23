import { useTranslation } from 'react-i18next';
import { MapPin } from 'lucide-react';

export const MapLoadingState = () => {
  const { t } = useTranslation();
  return (
    <div className="grid grid-cols-1 gap-6 h-[600px]">
      <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl border border-purple-200 flex items-center justify-center p-8">
        <div className="text-center">
          <MapPin className="h-16 w-16 text-purple-400 mx-auto mb-4 animate-pulse" />
          <h3 className="text-2xl font-bold text-gray-700 mb-4">{t('map.loadingTitle')}</h3>
          <p className="text-gray-600">{t('emptyStates.fetchingConfiguration')}</p>
        </div>
      </div>
    </div>
  );
};

export const MapErrorState = () => {
  const { t } = useTranslation();
  return (
    <div className="grid grid-cols-1 gap-6 h-[600px]">
      <div className="bg-gradient-to-br from-red-100 to-orange-100 rounded-2xl border border-red-200 flex items-center justify-center p-8">
        <div className="text-center">
          <MapPin className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-700 mb-4">{t('map.unavailableTitle')}</h3>
          <p className="text-gray-600 mb-4">{t('map.unavailableMessage')}</p>
          <p className="text-sm text-gray-500">{t('map.unavailableHint')}</p>
        </div>
      </div>
    </div>
  );
};

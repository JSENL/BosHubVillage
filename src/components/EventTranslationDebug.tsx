import { useTranslation } from 'react-i18next';
import { useContentTranslation } from '@/hooks/useTranslation';
import { useEvents } from '@/hooks/useEvents';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const EventTranslationDebug = () => {
  const { t, i18n } = useTranslation();
  const { getTranslatedField, currentLanguage } = useContentTranslation();
  const { events } = useEvents();

  // Get first event for testing
  const sampleEvent = events[0];

  if (!sampleEvent) {
    return (
      <Card className="m-4">
        <CardHeader>
          <CardTitle>Translation Debug - No Events</CardTitle>
        </CardHeader>
        <CardContent>
          <p>No events available for testing</p>
        </CardContent>
      </Card>
    );
  }

  const translatedTitle = getTranslatedField(sampleEvent, 'title', 'events');
  const translatedDescription = getTranslatedField(sampleEvent, 'description', 'events');
  const translatedLocation = getTranslatedField(sampleEvent, 'location', 'events');
  const translatedCategory = getTranslatedField(sampleEvent, 'category', 'events');

  return (
    <Card className="m-4">
      <CardHeader>
        <CardTitle>Event Translation Debug</CardTitle>
        <Badge variant="outline">Current Language: {currentLanguage}</Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold">UI Translations:</h4>
          <p>Location: {t('cards.location')}</p>
          <p>Attendees: {t('cards.attendees')}</p>
          <p>View Details: {t('cards.viewDetails')}</p>
          <p>Free: {t('cards.free')}</p>
        </div>
        
        <div>
          <h4 className="font-semibold">Content Translations (First Event):</h4>
          <p><strong>Title:</strong> {translatedTitle}</p>
          <p><strong>Original Title:</strong> {sampleEvent.title}</p>
          <p><strong>Description:</strong> {translatedDescription}</p>
          <p><strong>Original Description:</strong> {sampleEvent.description}</p>
          <p><strong>Location:</strong> {translatedLocation}</p>
          <p><strong>Original Location:</strong> {sampleEvent.location}</p>
          <p><strong>Category:</strong> {translatedCategory}</p>
          <p><strong>Original Category:</strong> {sampleEvent.category}</p>
        </div>

        <div>
          <h4 className="font-semibold">Translation Fields Available:</h4>
          <p>title_translations: {JSON.stringify(sampleEvent.title_translations)}</p>
          <p>description_translations: {JSON.stringify(sampleEvent.description_translations)}</p>
          <p>location_translations: {JSON.stringify(sampleEvent.location_translations)}</p>
          <p>category_translations: {JSON.stringify(sampleEvent.category_translations)}</p>
        </div>
      </CardContent>
    </Card>
  );
};
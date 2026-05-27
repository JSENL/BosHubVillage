import { ContentHeroImageEditor } from '@/components/content/ContentHeroImageEditor';

interface EventHeroImageEditorProps {
  eventId: string;
  eventTitle: string;
  imageUrl: string | null | undefined;
  coverZoom?: number | null;
  coverFocusX?: number | null;
  coverFocusY?: number | null;
  canEdit: boolean;
}

/** Event detail hero — delegates to shared ContentHeroImageEditor (includes framing controls). */
export function EventHeroImageEditor({
  eventId,
  eventTitle,
  imageUrl,
  coverZoom,
  coverFocusX,
  coverFocusY,
  canEdit,
}: EventHeroImageEditorProps) {
  return (
    <ContentHeroImageEditor
      table="events"
      recordId={eventId}
      title={eventTitle}
      imageUrl={imageUrl}
      canEdit={canEdit}
      invalidateQueryKeys={[['events'], ['event', eventId]]}
      coverZoom={coverZoom}
      coverFocusX={coverFocusX}
      coverFocusY={coverFocusY}
      emptyStateHint="Event organizers and admins can upload a hero image anytime after the event is published."
    />
  );
}

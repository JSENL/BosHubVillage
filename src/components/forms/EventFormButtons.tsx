
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface EventFormButtonsProps {
  isGeocoding: boolean;
  isReady: boolean;
  onCancel: () => void;
}

const EventFormButtons = ({ isGeocoding, isReady, onCancel }: EventFormButtonsProps) => {
  return (
    <div className="flex space-x-3 pt-4">
      <Button
        type="submit"
        disabled={isGeocoding || !isReady}
        className="flex-1 bg-mbta-silver hover:bg-mbta-silver-dark text-white transition-colors"
      >
        {isGeocoding ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Creating Event...
          </>
        ) : (
          'Create Event'
        )}
      </Button>
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={isGeocoding}
        className="border-caribbean-teal text-caribbean-teal hover:bg-caribbean-teal/10"
      >
        Cancel
      </Button>
    </div>
  );
};

export default EventFormButtons;

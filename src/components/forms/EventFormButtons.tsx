
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
        className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
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
        className="border-purple-200 text-purple-600 hover:bg-purple-50"
      >
        Cancel
      </Button>
    </div>
  );
};

export default EventFormButtons;

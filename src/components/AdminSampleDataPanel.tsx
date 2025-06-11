
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { createAllSampleEvents, clearAllEvents } from '@/utils/createSampleData';
import { Database, Trash2, MapPin } from 'lucide-react';

export const AdminSampleDataPanel = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const handleCreateEvents = async () => {
    setIsCreating(true);
    try {
      await createAllSampleEvents();
    } finally {
      setIsCreating(false);
    }
  };

  const handleClearEvents = async () => {
    setIsClearing(true);
    try {
      await clearAllEvents();
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Sample Data Management
        </CardTitle>
        <CardDescription>
          Create or clear sample events for Boston neighborhoods: Roxbury, Dorchester, Mattapan, Hyde Park, and Jamaica Plain
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            onClick={handleCreateEvents}
            disabled={isCreating}
            className="flex items-center gap-2"
          >
            <MapPin className="h-4 w-4" />
            {isCreating ? 'Creating Events...' : 'Create Sample Events'}
          </Button>
          
          <Button
            onClick={handleClearEvents}
            disabled={isClearing}
            variant="destructive"
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            {isClearing ? 'Clearing Events...' : 'Clear All Events'}
          </Button>
        </div>
        
        <div className="text-sm text-gray-600 space-y-2">
          <p><strong>Note:</strong> These functions require admin privileges.</p>
          <p>Sample events will include diverse categories like music, food, sports, education, art, business, health, and family events across all Boston neighborhoods.</p>
        </div>
      </CardContent>
    </Card>
  );
};

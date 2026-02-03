import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { DuplicateItem } from '@/hooks/useCSVImport';
import { DataType } from '@/utils/csv';

interface CSVDuplicatesPanelProps {
  duplicates: DuplicateItem[];
  dataType: DataType;
  deletingId: string | null;
  onSkip: (csvRowIndex: number) => void;
  onDelete: (duplicate: DuplicateItem) => void;
}

export const CSVDuplicatesPanel = ({
  duplicates,
  dataType,
  deletingId,
  onSkip,
  onDelete,
}: CSVDuplicatesPanelProps) => {
  if (duplicates.length === 0) return null;

  const getTypeLabel = () => {
    switch (dataType) {
      case 'local_resources':
        return 'resource';
      case 'business':
        return 'business';
      default:
        return 'event';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-amber-700">
        <AlertTriangle className="h-5 w-5" />
        <Label className="text-amber-700 font-semibold">
          {duplicates.length} Potential Duplicate(s) Found
        </Label>
      </div>
      <p className="text-sm text-muted-foreground">
        The following items in your CSV match existing records. You can delete the existing
        record to allow import, or skip the row.
      </p>
      <div className="space-y-3 max-h-64 overflow-y-auto border rounded-lg p-3 bg-amber-50">
        {duplicates.map(dup => (
          <div
            key={dup.existingId}
            className="flex items-center justify-between gap-4 p-3 bg-white rounded-lg border border-amber-200"
          >
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">"{dup.matchValue}"</p>
              <p className="text-xs text-muted-foreground">
                CSV Row {dup.csvRowIndex + 2} matches existing {getTypeLabel()}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Existing:{' '}
                {(dup.existingData as Record<string, string>).address ||
                  (dup.existingData as Record<string, string>).location ||
                  'No address'}
              </p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <Button variant="outline" size="sm" onClick={() => onSkip(dup.csvRowIndex)}>
                Skip Row
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={deletingId === dup.existingId}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    {deletingId === dup.existingId ? 'Deleting...' : 'Delete Existing'}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Existing Record?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete the existing "{dup.matchValue}" from the
                      database. This cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => onDelete(dup)}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

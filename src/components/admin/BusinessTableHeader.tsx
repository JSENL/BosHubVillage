
import { Button } from '@/components/ui/button';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Building,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { Business } from '@/types/business';
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

interface BusinessTableHeaderProps {
  businesses: Business[];
  onDeleteAll: () => void;
  isDeleting: boolean;
}

export const BusinessTableHeader = ({ businesses, onDeleteAll, isDeleting }: BusinessTableHeaderProps) => {
  return (
    <CardHeader>
      <div className="flex items-center justify-between">
        <CardTitle className="flex items-center text-gray-900">
          <Building className="h-5 w-5 mr-2 text-purple-600" />
          Published Business ({businesses?.length || 0})
        </CardTitle>
        {businesses && businesses.length > 0 && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                size="sm"
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete All
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
                  Delete All Business
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete all {businesses.length} business? This action cannot be undone and will permanently remove all business data from the system.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={onDeleteAll}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete All
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </CardHeader>
  );
};

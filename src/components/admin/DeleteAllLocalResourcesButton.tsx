
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from '@/components/ui/alert-dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';

interface DeleteAllLocalResourcesButtonProps {
  localResourceCount: number;
  onUpdate: () => void;
}

export const DeleteAllLocalResourcesButton = ({ 
  localResourceCount, 
  onUpdate 
}: DeleteAllLocalResourcesButtonProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAll = async () => {
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('local_resources')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all records
      
      if (error) throw error;
      
      toast.success(`Successfully deleted all ${localResourceCount} local resources`);
      onUpdate();
    } catch (error: any) {
      console.error('Error deleting all local resources:', error);
      toast.error(`Failed to delete local resources: ${error.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  if (localResourceCount === 0) {
    return null;
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button 
          variant="destructive" 
          size="sm"
          disabled={isDeleting}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete All ({localResourceCount})
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete All Local Resources</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete all {localResourceCount} local resources? 
            This action cannot be undone and will permanently remove all local resources 
            from the database.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDeleteAll}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700"
          >
            {isDeleting ? 'Deleting...' : 'Delete All'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

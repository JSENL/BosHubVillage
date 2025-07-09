
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
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
import { Heart, Trash2, MapPin, Building2 } from 'lucide-react';
import { LocalResource } from '@/types/localServices';

interface PublishedLocalResourcesTableProps {
  localResources: LocalResource[];
  onUpdate: () => void;
}

export const PublishedLocalResourcesTable = ({ 
  localResources, 
  onUpdate 
}: PublishedLocalResourcesTableProps) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const { error } = await supabase
        .from('local_resources')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast.success('Local resource deleted successfully');
      onUpdate();
    } catch (error: any) {
      console.error('Error deleting local resource:', error);
      toast.error(`Failed to delete local resource: ${error.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-gray-900">
          <Heart className="h-5 w-5 mr-2 text-purple-600" />
          Published Local Resources ({localResources.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {localResources.length === 0 ? (
          <div className="text-center p-8">
            <Heart className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Local Resources</h3>
            <p className="text-gray-600">There are no published local resources yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {localResources.map((resource) => (
                  <TableRow key={resource.id}>
                    <TableCell>
                      <div className="font-medium">{resource.name}</div>
                      {resource.description && (
                        <div className="text-sm text-gray-500 mt-1 truncate max-w-xs">
                          {resource.description}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Building2 className="h-4 w-4 mr-1 text-gray-400" />
                        <span className="capitalize">{resource.category}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                        <div>
                          <div>{resource.neighborhood}</div>
                          {resource.village && (
                            <div className="text-gray-500">{resource.village}</div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {formatDate(resource.created_at)}
                    </TableCell>
                    <TableCell>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            disabled={deletingId === resource.id}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Local Resource</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{resource.name}"? 
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel disabled={deletingId === resource.id}>
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDelete(resource.id)}
                              disabled={deletingId === resource.id}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              {deletingId === resource.id ? 'Deleting...' : 'Delete'}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

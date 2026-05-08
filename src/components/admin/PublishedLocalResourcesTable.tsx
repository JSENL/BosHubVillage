import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
import { Bird, Trash2, MapPin, Building2, Edit } from 'lucide-react';
import { LocalResource } from '@/types/localresources';
import { EditLocalResourceDialog } from './EditLocalResourceDialog';

interface PublishedLocalResourcesTableProps {
  localResources: LocalResource[];
  onUpdate: () => void;
}

export const PublishedLocalResourcesTable = ({ 
  localResources, 
  onUpdate 
}: PublishedLocalResourcesTableProps) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingResource, setEditingResource] = useState<LocalResource | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkDeleting, setBulkDeleting] = useState(false);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(localResources.map(r => r.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedIds);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedIds(newSelected);
  };

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

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    
    setBulkDeleting(true);
    try {
      const { error } = await supabase
        .from('local_resources')
        .delete()
        .in('id', Array.from(selectedIds));

      if (error) throw error;

      toast.success(`${selectedIds.size} local resource(s) deleted successfully`);
      setSelectedIds(new Set());
      onUpdate();
    } catch (error: any) {
      console.error('Error bulk deleting local resources:', error);
      toast.error('Failed to delete local resources');
    } finally {
      setBulkDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const allSelected = localResources.length > 0 && 
    localResources.every(r => selectedIds.has(r.id));
  const someSelected = selectedIds.size > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-gray-900">
          <div className="flex items-center">
            <Bird className="h-5 w-5 mr-2 text-purple-600" />
            Published Local Resources ({localResources.length})
          </div>
          {someSelected && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  disabled={bulkDeleting}
                  variant="destructive"
                  size="sm"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {bulkDeleting ? 'Deleting...' : `Delete Selected (${selectedIds.size})`}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Selected Resources</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete {selectedIds.size} local resource(s)? 
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleBulkDelete}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Delete All
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {localResources.length === 0 ? (
          <div className="text-center p-8">
            <Bird className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Local Resources</h3>
            <p className="text-gray-600">There are no published local resources yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={allSelected}
                      onCheckedChange={handleSelectAll}
                      aria-label="Select all"
                    />
                  </TableHead>
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
                      <Checkbox
                        checked={selectedIds.has(resource.id)}
                        onCheckedChange={(checked) => handleSelectOne(resource.id, !!checked)}
                        aria-label={`Select ${resource.name}`}
                      />
                    </TableCell>
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
                      <div className="flex gap-2">
                        <Button
                          onClick={() => setEditingResource(resource)}
                          variant="outline"
                          size="sm"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
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
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
      
      {editingResource && (
        <EditLocalResourceDialog
          localResource={editingResource}
          open={!!editingResource}
          onOpenChange={(open) => !open && setEditingResource(null)}
          onUpdate={onUpdate}
        />
      )}
    </Card>
  );
};

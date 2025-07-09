
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Building,
  Trash2,
  MapPin,
  Edit,
  AlertTriangle
} from 'lucide-react';
import { Business } from '@/types/business';
import { EditBusinessDialog } from '@/components/admin/EditBusinessDialog';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
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

interface PublishedBusinessesTableProps {
  businesses: Business[];
  onUpdate: () => void;
}

export const PublishedBusinessesTable = ({ businesses, onUpdate }: PublishedBusinessesTableProps) => {
  const [editingBusiness, setEditingBusiness] = useState<Business | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const handleDeleteBusiness = async (businessId: string) => {
    setActionLoading(businessId);
    try {
      const { error } = await supabase
        .from('business')
        .delete()
        .eq('id', businessId);

      if (error) throw error;

      toast.success('Business deleted successfully');
      onUpdate();
    } catch (error: any) {
      console.error('Error deleting business:', error);
      toast.error('Failed to delete business');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteAllBusinesses = async () => {
    setActionLoading('all');
    try {
      const { error } = await supabase
        .from('business')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all records

      if (error) throw error;

      toast.success('All businesses deleted successfully');
      onUpdate();
    } catch (error: any) {
      console.error('Error deleting all businesses:', error);
      toast.error('Failed to delete all businesses');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center text-gray-900">
              <Building className="h-5 w-5 mr-2 text-purple-600" />
              Published Businesses ({businesses?.length || 0})
            </CardTitle>
            {businesses && businesses.length > 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={actionLoading === 'all'}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete All
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center">
                      <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
                      Delete All Businesses
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete all {businesses.length} businesses? This action cannot be undone and will permanently remove all business data from the system.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteAllBusinesses}
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
        <CardContent>
          {!businesses || businesses.length === 0 ? (
            <div className="text-center p-8">
              <Building className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Published Businesses</h3>
              <p className="text-gray-600">Published businesses will appear here.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Business</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Neighborhood</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {businesses.map((business) => (
                  <TableRow key={business.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{business.title}</div>
                        <div className="text-sm text-gray-500">{business.short_description}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{business.business_type}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <MapPin className="h-4 w-4 mr-1" />
                        {business.address}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{business.neighborhood}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => setEditingBusiness(business)}
                          variant="outline"
                          size="sm"
                          disabled={actionLoading === business.id}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="destructive"
                              size="sm"
                              disabled={actionLoading === business.id}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Business</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{business.title}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteBusiness(business.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
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
          )}
        </CardContent>
      </Card>

      {editingBusiness && (
        <EditBusinessDialog
          business={editingBusiness}
          open={!!editingBusiness}
          onOpenChange={(open) => !open && setEditingBusiness(null)}
          onUpdate={onUpdate}
        />
      )}
    </>
  );
};

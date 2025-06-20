
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
  Edit
} from 'lucide-react';
import { Business } from '@/types/business';
import { EditBusinessDialog } from '@/components/admin/EditBusinessDialog';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface PublishedBusinessesTableProps {
  businesses: Business[];
  onUpdate: () => void;
}

export const PublishedBusinessesTable = ({ businesses, onUpdate }: PublishedBusinessesTableProps) => {
  const [editingBusiness, setEditingBusiness] = useState<Business | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const handleDeleteBusiness = async (businessId: string) => {
    if (!confirm('Are you sure you want to delete this business? This action cannot be undone.')) {
      return;
    }

    setActionLoading(true);
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
      setActionLoading(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-gray-900">
            <Building className="h-5 w-5 mr-2 text-purple-600" />
            Published Businesses ({businesses?.length || 0})
          </CardTitle>
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
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDeleteBusiness(business.id)}
                          disabled={actionLoading}
                          variant="destructive"
                          size="sm"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
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

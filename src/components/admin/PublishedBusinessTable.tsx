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
  Building,
  MapPin,
  Trash2
} from 'lucide-react';
import { Business } from '@/types/business';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface PublishedBusinessTableProps {
  businesses: Business[];
  onUpdate: () => void;
}

export const PublishedBusinessTable = ({ businesses, onUpdate }: PublishedBusinessTableProps) => {
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const handleDeleteBusiness = async (businessId: string) => {
    if (!confirm('Are you sure you want to delete this business? This action cannot be undone.')) {
      return;
    }

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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-gray-900">
          <Building className="h-5 w-5 mr-2 text-purple-600" />
          Published Businesses ({businesses.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {businesses.length === 0 ? (
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
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {businesses.map((business) => (
                <TableRow key={business.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{business.title}</div>
                      {business.short_description && (
                        <div className="text-sm text-gray-500">{business.short_description}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{business.business_type}</div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="flex items-center text-sm">
                        <MapPin className="h-4 w-4 mr-1" />
                        {business.neighborhood}
                      </div>
                      <div className="text-xs text-gray-500">{business.address}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {new Date(business.created_at).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() => handleDeleteBusiness(business.id)}
                      disabled={actionLoading === business.id}
                      variant="destructive"
                      size="sm"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      {actionLoading === business.id ? 'Deleting...' : 'Delete'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
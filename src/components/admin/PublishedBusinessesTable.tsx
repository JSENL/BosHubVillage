
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Business } from '@/types/business';
import { EditBusinessDialog } from '@/components/admin/EditBusinessDialog';
import { BusinessTableHeader } from '@/components/admin/BusinessTableHeader';
import { BusinessTableRow } from '@/components/admin/BusinessTableRow';
import { BusinessEmptyState } from '@/components/admin/BusinessEmptyState';
import { useBusinessOperations } from '@/hooks/useBusinessOperations';

interface PublishedBusinessesTableProps {
  businesses: Business[];
  onUpdate: () => void;
}

export const PublishedBusinessesTable = ({ businesses, onUpdate }: PublishedBusinessesTableProps) => {
  const [editingBusiness, setEditingBusiness] = useState<Business | null>(null);
  const { handleDeleteBusiness, handleDeleteAllBusinesses, actionLoading } = useBusinessOperations(onUpdate);

  return (
    <>
      <Card>
        <BusinessTableHeader 
          businesses={businesses}
          onDeleteAll={handleDeleteAllBusinesses}
          isDeleting={actionLoading === 'all'}
        />
        <CardContent>
          {!businesses || businesses.length === 0 ? (
            <BusinessEmptyState />
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
                  <BusinessTableRow
                    key={business.id}
                    business={business}
                    onEdit={setEditingBusiness}
                    onDelete={handleDeleteBusiness}
                    isDeleting={actionLoading === business.id}
                  />
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

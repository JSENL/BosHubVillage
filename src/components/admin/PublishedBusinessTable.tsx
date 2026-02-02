import { useState, useMemo } from 'react';
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
  Building,
  MapPin,
  Trash2,
  Edit,
  UserCog,
  ArrowUpDown,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { Business } from '@/types/business';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { EditBusinessDialog } from './EditBusinessDialog';

interface PublishedBusinessTableProps {
  businesses: any[];
  onUpdate: () => void;
}

export const PublishedBusinessTable = ({ businesses, onUpdate }: PublishedBusinessTableProps) => {
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [editingBusiness, setEditingBusiness] = useState<any | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkDeleting, setBulkDeleting] = useState(false);

  const sortedBusinesses = useMemo(() => {
    if (!sortOrder) return businesses;
    
    return [...businesses].sort((a, b) => {
      const titleA = a.title.toLowerCase();
      const titleB = b.title.toLowerCase();
      
      if (sortOrder === 'asc') {
        return titleA.localeCompare(titleB);
      } else {
        return titleB.localeCompare(titleA);
      }
    });
  }, [businesses, sortOrder]);

  const handleSortToggle = () => {
    if (sortOrder === null) {
      setSortOrder('asc');
    } else if (sortOrder === 'asc') {
      setSortOrder('desc');
    } else {
      setSortOrder(null);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(sortedBusinesses.map(b => b.id)));
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

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    
    if (!confirm(`Are you sure you want to delete ${selectedIds.size} business(es)? This action cannot be undone.`)) {
      return;
    }

    setBulkDeleting(true);
    try {
      const { error } = await supabase
        .from('business')
        .delete()
        .in('id', Array.from(selectedIds));

      if (error) throw error;

      toast.success(`${selectedIds.size} business(es) deleted successfully`);
      setSelectedIds(new Set());
      onUpdate();
    } catch (error: any) {
      console.error('Error bulk deleting businesses:', error);
      toast.error('Failed to delete businesses');
    } finally {
      setBulkDeleting(false);
    }
  };

  const handleToggleSponsored = async (businessId: string, isSponsored: boolean) => {
    setActionLoading(businessId);
    try {
      const { error } = await supabase
        .from('business')
        .update({ is_sponsored: isSponsored })
        .eq('id', businessId);

      if (error) throw error;

      toast.success(`Business ${isSponsored ? 'marked as sponsored' : 'removed from sponsored'}`);
      onUpdate();
    } catch (error: any) {
      console.error('Error updating sponsored status:', error);
      toast.error('Failed to update sponsored status');
    } finally {
      setActionLoading(null);
    }
  };

  const allSelected = sortedBusinesses.length > 0 && 
    sortedBusinesses.every(b => selectedIds.has(b.id));
  const someSelected = selectedIds.size > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-gray-900">
          <div className="flex items-center">
            <Building className="h-5 w-5 mr-2 text-purple-600" />
            Published Businesses ({businesses.length})
          </div>
          {someSelected && (
            <Button
              onClick={handleBulkDelete}
              disabled={bulkDeleting}
              variant="destructive"
              size="sm"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {bulkDeleting ? 'Deleting...' : `Delete Selected (${selectedIds.size})`}
            </Button>
          )}
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
                <TableHead className="w-12">
                  <Checkbox
                    checked={allSelected}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all"
                  />
                </TableHead>
                <TableHead>
                  <button
                    onClick={handleSortToggle}
                    className="flex items-center gap-2 hover:text-foreground transition-colors"
                  >
                    Business
                    {sortOrder === null && <ArrowUpDown className="h-4 w-4" />}
                    {sortOrder === 'asc' && <ArrowUp className="h-4 w-4" />}
                    {sortOrder === 'desc' && <ArrowDown className="h-4 w-4" />}
                  </button>
                </TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Business Owner</TableHead>
                <TableHead>Sponsored</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedBusinesses.map((business) => (
                <TableRow key={business.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.has(business.id)}
                      onCheckedChange={(checked) => handleSelectOne(business.id, !!checked)}
                      aria-label={`Select ${business.title}`}
                    />
                  </TableCell>
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
                    <div>
                      {business.business_owner && business.business_owner.length > 0 ? (
                        <div>
                          <div className="text-sm font-medium">
                            {business.business_owner[0].profiles?.full_name || 'Unknown'}
                          </div>
                          <div className="text-xs text-gray-500">
                            {business.business_owner[0].profiles?.email || 'No email'}
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-400">No owner assigned</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => handleToggleSponsored(business.id, !business.is_sponsored)}
                      disabled={actionLoading === business.id}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        business.is_sponsored 
                          ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {business.is_sponsored ? '⭐ Sponsored' : '☆ Regular'}
                    </button>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {new Date(business.created_at).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
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
                        disabled={actionLoading === business.id}
                        variant="destructive"
                        size="sm"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        {actionLoading === business.id ? 'Deleting...' : 'Delete'}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
      
      {editingBusiness && (
        <EditBusinessDialog
          business={editingBusiness}
          open={!!editingBusiness}
          onOpenChange={(open) => !open && setEditingBusiness(null)}
          onUpdate={onUpdate}
        />
      )}
    </Card>
  );
};
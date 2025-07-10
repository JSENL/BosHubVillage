
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TableCell, TableRow } from '@/components/ui/table';
import { 
  Trash2,
  MapPin,
  Edit,
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

interface BusinessTableRowProps {
  business: Business;
  onEdit: (business: Business) => void;
  onDelete: (businessId: string) => void;
  isDeleting: boolean;
}

export const BusinessTableRow = ({ business, onEdit, onDelete, isDeleting }: BusinessTableRowProps) => {
  return (
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
            onClick={() => onEdit(business)}
            variant="outline"
            size="sm"
            disabled={isDeleting}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                size="sm"
                disabled={isDeleting}
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
                  onClick={() => onDelete(business.id)}
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
  );
};

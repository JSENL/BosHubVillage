import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';

interface CSVItem {
  id: string;
  name: string;
  type: string;
  neighborhood_focus: string;
  website: string | null;
}

export function CSVBoard() {
  const { data: items = [], isLoading } = useQuery({
    queryKey: ['csv-board-data'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('business')
        .select('id, title, business_type, neighborhood, website_link')
        .order('title');

      if (error) throw error;

      return (data || []).map((item) => ({
        id: item.id,
        name: item.title,
        type: item.business_type,
        neighborhood_focus: item.neighborhood,
        website: item.website_link,
      })) as CSVItem[];
    },
  });

  const downloadCSV = () => {
    if (items.length === 0) {
      toast.error('No data to download');
      return;
    }

    const headers = ['Name', 'Type', 'Neighborhood Focus', 'Website'];
    const csvRows = [
      headers.join(','),
      ...items.map((item) =>
        [
          `"${(item.name || '').replace(/"/g, '""')}"`,
          `"${(item.type || '').replace(/"/g, '""')}"`,
          `"${(item.neighborhood_focus || '').replace(/"/g, '""')}"`,
          `"${(item.website || '').replace(/"/g, '""')}"`,
        ].join(',')
      ),
    ];

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `business_data_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('CSV downloaded successfully');
  };

  if (isLoading) {
    return <div className="text-center py-8 text-muted-foreground">Loading data...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Business Data Export</h3>
        <Button onClick={downloadCSV} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Download CSV
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Neighborhood Focus</TableHead>
              <TableHead>Website</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">
                  No data available
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell>{item.neighborhood_focus}</TableCell>
                  <TableCell>
                    {item.website ? (
                      <a
                        href={item.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline truncate block max-w-[200px]"
                      >
                        {item.website}
                      </a>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <p className="text-sm text-muted-foreground">
        Showing {items.length} record{items.length !== 1 ? 's' : ''}
      </p>
    </div>
  );
}

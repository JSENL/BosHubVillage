import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Upload, Trash2 } from 'lucide-react';
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
  id?: string;
  name: string;
  type: string;
  neighborhood_focus: string;
  website: string;
}

export function CSVBoard() {
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  // Fetch data from database
  const { data: items = [], isLoading } = useQuery({
    queryKey: ['csv-board-data'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('csv_board_data')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map((item) => ({
        id: item.id,
        name: item.name,
        type: item.type || '',
        neighborhood_focus: item.neighborhood_focus || '',
        website: item.website || '',
      })) as CSVItem[];
    },
  });

  // Save to database mutation
  const saveMutation = useMutation({
    mutationFn: async (newItems: Omit<CSVItem, 'id'>[]) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const itemsToInsert = newItems.map(item => ({
        name: item.name,
        type: item.type || null,
        neighborhood_focus: item.neighborhood_focus || null,
        website: item.website || null,
        created_by: user?.id || null,
      }));

      const { error } = await supabase
        .from('csv_board_data')
        .insert(itemsToInsert);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['csv-board-data'] });
      toast.success('CSV data saved to database');
    },
    onError: (error) => {
      console.error('Save error:', error);
      toast.error('Failed to save CSV data');
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('csv_board_data')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['csv-board-data'] });
      toast.success('Row deleted');
    },
    onError: (error) => {
      console.error('Delete error:', error);
      toast.error('Failed to delete row');
    },
  });

  const parseCSV = (text: string): Omit<CSVItem, 'id'>[] => {
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length < 2) return [];

    // Skip header row
    const dataLines = lines.slice(1);
    
    return dataLines.map(line => {
      // Handle quoted values with commas inside
      const values: string[] = [];
      let current = '';
      let inQuotes = false;
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      values.push(current.trim());

      return {
        name: values[0] || '',
        type: values[1] || '',
        neighborhood_focus: values[2] || '',
        website: values[3] || '',
      };
    }).filter(item => item.name || item.type || item.neighborhood_focus || item.website);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast.error('Please upload a CSV file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const parsedItems = parseCSV(text);
      
      if (parsedItems.length === 0) {
        toast.error('No valid data found in CSV');
        return;
      }

      setFileName(file.name);
      saveMutation.mutate(parsedItems);
    };
    reader.onerror = () => {
      toast.error('Error reading file');
    };
    reader.readAsText(file);

    // Reset input so same file can be uploaded again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleDeleteRow = (id: string) => {
    deleteMutation.mutate(id);
  };

  if (isLoading) {
    return <div className="text-center py-8 text-muted-foreground">Loading data...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Business Data</h3>
          {fileName && (
            <p className="text-sm text-muted-foreground">Last uploaded: {fileName}</p>
          )}
        </div>
        <div>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            ref={fileInputRef}
            className="hidden"
          />
          <Button 
            onClick={handleUploadClick} 
            className="flex items-center gap-2"
            disabled={saveMutation.isPending}
          >
            <Upload className="h-4 w-4" />
            {saveMutation.isPending ? 'Saving...' : 'Upload CSV'}
          </Button>
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Neighborhood Focus</TableHead>
              <TableHead>Website</TableHead>
              <TableHead className="w-[60px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  Upload a CSV file to display data
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
                        href={item.website.startsWith('http') ? item.website : `https://${item.website}`}
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
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => item.id && handleDeleteRow(item.id)}
                      disabled={deleteMutation.isPending}
                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {items.length > 0 && (
        <p className="text-sm text-muted-foreground">
          Showing {items.length} record{items.length !== 1 ? 's' : ''} (persisted in database)
        </p>
      )}
    </div>
  );
}

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

const BookmarksManagement = () => {
  const { data: bookmarks, isLoading } = useQuery({
    queryKey: ['admin-bookmarks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_bookmarks')
        .select(`
          *,
          profiles (full_name, email)
        `)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      return data;
    }
  });

  const { data: bookmarkStats } = useQuery({
    queryKey: ['admin-bookmark-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_bookmarks')
        .select('item_type')
        .then(result => {
          if (result.error) throw result.error;
          
          const stats = result.data.reduce((acc, bookmark) => {
            acc[bookmark.item_type] = (acc[bookmark.item_type] || 0) + 1;
            return acc;
          }, {} as Record<string, number>);
          
          return stats;
        });

      return data;
    }
  });

  if (isLoading) {
    return <div>Loading bookmarks data...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Bookmark Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {bookmarkStats && Object.entries(bookmarkStats).map(([type, count]) => (
          <Card key={type}>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{count}</div>
              <p className="text-xs text-muted-foreground">
                {type.charAt(0).toUpperCase() + type.slice(1)} Bookmarks
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Bookmarks */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Bookmarks</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Item Type</TableHead>
                <TableHead>Item ID</TableHead>
                <TableHead>Bookmarked At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookmarks?.map((bookmark) => (
                <TableRow key={bookmark.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{bookmark.profiles?.full_name || 'Unknown'}</div>
                      <div className="text-sm text-muted-foreground">{bookmark.profiles?.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{bookmark.item_type}</Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{bookmark.item_id}</TableCell>
                  <TableCell>{format(new Date(bookmark.created_at), 'MMM dd, yyyy HH:mm')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookmarksManagement;
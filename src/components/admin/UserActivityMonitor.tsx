import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

const UserActivityMonitor = () => {
  const { data: activities, isLoading } = useQuery({
    queryKey: ['admin-user-activities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_activities')
        .select(`
          *,
          profiles (full_name, email)
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return <div>Loading user activities...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent User Activities</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Activity Type</TableHead>
              <TableHead>Item Type</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activities?.map((activity) => (
              <TableRow key={activity.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{activity.profiles?.full_name || 'Unknown'}</div>
                    <div className="text-sm text-muted-foreground">{activity.profiles?.email}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{activity.activity_type}</Badge>
                </TableCell>
                <TableCell>{activity.item_type}</TableCell>
                <TableCell>{format(new Date(activity.created_at), 'MMM dd, yyyy HH:mm')}</TableCell>
                <TableCell>1</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default UserActivityMonitor;
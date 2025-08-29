import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const SocialNetworkAnalytics = () => {
  const { data: topUsers, isLoading: loadingTopUsers } = useQuery({
    queryKey: ['admin-top-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('followers_count', { ascending: false })
        .limit(20);

      if (error) throw error;
      return data;
    }
  });

  const { data: followRelations, isLoading: loadingFollows } = useQuery({
    queryKey: ['admin-follow-relations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_followers')
        .select(`
          *,
          follower_profile:profiles!user_followers_follower_id_fkey(full_name, email),
          following_profile:profiles!user_followers_following_id_fkey(full_name, email)
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data;
    }
  });

  const { data: networkStats } = useQuery({
    queryKey: ['admin-network-stats'],
    queryFn: async () => {
      const [
        { count: totalFollowRelations },
        { data: avgFollowersData }
      ] = await Promise.all([
        supabase.from('user_followers').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('followers_count, following_count')
      ]);

      const avgFollowers = avgFollowersData?.reduce((sum, p) => sum + p.followers_count, 0) / (avgFollowersData?.length || 1);
      const avgFollowing = avgFollowersData?.reduce((sum, p) => sum + p.following_count, 0) / (avgFollowersData?.length || 1);

      return {
        totalFollowRelations: totalFollowRelations || 0,
        avgFollowers: Math.round(avgFollowers || 0),
        avgFollowing: Math.round(avgFollowing || 0)
      };
    }
  });

  if (loadingTopUsers || loadingFollows) {
    return <div>Loading social network analytics...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Network Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{networkStats?.totalFollowRelations}</div>
            <p className="text-xs text-muted-foreground">Total Follow Relations</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{networkStats?.avgFollowers}</div>
            <p className="text-xs text-muted-foreground">Avg Followers per User</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{networkStats?.avgFollowing}</div>
            <p className="text-xs text-muted-foreground">Avg Following per User</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Users by Followers */}
        <Card>
          <CardHeader>
            <CardTitle>Top Users by Followers</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Followers</TableHead>
                  <TableHead>Following</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topUsers?.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{user.full_name || 'Unknown'}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{user.followers_count}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{user.following_count}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Recent Follow Relations */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Follow Relations</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Follower</TableHead>
                  <TableHead>Following</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {followRelations?.map((relation) => (
                  <TableRow key={relation.id}>
                    <TableCell>
                      <div className="text-sm">
                        {relation.follower_profile?.full_name || 'Unknown'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {relation.following_profile?.full_name || 'Unknown'}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SocialNetworkAnalytics;
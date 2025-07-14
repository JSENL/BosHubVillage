import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Users, Shield, UserMinus, UserCheck, AlertTriangle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
  user_roles: { role: string }[];
}

const AdminUserManagement = () => {
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    } else {
      setLoading(false);
    }
  }, [isAdmin]);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          user_roles (
            role
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch users.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    setActionLoading(userId);
    try {
      // First, remove existing role
      await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      // Then add new role
      const { error } = await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role: newRole as 'user' | 'admin'
        });

      if (error) throw error;

      await fetchUsers();
      toast({
        title: "Success",
        description: `User role updated to ${newRole}.`
      });
    } catch (error) {
      console.error('Error updating user role:', error);
      toast({
        title: "Error",
        description: "Failed to update user role.",
        variant: "destructive"
      });
    } finally {
      setActionLoading(null);
    }
  };

  const deleteUser = async (userId: string) => {
    if (userId === user?.id) {
      toast({
        title: "Error",
        description: "You cannot delete your own account.",
        variant: "destructive"
      });
      return;
    }

    setActionLoading(userId);
    try {
      // Call edge function to delete user from auth and cascade to other tables
      const { data, error } = await supabase.functions.invoke('delete-user', {
        body: { userId }
      });

      if (error) throw error;

      await fetchUsers();
      toast({
        title: "Success",
        description: "User account deleted successfully from authentication and all related data."
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Error",
        description: "Failed to delete user account.",
        variant: "destructive"
      });
    } finally {
      setActionLoading(null);
    }
  };

  const getUserRole = (userRoles: { role: string }[]) => {
    return userRoles.length > 0 ? userRoles[0].role : 'user';
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'destructive';
      case 'user': return 'default';
      default: return 'secondary';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Users className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p>Loading users...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{users.length}</p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Admins</p>
                <p className="text-2xl font-bold text-red-600">
                  {users.filter(u => getUserRole(u.user_roles) === 'admin').length}
                </p>
              </div>
              <Shield className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Regular Users</p>
                <p className="text-2xl font-bold text-blue-600">
                  {users.filter(u => getUserRole(u.user_roles) === 'user').length}
                </p>
              </div>
              <UserCheck className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((userProfile) => (
              <div key={userProfile.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="font-medium">
                        {userProfile.full_name || userProfile.email}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {userProfile.email}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Joined: {new Date(userProfile.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant={getRoleColor(getUserRole(userProfile.user_roles))}>
                      {getUserRole(userProfile.user_roles)}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Select
                      value={getUserRole(userProfile.user_roles)}
                      onValueChange={(newRole) => updateUserRole(userProfile.id, newRole)}
                      disabled={actionLoading === userProfile.id || userProfile.id === user?.id}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          disabled={actionLoading === userProfile.id || userProfile.id === user?.id}
                        >
                          <UserMinus className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-red-500" />
                            Confirm User Deletion
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <p>
                            Are you sure you want to delete the account for{' '}
                            <strong>{userProfile.full_name || userProfile.email}</strong>?
                          </p>
                          <p className="text-sm text-muted-foreground">
                            This action cannot be undone. All user data, submissions, and comments will be permanently deleted.
                          </p>
                          <div className="flex gap-2 justify-end">
                            <Button variant="outline" onClick={() => {}}>
                              Cancel
                            </Button>
                            <Button 
                              variant="destructive"
                              onClick={() => deleteUser(userProfile.id)}
                              disabled={actionLoading === userProfile.id}
                            >
                              Delete User
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
            ))}
            
            {users.length === 0 && (
              <div className="text-center py-8">
                <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No Users</h3>
                <p className="text-muted-foreground">No users found in the system.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUserManagement;
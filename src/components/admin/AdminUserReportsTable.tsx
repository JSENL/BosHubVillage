import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface UserReport {
  id: string;
  subject: string;
  message: string;
  priority: string;
  status: string;
  created_at: string;
  user_id: string;
  full_name: string | null;
}

const AdminUserReportsTable = () => {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const [reports, setReports] = useState<UserReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingReports, setUpdatingReports] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!isAdmin) return;
    fetchReports();
  }, [isAdmin]);

  const fetchReports = async () => {
    try {
      // First get user reports
      const { data: reportsData, error: reportsError } = await supabase
        .from('user_reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (reportsError) throw reportsError;

      // Get all unique user IDs
      const userIds = [...new Set(reportsData?.map(report => report.user_id) || [])];

      // Fetch profiles for these users
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', userIds);

      if (profilesError) throw profilesError;

      // Create a map of user_id to full_name
      const profilesMap = new Map(
        profilesData?.map(profile => [profile.id, profile.full_name]) || []
      );

      // Combine the data
      const combinedData = reportsData?.map(report => ({
        ...report,
        full_name: profilesMap.get(report.user_id) || null
      })) || [];

      setReports(combinedData);
    } catch (error) {
      console.error('Error fetching user reports:', error);
      toast({
        title: "Error",
        description: "Failed to fetch user reports",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (reportId: string, completed: boolean) => {
    setUpdatingReports(prev => new Set(prev).add(reportId));
    
    try {
      const { error } = await supabase
        .from('user_reports')
        .update({ status: completed ? 'completed' : 'pending' })
        .eq('id', reportId);

      if (error) throw error;

      setReports(prev => 
        prev.map(report => 
          report.id === reportId 
            ? { ...report, status: completed ? 'completed' : 'pending' }
            : report
        )
      );

      toast({
        title: "Success",
        description: `Report marked as ${completed ? 'completed' : 'pending'}`,
      });
    } catch (error) {
      console.error('Error updating report status:', error);
      toast({
        title: "Error",
        description: "Failed to update report status",
        variant: "destructive",
      });
    } finally {
      setUpdatingReports(prev => {
        const newSet = new Set(prev);
        newSet.delete(reportId);
        return newSet;
      });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'low':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isAdmin) {
    return null;
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User Reports</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="ml-2">Loading reports...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Reports</CardTitle>
        <p className="text-sm text-muted-foreground">
          Manage user reports and mark them as completed
        </p>
      </CardHeader>
      <CardContent>
        {reports.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No user reports found
          </p>
        ) : (
          <div className="space-y-4">
            {reports.map((report) => (
              <div key={report.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{report.subject}</h3>
                      <Badge variant={getPriorityColor(report.priority)}>
                        {report.priority}
                      </Badge>
                      <Badge className={getStatusColor(report.status)}>
                        {report.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      <strong>Reported by:</strong> {report.full_name || 'Unknown User'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(report.created_at).toLocaleDateString()} at{' '}
                      {new Date(report.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`completed-${report.id}`}
                      checked={report.status === 'completed'}
                      onCheckedChange={(checked) => 
                        handleStatusChange(report.id, checked as boolean)
                      }
                      disabled={updatingReports.has(report.id)}
                    />
                    <label 
                      htmlFor={`completed-${report.id}`} 
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {updatingReports.has(report.id) ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        'Completed'
                      )}
                    </label>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-sm">{report.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminUserReportsTable;
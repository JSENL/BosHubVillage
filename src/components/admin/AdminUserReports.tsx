import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { MessageCircle, User, Clock, AlertCircle } from 'lucide-react';

interface UserReport {
  id: string;
  user_id: string;
  subject: string;
  message: string;
  priority: string;
  status: string;
  admin_response?: string;
  reviewed_by?: string;
  created_at: string;
  updated_at: string;
  profiles?: {
    full_name: string | null;
    email: string;
  } | null;
}

const AdminUserReports = () => {
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  const [reports, setReports] = useState<UserReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<UserReport | null>(null);
  const [adminResponse, setAdminResponse] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  useEffect(() => {
    if (isAdmin) {
      fetchReports();
    } else {
      setLoading(false);
    }
  }, [isAdmin]);

  const fetchReports = async () => {
    try {
      const { data, error } = await supabase
        .from('user_reports')
        .select(`
          *,
          profiles (
            full_name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReports((data as any) || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
      toast({
        title: "Error",
        description: "Failed to fetch user reports.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateReport = async (reportId: string, updates: Partial<UserReport>) => {
    setUpdatingStatus(reportId);
    try {
      const { error } = await supabase
        .from('user_reports')
        .update({
          ...updates,
          reviewed_by: user?.id
        })
        .eq('id', reportId);

      if (error) throw error;

      await fetchReports();
      setSelectedReport(null);
      setAdminResponse('');
      
      toast({
        title: "Success",
        description: "Report updated successfully."
      });
    } catch (error) {
      console.error('Error updating report:', error);
      toast({
        title: "Error",
        description: "Failed to update report.",
        variant: "destructive"
      });
    } finally {
      setUpdatingStatus(null);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'destructive';
      case 'reviewed': return 'default';
      case 'resolved': return 'secondary';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <MessageCircle className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p>Loading user reports...</p>
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
                <p className="text-sm font-medium text-muted-foreground">Total Reports</p>
                <p className="text-2xl font-bold">{reports.length}</p>
              </div>
              <MessageCircle className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-red-600">
                  {reports.filter(r => r.status === 'pending').length}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Resolved</p>
                <p className="text-2xl font-bold text-green-600">
                  {reports.filter(r => r.status === 'resolved').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reports.map((report) => (
              <div key={report.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">
                      {report.profiles?.full_name || report.profiles?.email}
                    </span>
                    <Badge variant={getPriorityColor(report.priority)}>
                      {report.priority}
                    </Badge>
                    <Badge variant={getStatusColor(report.status)}>
                      {report.status}
                    </Badge>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {new Date(report.created_at).toLocaleDateString()}
                  </span>
                </div>
                
                <h4 className="font-medium mb-2">{report.subject}</h4>
                <p className="text-sm text-muted-foreground mb-4">{report.message}</p>
                
                {report.admin_response && (
                  <div className="bg-muted p-3 rounded-md mb-4">
                    <p className="text-sm font-medium mb-1">Admin Response:</p>
                    <p className="text-sm">{report.admin_response}</p>
                  </div>
                )}
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setSelectedReport(report);
                      setAdminResponse(report.admin_response || '');
                    }}
                    disabled={updatingStatus === report.id}
                  >
                    Respond
                  </Button>
                  
                  {report.status === 'pending' && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => updateReport(report.id, { status: 'reviewed' })}
                      disabled={updatingStatus === report.id}
                    >
                      Mark as Reviewed
                    </Button>
                  )}
                  
                  {report.status !== 'resolved' && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => updateReport(report.id, { status: 'resolved' })}
                      disabled={updatingStatus === report.id}
                    >
                      Mark as Resolved
                    </Button>
                  )}
                </div>
              </div>
            ))}
            
            {reports.length === 0 && (
              <div className="text-center py-8">
                <MessageCircle className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No Reports</h3>
                <p className="text-muted-foreground">No user reports have been submitted yet.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {selectedReport && (
        <Card>
          <CardHeader>
            <CardTitle>Respond to Report</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="font-medium">Subject: {selectedReport.subject}</p>
                <p className="text-sm text-muted-foreground">
                  From: {selectedReport.profiles?.full_name || selectedReport.profiles?.email}
                </p>
              </div>
              
              <Textarea
                value={adminResponse}
                onChange={(e) => setAdminResponse(e.target.value)}
                placeholder="Enter your response..."
                rows={4}
              />
              
              <div className="flex gap-2">
                <Button 
                  onClick={() => updateReport(selectedReport.id, { 
                    admin_response: adminResponse,
                    status: 'reviewed'
                  })}
                  disabled={updatingStatus === selectedReport.id}
                >
                  Send Response
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSelectedReport(null);
                    setAdminResponse('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminUserReports;
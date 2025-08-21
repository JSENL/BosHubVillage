import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card>
          <CardContent className="py-10 flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span>Checking admin access...</span>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/" state={{ from: location, unauthorized: true }} replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;

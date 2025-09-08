import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Calendar, Building2, Newspaper, Users, MapPin } from 'lucide-react';

export const FallbackTrendingSection = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Popular Right Now
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Sample Events */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="h-4 w-4 text-purple-600" />
            <h4 className="font-medium text-sm">Community Events</h4>
          </div>
          <div className="space-y-2">
            <div className="hover:bg-muted/50 p-2 rounded-md transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Local Farmers Market</p>
                  <p className="text-xs text-muted-foreground">Downtown Plaza</p>
                </div>
                <Badge variant="secondary" className="text-xs">
                  Weekend
                </Badge>
              </div>
            </div>
            <div className="hover:bg-muted/50 p-2 rounded-md transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Community Cleanup</p>
                  <p className="text-xs text-muted-foreground">City Park</p>
                </div>
                <Badge variant="secondary" className="text-xs">
                  This Week
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Sample Businesses */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Building2 className="h-4 w-4 text-blue-600" />
            <h4 className="font-medium text-sm">Local Businesses</h4>
          </div>
          <div className="space-y-2">
            <div className="hover:bg-muted/50 p-2 rounded-md transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Community Coffee</p>
                  <p className="text-xs text-muted-foreground">Cafe</p>
                </div>
                <Badge variant="outline" className="text-xs">
                  Popular
                </Badge>
              </div>
            </div>
            <div className="hover:bg-muted/50 p-2 rounded-md transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Local Bookstore</p>
                  <p className="text-xs text-muted-foreground">Books & More</p>
                </div>
                <Badge variant="outline" className="text-xs">
                  New
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Sample News */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Newspaper className="h-4 w-4 text-green-600" />
            <h4 className="font-medium text-sm">Community News</h4>
          </div>
          <div className="space-y-2">
            <div className="hover:bg-muted/50 p-2 rounded-md transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">New Park Opening</p>
                  <p className="text-xs text-muted-foreground">City News</p>
                </div>
                <Badge variant="outline" className="text-xs">
                  Today
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center pt-2 border-t">
          <p className="text-xs text-muted-foreground">
            Start exploring to see real trending content!
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
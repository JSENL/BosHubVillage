import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Navigation } from '@/components/Navigation';
import { useAuth } from '@/hooks/useAuth';
import { useBusinessOwnership } from '@/hooks/useBusinessOwnership';
import { MapPin, Building, Star, MessageCircle, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import BusinessMessages from '@/components/BusinessMessages';

const BusinessDashboard = () => {
  const { user } = useAuth();
  const { ownedBusinesses, isLoading } = useBusinessOwnership();

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">Please log in to access your business dashboard.</p>
              <Link to="/auth">
                <Button className="mt-4">Login</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-4">
            <div className="h-8 bg-muted animate-pulse rounded" />
            <div className="h-64 bg-muted animate-pulse rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Business Dashboard</h1>
          <p className="text-muted-foreground">Manage your businesses and view customer feedback</p>
        </div>

        {!ownedBusinesses || ownedBusinesses.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No businesses found</h3>
              <p className="text-muted-foreground mb-4">
                You don't own any businesses yet. Submit a business to get started.
              </p>
              <Link to="/submit-business">
                <Button>Submit a Business</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {ownedBusinesses.map((business) => (
              <Card key={business.id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-xl mb-2">{business.title}</CardTitle>
                      <Badge variant="secondary" className="mb-2">
                        <Building className="h-3 w-3 mr-1" />
                        {business.business_type}
                      </Badge>
                      <div className="flex items-center text-muted-foreground text-sm">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{business.address}, {business.neighborhood}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium">
                            {business.average_rating > 0 ? business.average_rating.toFixed(1) : 'No ratings'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{business.comment_count} reviews</span>
                        </div>
                      </div>
                      <Link to={`/business/${business.id}`}>
                        <Button variant="outline" size="sm">View Public Page</Button>
                      </Link>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Description</h4>
                    <p className="text-muted-foreground text-sm">{business.description}</p>
                  </div>

                  {business.website_link && (
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <a 
                        href={business.website_link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline text-sm"
                      >
                        {business.website_link}
                      </a>
                    </div>
                  )}

                  <Separator />

                  <div>
                    <h4 className="font-medium mb-3">Recent Reviews</h4>
                    {business.business_comments.length === 0 ? (
                      <p className="text-muted-foreground text-sm">No reviews yet.</p>
                    ) : (
                      <div className="space-y-3">
                        {business.business_comments.slice(0, 3).map((comment) => (
                          <div key={comment.id} className="bg-muted/50 p-3 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-sm">
                                  {comment.profiles?.full_name || 'Anonymous'}
                                </span>
                                <div className="flex items-center">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-3 w-3 ${
                                        i < comment.rating 
                                          ? 'text-yellow-500 fill-current' 
                                          : 'text-muted-foreground'
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {new Date(comment.created_at).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">{comment.comment}</p>
                          </div>
                        ))}
                        {business.business_comments.length > 3 && (
                          <Link to={`/business/${business.id}`}>
                            <Button variant="ghost" size="sm" className="w-full">
                              View all {business.business_comments.length} reviews
                            </Button>
                          </Link>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Business Messages Section */}
                  <Separator />
                  <div>
                    <BusinessMessages businessId={business.id} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessDashboard;
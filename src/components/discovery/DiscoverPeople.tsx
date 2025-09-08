import { useState } from 'react';
import { useDiscoverPeople } from '@/hooks/useDiscoverPeople';
import { UserDiscoveryCard } from './UserDiscoveryCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RefreshCw, TrendingUp, Heart, MapPin, Sparkles } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';

export const DiscoverPeople = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('recommended');
  
  const {
    recommendedUsers,
    similarInterestUsers,
    trendingUsers,
    localUsers,
    isLoading,
  } = useDiscoverPeople();

  const refreshDiscovery = () => {
    queryClient.invalidateQueries({ queryKey: ['discover-people', user?.id] });
    queryClient.invalidateQueries({ queryKey: ['similar-interest-users', user?.id] });
    queryClient.invalidateQueries({ queryKey: ['trending-users', user?.id] });
    queryClient.invalidateQueries({ queryKey: ['local-users', user?.id] });
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Discover People</h3>
          <RefreshCw className="h-4 w-4 animate-spin" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-3 bg-gray-200 rounded w-20 mb-2"></div>
                  <div className="h-2 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="h-6 w-16 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-semibold">Discover People</h3>
        <Button 
          onClick={refreshDiscovery}
          variant="ghost" 
          size="sm"
          className="h-8 w-8 p-0"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 p-1 m-4 mb-0">
          <TabsTrigger value="recommended" className="text-xs">
            <Sparkles className="h-3 w-3 mr-1" />
            For You
          </TabsTrigger>
          <TabsTrigger value="categories" className="text-xs">
            <Heart className="h-3 w-3 mr-1" />
            More
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="recommended" className="p-4 pt-2">
          {recommendedUsers && recommendedUsers.length > 0 ? (
            <div className="space-y-3">
              {recommendedUsers.slice(0, 3).map((user) => (
                <UserDiscoveryCard 
                  key={user.id} 
                  user={user}
                  reason="New user"
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-100">
                <Sparkles className="h-8 w-8 mx-auto text-purple-500 mb-2" />
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Discover new people
                </p>
                <p className="text-xs text-gray-500 mb-3">
                  Complete your profile to get better recommendations
                </p>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={refreshDiscovery}
                  className="text-xs"
                >
                  Refresh
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="categories" className="p-4 pt-2">
          <div className="space-y-4">
            {/* Similar Interests */}
            {similarInterestUsers && similarInterestUsers.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="h-3 w-3" />
                  <span className="text-xs font-medium text-muted-foreground">Similar Interests</span>
                </div>
                <div className="space-y-2">
                  {similarInterestUsers.slice(0, 2).map((user) => (
                    <UserDiscoveryCard 
                      key={user.id} 
                      user={user}
                      reason="Similar interests"
                    />
                  ))}
                </div>
              </div>
            )}
            
            {/* Trending Users */}
            {trendingUsers && trendingUsers.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-3 w-3" />
                  <span className="text-xs font-medium text-muted-foreground">Trending</span>
                </div>
                <div className="space-y-2">
                  {trendingUsers.slice(0, 1).map((user) => (
                    <UserDiscoveryCard 
                      key={user.id} 
                      user={user}
                      reason="Trending"
                    />
                  ))}
                </div>
              </div>
            )}
            
            {/* Local Users */}
            {localUsers && localUsers.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-3 w-3" />
                  <span className="text-xs font-medium text-muted-foreground">Near You</span>
                </div>
                <div className="space-y-2">
                  {localUsers.slice(0, 1).map((user) => (
                    <UserDiscoveryCard 
                      key={user.id} 
                      user={user}
                      reason="Same location"
                    />
                  ))}
                </div>
              </div>
            )}
            
            {!similarInterestUsers?.length && !trendingUsers?.length && !localUsers?.length && (
              <div className="text-center py-6">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
                  <Heart className="h-8 w-8 mx-auto text-blue-500 mb-2" />
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    No matches found
                  </p>
                  <p className="text-xs text-gray-500 mb-3">
                    Add interests and location to your profile for better matches
                  </p>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={refreshDiscovery}
                    className="text-xs"
                  >
                    Try again
                  </Button>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
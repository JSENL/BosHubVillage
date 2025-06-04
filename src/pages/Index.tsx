
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, List, Map, Plus, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import EventsMap from '@/components/EventsMap';
import EventsList from '@/components/EventsList';
import EventsCalendar from '@/components/EventsCalendar';
import EventForm from '@/components/EventForm';
import SearchBar from '@/components/SearchBar';
import { useAuth } from '@/hooks/useAuth';
import { useEvents } from '@/hooks/useEvents';
import { createSampleEvents } from '@/utils/sampleEvents';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { user, loading, isAdmin, signOut } = useAuth();
  const { events } = useEvents();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const handleCreateSampleEvents = async () => {
    try {
      await createSampleEvents();
      toast.success('Sample events created successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create sample events');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Map className="h-5 w-5 text-white" />
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to auth
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-purple-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Map className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                LocalEvents
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-gray-600" />
                <span className="text-sm text-gray-600">{user.email}</span>
                {isAdmin && (
                  <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                    Admin
                  </Badge>
                )}
              </div>

              {isAdmin && (
                <div className="flex space-x-2">
                  <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Event
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <EventForm onClose={() => setIsCreateDialogOpen(false)} />
                    </DialogContent>
                  </Dialog>

                  <Button 
                    variant="outline" 
                    onClick={handleCreateSampleEvents}
                    className="border-purple-200 text-purple-600 hover:bg-purple-50"
                  >
                    Add Sample Events
                  </Button>
                </div>
              )}

              <Button variant="outline" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <SearchBar 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>

        {/* View Tabs */}
        <Tabs defaultValue="map" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white/50 backdrop-blur-sm">
            <TabsTrigger value="map" className="flex items-center space-x-2">
              <Map className="h-4 w-4" />
              <span>Map</span>
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Calendar</span>
            </TabsTrigger>
            <TabsTrigger value="list" className="flex items-center space-x-2">
              <List className="h-4 w-4" />
              <span>List</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="map" className="mt-6">
            <EventsMap searchQuery={searchQuery} selectedCategory={selectedCategory} events={events} />
          </TabsContent>

          <TabsContent value="calendar" className="mt-6">
            <EventsCalendar searchQuery={searchQuery} selectedCategory={selectedCategory} events={events} />
          </TabsContent>

          <TabsContent value="list" className="mt-6">
            <EventsList searchQuery={searchQuery} selectedCategory={selectedCategory} events={events} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;

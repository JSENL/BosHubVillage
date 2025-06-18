
import { 
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Home, 
  Calendar, 
  MapPin, 
  Plus, 
  User, 
  LogOut,
  Menu,
  Search,
  Building,
  Newspaper
} from "lucide-react";

interface NavigationProps {
  searchTerm?: string;
  onSearchChange?: (term: string) => void;
}

export const Navigation = ({ searchTerm = '', onSearchChange }: NavigationProps) => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  const handleNavigation = (path: string) => {
    window.location.href = path;
  };

  return (
    <div className="bg-white border-b border-gray-200 yelp-shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => handleNavigation('/')}
          >
            <div className="w-6 h-6 sm:w-8 sm:h-8 yelp-gradient rounded-lg flex items-center justify-center">
              <Home className="h-3 w-3 sm:h-5 sm:w-5 text-white" />
            </div>
            <h1 className="text-lg sm:text-2xl font-bold text-yelp-gray">LocalEvents</h1>
          </div>

          {/* Search Bar - Desktop */}
          {onSearchChange && (
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="pl-10 h-9 bg-gray-50 border-gray-200 focus:bg-white text-sm"
                />
              </div>
            </div>
          )}

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Menubar className="border-0 bg-transparent">
              <MenubarMenu>
                <MenubarTrigger className="cursor-pointer hover:bg-gray-100 text-sm">
                  <Home className="h-4 w-4 mr-2" />
                  Events
                </MenubarTrigger>
                <MenubarContent>
                  <MenubarItem onClick={() => handleNavigation('/')}>
                    <Home className="h-4 w-4 mr-2" />
                    All Events
                  </MenubarItem>
                  <MenubarItem onClick={() => handleNavigation('/?view=calendar')}>
                    <Calendar className="h-4 w-4 mr-2" />
                    Calendar View
                  </MenubarItem>
                  <MenubarItem onClick={() => handleNavigation('/?view=map')}>
                    <MapPin className="h-4 w-4 mr-2" />
                    Map View
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>

              {user && (
                <MenubarMenu>
                  <MenubarTrigger className="cursor-pointer hover:bg-gray-100 text-sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Submit
                  </MenubarTrigger>
                  <MenubarContent>
                    <MenubarItem onClick={() => handleNavigation('/submit-event')}>
                      <Calendar className="h-4 w-4 mr-2" />
                      Submit Event
                    </MenubarItem>
                    <MenubarItem onClick={() => handleNavigation('/submit-business')}>
                      <Building className="h-4 w-4 mr-2" />
                      Submit Business
                    </MenubarItem>
                    <MenubarItem onClick={() => handleNavigation('/submit-news')}>
                      <Newspaper className="h-4 w-4 mr-2" />
                      Submit News
                    </MenubarItem>
                  </MenubarContent>
                </MenubarMenu>
              )}

              <MenubarMenu>
                <MenubarTrigger className="cursor-pointer hover:bg-gray-100 text-sm">
                  <User className="h-4 w-4 mr-2" />
                  Account
                </MenubarTrigger>
                <MenubarContent>
                  {user ? (
                    <>
                      <MenubarItem disabled>
                        <User className="h-4 w-4 mr-2" />
                        <span className="truncate max-w-32">{user.email}</span>
                      </MenubarItem>
                      <MenubarSeparator />
                      <MenubarItem onClick={handleSignOut}>
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </MenubarItem>
                    </>
                  ) : (
                    <MenubarItem onClick={() => handleNavigation('/auth')}>
                      <User className="h-4 w-4 mr-2" />
                      Sign In
                    </MenubarItem>
                  )}
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Menubar className="border-0 bg-transparent">
              <MenubarMenu>
                <MenubarTrigger className="cursor-pointer hover:bg-gray-100 p-2">
                  <Menu className="h-5 w-5" />
                </MenubarTrigger>
                <MenubarContent align="end" className="w-56 bg-white">
                  {onSearchChange && (
                    <>
                      <div className="p-2">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input
                            placeholder="Search events..."
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="pl-10 h-8 bg-gray-50 border-gray-200 text-sm"
                          />
                        </div>
                      </div>
                      <MenubarSeparator />
                    </>
                  )}
                  <MenubarItem onClick={() => handleNavigation('/')}>
                    <Home className="h-4 w-4 mr-2" />
                    All Events
                  </MenubarItem>
                  <MenubarItem onClick={() => handleNavigation('/?view=calendar')}>
                    <Calendar className="h-4 w-4 mr-2" />
                    Calendar View
                  </MenubarItem>
                  <MenubarItem onClick={() => handleNavigation('/?view=map')}>
                    <MapPin className="h-4 w-4 mr-2" />
                    Map View
                  </MenubarItem>
                  <MenubarSeparator />
                  {user ? (
                    <>
                      <MenubarItem onClick={() => handleNavigation('/submit-event')}>
                        <Calendar className="h-4 w-4 mr-2" />
                        Submit Event
                      </MenubarItem>
                      <MenubarItem onClick={() => handleNavigation('/submit-business')}>
                        <Building className="h-4 w-4 mr-2" />
                        Submit Business
                      </MenubarItem>
                      <MenubarItem onClick={() => handleNavigation('/submit-news')}>
                        <Newspaper className="h-4 w-4 mr-2" />
                        Submit News
                      </MenubarItem>
                      <MenubarSeparator />
                      <MenubarItem disabled className="opacity-60">
                        <User className="h-4 w-4 mr-2" />
                        <span className="truncate">{user.email}</span>
                      </MenubarItem>
                      <MenubarItem onClick={handleSignOut}>
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </MenubarItem>
                    </>
                  ) : (
                    <MenubarItem onClick={() => handleNavigation('/auth')}>
                      <User className="h-4 w-4 mr-2" />
                      Sign In
                    </MenubarItem>
                  )}
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
          </div>
        </div>
      </div>
    </div>
  );
};

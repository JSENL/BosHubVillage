import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Search, User } from 'lucide-react';
import { toast } from 'sonner';

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
}

interface UserSearchProps {
  selectedUsers: string[];
  onUsersChange: (users: string[]) => void;
  onClose: () => void;
}

export const UserSearch = ({ selectedUsers, onUsersChange, onClose }: UserSearchProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Profile[]>([]);
  const [selectedProfiles, setSelectedProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);

  const searchUsers = async (term: string) => {
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, full_name')
        .or(`email.ilike.%${term}%,full_name.ilike.%${term}%`)
        .limit(10);

      if (error) throw error;
      
      // Filter out already selected users
      const filteredResults = (data || []).filter(
        profile => !selectedUsers.includes(profile.id)
      );
      
      setSearchResults(filteredResults);
    } catch (error) {
      console.error('Error searching users:', error);
      toast.error('Failed to search users');
    } finally {
      setLoading(false);
    }
  };

  const addUser = (profile: Profile) => {
    const newSelectedUsers = [...selectedUsers, profile.id];
    const newSelectedProfiles = [...selectedProfiles, profile];
    
    onUsersChange(newSelectedUsers);
    setSelectedProfiles(newSelectedProfiles);
    setSearchResults(searchResults.filter(p => p.id !== profile.id));
  };

  const removeUser = (userId: string) => {
    const newSelectedUsers = selectedUsers.filter(id => id !== userId);
    const newSelectedProfiles = selectedProfiles.filter(p => p.id !== userId);
    
    onUsersChange(newSelectedUsers);
    setSelectedProfiles(newSelectedProfiles);
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      searchUsers(searchTerm);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  // Load selected profiles on mount
  useEffect(() => {
    const loadSelectedProfiles = async () => {
      if (selectedUsers.length === 0) return;

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, email, full_name')
          .in('id', selectedUsers);

        if (error) throw error;
        setSelectedProfiles(data || []);
      } catch (error) {
        console.error('Error loading selected profiles:', error);
      }
    };

    loadSelectedProfiles();
  }, []);

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-background">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Invite Users</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by email or name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {selectedProfiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Selected Users:</h4>
          <div className="flex flex-wrap gap-2">
            {selectedProfiles.map((profile) => (
              <Badge key={profile.id} variant="secondary" className="flex items-center gap-1">
                <User className="h-3 w-3" />
                {profile.full_name || profile.email}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 ml-1"
                  onClick={() => removeUser(profile.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {searchResults.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Search Results:</h4>
          <div className="space-y-1 max-h-40 overflow-y-auto">
            {searchResults.map((profile) => (
              <div
                key={profile.id}
                className="flex items-center justify-between p-2 rounded border hover:bg-muted/50 cursor-pointer"
                onClick={() => addUser(profile)}
              >
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">
                      {profile.full_name || 'No name'}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {profile.email}
                    </div>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  Add
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {loading && (
        <div className="text-center text-sm text-muted-foreground">
          Searching...
        </div>
      )}
    </div>
  );
};
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export const EventsDebugTest = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    const testEventsQuery = async () => {
      try {
        console.log('🧪 Testing events query with user:', { 
          userId: user?.id, 
          isAdmin,
          isAuthenticated: !!user 
        });

        const { data, error } = await supabase
          .from('events')
          .select('id, title, is_private, created_by, latitude, longitude')
          .limit(5);

        if (error) {
          console.error('❌ Events query error:', error);
          setError(error.message);
        } else {
          console.log('✅ Events query success:', data);
          setEvents(data || []);
        }
      } catch (err: any) {
        console.error('❌ Events query exception:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    testEventsQuery();
  }, [user, isAdmin]);

  if (loading) return <div className="p-4 bg-yellow-100">Loading events test...</div>;

  return (
    <div className="p-4 bg-gray-100 rounded-lg m-4">
      <h3 className="font-bold text-lg mb-2">Events API Debug Test</h3>
      <div className="space-y-2">
        <p><strong>User ID:</strong> {user?.id || 'Not authenticated'}</p>
        <p><strong>Is Admin:</strong> {isAdmin ? 'Yes' : 'No'}</p>
        <p><strong>Events Count:</strong> {events.length}</p>
        {error && (
          <div className="bg-red-100 p-2 rounded">
            <strong>Error:</strong> {error}
          </div>
        )}
        {events.length > 0 && (
          <div className="bg-green-100 p-2 rounded">
            <strong>Sample Events:</strong>
            <ul className="list-disc ml-4">
              {events.slice(0, 3).map(event => (
                <li key={event.id}>
                  {event.title} (Private: {event.is_private ? 'Yes' : 'No'})
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
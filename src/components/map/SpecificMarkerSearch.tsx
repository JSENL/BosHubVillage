
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UnifiedItem } from '@/types/unifiedItem';

interface SpecificMarkerSearchProps {
  searchId: string;
  onMarkerFound?: (item: UnifiedItem) => void;
}

export const SpecificMarkerSearch = ({ searchId, onMarkerFound }: SpecificMarkerSearchProps) => {
  const [searchResult, setSearchResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchInCommentTables = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Search in comment tables
      const { data: eventComments, error: eventCommentsError } = await supabase
        .from('event_comments')
        .select('*')
        .eq('id', searchId);

      const { data: newsComments, error: newsCommentsError } = await supabase
        .from('news_comments')
        .select('*')
        .eq('id', searchId);

      const { data: businessComments, error: businessCommentsError } = await supabase
        .from('business_comments')
        .select('*')
        .eq('id', searchId);

      const { data: localResourcesComments, error: localResourcesCommentsError } = await supabase
        .from('local_resources_comments')
        .select('*')
        .eq('id', searchId);

      if (eventCommentsError || newsCommentsError || businessCommentsError || localResourcesCommentsError) {
        throw new Error('Error searching comment tables');
      }

      const allComments = [
        ...(eventComments || []).map(c => ({ ...c, table_type: 'event_comments' })),
        ...(newsComments || []).map(c => ({ ...c, table_type: 'news_comments' })),
        ...(businessComments || []).map(c => ({ ...c, table_type: 'business_comments' })),
        ...(localResourcesComments || []).map(c => ({ ...c, table_type: 'local_resources_comments' }))
      ];

      if (allComments.length > 0) {
        setSearchResult(allComments[0]);
        console.log('Found in comment tables:', allComments[0]);
      } else {
        setError('ID not found in any table');
      }

    } catch (err) {
      setError('Search failed');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchId) {
      searchInCommentTables();
    }
  }, [searchId]);

  const createTestMarker = () => {
    // Create a test marker for demonstration
    const testItem: UnifiedItem = {
      id: searchId,
      title: `Test Item (${searchId})`,
      description: 'This is a test marker created for the searched ID',
      latitude: 42.3601, // Boston coordinates
      longitude: -71.0589,
      type: 'event',
      address: 'Test Address, Boston, MA',
      location: 'Boston',
      category: 'Test Category'
    };

    if (onMarkerFound) {
      onMarkerFound(testItem);
    }
    
    console.log('Created test marker:', testItem);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold mb-3">Search Results for ID: {searchId}</h3>
      
      {loading && (
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          <span>Searching...</span>
        </div>
      )}

      {error && (
        <div className="text-red-600 mb-3">
          <p>{error}</p>
          <button 
            onClick={createTestMarker}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Create Test Marker Instead
          </button>
        </div>
      )}

      {searchResult && (
        <div className="space-y-2">
          <p><strong>Found in:</strong> {searchResult.table_type}</p>
          <p><strong>Comment:</strong> {searchResult.comment?.substring(0, 100)}...</p>
          <p><strong>Created:</strong> {new Date(searchResult.created_at).toLocaleDateString()}</p>
          <p className="text-amber-600">Note: This is a comment record, not a mappable item.</p>
        </div>
      )}
    </div>
  );
};

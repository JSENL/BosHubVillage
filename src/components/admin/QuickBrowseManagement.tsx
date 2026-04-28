import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { GripVertical, Plus, Trash2, Loader2, Search } from 'lucide-react';
import { useEvents } from '@/hooks/useEvents';
import { useNews } from '@/hooks/useNews';
import { useBusiness } from '@/hooks/useBusiness';
import { uselocalresources } from '@/hooks/uselocalresources';
import { transformDataToUnifiedItems } from '@/utils/data/dataTransformers';
import { useQuickBrowse, getQuickBrowseIds, type QuickBrowseItemType } from '@/hooks/useQuickBrowse';
import type { UnifiedItem } from '@/types/unifiedItem';

const typeLabels: Record<string, string> = {
  event: 'Event',
  news: 'Culture',
  business: 'Business',
  'local-service': 'Local Resource',
};

export const QuickBrowseManagement = () => {
  const { toast } = useToast();
  const [search, setSearch] = useState('');

  const { events, loading: eventsLoading } = useEvents();
  const { data: news, isLoading: newsLoading } = useNews();
  const { data: businesses, isLoading: businessLoading } = useBusiness();
  const { data: localresources, isLoading: localresourcesLoading } = uselocalresources();

  const allItems = useMemo(
    () =>
      transformDataToUnifiedItems({
        events: events ?? [],
        news: news ?? [],
        businesses: businesses ?? [],
        businessSubmissions: [],
        localresources: localresources ?? [],
        localresourcesubmissions: [],
      }),
    [events, news, businesses, localresources]
  );

  const { entries, isLoading: qbLoading, save, isSaving } = useQuickBrowse();

  const selectedItems = useMemo(() => {
    const ids = getQuickBrowseIds(entries);
    return ids
      .map(({ type, id }) => allItems.find(i => i.type === type && i.id === id))
      .filter((i): i is UnifiedItem => !!i);
  }, [entries, allItems]);

  const selectedIds = new Set(selectedItems.map(i => `${i.type}:${i.id}`));

  const availableItems = useMemo(() => {
    const s = search.trim().toLowerCase();
    return allItems
      .filter(i => !selectedIds.has(`${i.type}:${i.id}`))
      .filter(i => !s || (i.title ?? i.name ?? '').toLowerCase().includes(s));
  }, [allItems, selectedIds, search]);

  const addItem = (item: UnifiedItem) => {
    if (selectedItems.length >= 10) return;
    const next = [
      ...selectedItems,
      item,
    ];
    saveItems(next);
  };

  const removeItem = (index: number) => {
    const next = selectedItems.filter((_, i) => i !== index);
    saveItems(next);
  };

  const moveItem = (from: number, to: number) => {
    const arr = [...selectedItems];
    const [removed] = arr.splice(from, 1);
    arr.splice(to, 0, removed);
    saveItems(arr);
  };

  const saveItems = (items: UnifiedItem[]) => {
    const payload = items.map(i => ({
      item_type: i.type as QuickBrowseItemType,
      item_id: i.id,
    }));
    save(payload)
      .then(() => toast({ title: 'Quick Browse updated', description: `${items.length} items saved.` }))
      .catch(() => toast({ title: 'Error', description: 'Failed to save Quick Browse.', variant: 'destructive' }));
  };

  const isLoading = eventsLoading || newsLoading || businessLoading || localresourcesLoading || qbLoading;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Browse</CardTitle>
        <CardDescription>
          Choose up to 10 items to show in Quick Browse on the home page. Drag to reorder.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <div>
              <h4 className="font-medium mb-2">Selected for Quick Browse ({selectedItems.length}/10)</h4>
              <div className="border rounded-lg divide-y min-h-[120px]">
                {selectedItems.length === 0 ? (
                  <div className="p-4 text-muted-foreground text-sm">No items selected. Add items below.</div>
                ) : (
                  selectedItems.map((item, index) => (
                    <div
                      key={`${item.type}:${item.id}`}
                      className="flex items-center gap-2 p-3 hover:bg-muted/50"
                    >
                      <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab flex-shrink-0" />
                      <Badge variant="secondary" className="text-xs flex-shrink-0">
                        {typeLabels[item.type] ?? item.type}
                      </Badge>
                      <span className="flex-1 truncate">{item.title ?? item.name ?? 'Untitled'}</span>
                      <div className="flex gap-1">
                        {index > 0 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8"
                            onClick={() => moveItem(index, index - 1)}
                          >
                            ↑
                          </Button>
                        )}
                        {index < selectedItems.length - 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8"
                            onClick={() => moveItem(index, index + 1)}
                          >
                            ↓
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 text-destructive"
                          onClick={() => removeItem(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Add from available items</h4>
              <div className="relative mb-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by title..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="border rounded-lg max-h-[240px] overflow-y-auto">
                {availableItems.length === 0 ? (
                  <div className="p-4 text-muted-foreground text-sm">
                    {allItems.length === 0 ? 'No items available.' : 'All items added or no matches.'}
                  </div>
                ) : (
                  availableItems.map(item => (
                    <div
                      key={`${item.type}:${item.id}`}
                      className="flex items-center gap-2 p-3 hover:bg-muted/50 border-b last:border-b-0"
                    >
                      <Badge variant="outline" className="text-xs flex-shrink-0">
                        {typeLabels[item.type] ?? item.type}
                      </Badge>
                      <span className="flex-1 truncate">{item.title ?? item.name ?? 'Untitled'}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8"
                        disabled={selectedItems.length >= 10}
                        onClick={() => addItem(item)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {isSaving && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

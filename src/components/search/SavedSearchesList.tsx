import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Bell, BellOff, Search } from 'lucide-react';
import { useSavedSearches } from '@/hooks/useSavedSearches';
import { useAuth } from '@/hooks/useAuth';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from 'react-i18next';

interface SavedSearchesListProps {
  onApplySearch?: (criteria: {
    searchTerm?: string;
    selectedCategory?: string;
    selectedNeighborhood?: string;
    selectedVillage?: string;
    selectedType?: string;
  }) => void;
}

export const SavedSearchesList = ({ onApplySearch }: SavedSearchesListProps) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { savedSearches, isLoading, deleteSearch, updateSearch, isDeleting } = useSavedSearches();

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t('savedSearches.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {t('savedSearches.signInPrompt')}
          </p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t('savedSearches.title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (savedSearches.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t('savedSearches.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {t('savedSearches.noSavedSearches')}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{t('savedSearches.title')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {savedSearches.map((search) => (
          <div
            key={search.id}
            className="flex items-start justify-between p-3 rounded-lg border bg-card"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium truncate">{search.name}</h4>
                {(search.notify_email || search.notify_in_app) ? (
                  <Bell className="h-3 w-3 text-primary" />
                ) : (
                  <BellOff className="h-3 w-3 text-muted-foreground" />
                )}
              </div>
              <div className="flex flex-wrap gap-1">
                {search.search_criteria.searchTerm && (
                  <Badge variant="secondary" className="text-xs">
                    "{search.search_criteria.searchTerm}"
                  </Badge>
                )}
                {search.search_criteria.selectedType && search.search_criteria.selectedType !== 'all' && (
                  <Badge variant="secondary" className="text-xs">
                    {search.search_criteria.selectedType}
                  </Badge>
                )}
                {search.search_criteria.selectedCategory && search.search_criteria.selectedCategory !== 'all' && (
                  <Badge variant="secondary" className="text-xs">
                    {search.search_criteria.selectedCategory}
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1 ml-2">
              {onApplySearch && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onApplySearch(search.search_criteria)}
                  className="h-8 w-8 p-0"
                >
                  <Search className="h-4 w-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteSearch(search.id)}
                disabled={isDeleting}
                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Newspaper, Plus, X, ExternalLink, Loader2 } from 'lucide-react';
import { useContentNewsLinks, ContentType } from '@/hooks/useContentNewsLinks';
import { format } from 'date-fns';

interface LinkedNewsSectionProps {
  contentType: ContentType;
  contentId: string;
  canEdit: boolean;
}

export const LinkedNewsSection = ({ contentType, contentId, canEdit }: LinkedNewsSectionProps) => {
  const { t } = useTranslation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { 
    linkedNews, 
    availableNews, 
    isLoading, 
    addLink, 
    removeLink,
    isAdding,
    isRemoving
  } = useContentNewsLinks(contentType, contentId);

  // Filter out already linked news
  const linkedNewsIds = linkedNews.map(link => link.news_id);
  const unlinkedNews = availableNews.filter(news => !linkedNewsIds.includes(news.id));

  const handleAddLink = (newsId: string) => {
    addLink(newsId);
    setIsDialogOpen(false);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  // Don't show section if no links and user can't edit
  if (linkedNews.length === 0 && !canEdit) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Newspaper className="h-5 w-5 text-primary" />
            {t('content.relatedNews', 'Related Culture')}
          </CardTitle>
          {canEdit && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  {t('content.linkNews', 'Link Culture')}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>{t('content.selectNewsArticle', 'Select Culture Article')}</DialogTitle>
                </DialogHeader>
                <Command className="rounded-lg border shadow-md">
                  <CommandInput placeholder={t('content.searchNews', 'Search culture articles...')} />
                  <CommandList>
                    <CommandEmpty>{t('content.noNewsFound', 'No culture articles found.')}</CommandEmpty>
                    <CommandGroup>
                      {unlinkedNews.map((news) => (
                        <CommandItem
                          key={news.id}
                          onSelect={() => handleAddLink(news.id)}
                          className="cursor-pointer"
                        >
                          <div className="flex flex-col gap-1 flex-1">
                            <span className="font-medium line-clamp-1">{news.title}</span>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>{news.source}</span>
                              <span>•</span>
                              <span>{format(new Date(news.date_posted), 'MMM d, yyyy')}</span>
                            </div>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {linkedNews.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {t('content.noLinkedNews', 'No culture articles linked yet.')}
          </p>
        ) : (
          <div className="space-y-3">
            {linkedNews.map((link) => (
              <div 
                key={link.id} 
                className="flex items-start justify-between gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <Link 
                  to={`/news/${link.news_id}`}
                  className="flex-1 min-w-0 group"
                >
                  <div className="flex items-start gap-2">
                    <Newspaper className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                        {link.news?.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {link.news?.source}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {link.news?.date_posted && format(new Date(link.news.date_posted), 'MMM d, yyyy')}
                        </span>
                      </div>
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary flex-shrink-0" />
                  </div>
                </Link>
                {canEdit && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 flex-shrink-0"
                    onClick={(e) => {
                      e.preventDefault();
                      removeLink(link.id);
                    }}
                    disabled={isRemoving}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

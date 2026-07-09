import { Mail, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { News } from '@/types/news';
import { cn } from '@/lib/utils';

type NewsSubmitterFields = Pick<News, 'submitter_name' | 'submitter_email'>;

export function hasNewsSubmitter(article: NewsSubmitterFields): boolean {
  return Boolean(article.submitter_name || article.submitter_email);
}

interface NewsSubmitterLineProps {
  article: NewsSubmitterFields;
  /** Admin views show name and email when both exist. */
  showEmail?: boolean;
  className?: string;
}

export const NewsSubmitterLine = ({
  article,
  showEmail = false,
  className,
}: NewsSubmitterLineProps) => {
  const { t } = useTranslation();
  const { submitter_name, submitter_email } = article;

  if (!submitter_name && !submitter_email) {
    return null;
  }

  const displayName = submitter_name || submitter_email;
  const emailOnly = !submitter_name && submitter_email;

  return (
    <div className={cn('flex flex-wrap items-center gap-x-1 text-xs text-muted-foreground', className)}>
      <User className="h-3 w-3 shrink-0" />
      <span className="font-medium">{t('admin.submitterEmail', 'Submitted by')}:</span>
      {emailOnly ? (
        <a
          href={`mailto:${submitter_email}`}
          className="inline-flex items-center gap-1 text-purple-700 hover:underline break-all"
        >
          <Mail className="h-3 w-3 shrink-0" />
          {submitter_email}
        </a>
      ) : (
        <span className="break-words">{displayName}</span>
      )}
      {showEmail && submitter_name && submitter_email && (
        <a
          href={`mailto:${submitter_email}`}
          className="inline-flex items-center gap-1 text-purple-700 hover:underline break-all"
        >
          <Mail className="h-3 w-3 shrink-0" />
          {submitter_email}
        </a>
      )}
    </div>
  );
};

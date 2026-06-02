import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderSearchButtonProps {
  className?: string;
}

/** Header icon linking to the public site-wide search page. */
export const HeaderSearchButton = ({ className }: HeaderSearchButtonProps) => {
  const { t } = useTranslation();

  return (
    <Button
      variant="ghost"
      size="icon"
      className={`h-9 w-9 shrink-0 ${className ?? ''}`}
      asChild
    >
      <Link to="/search" aria-label={t('navigation.search', 'Search')}>
        <Search className="h-5 w-5" />
      </Link>
    </Button>
  );
};

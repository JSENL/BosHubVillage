import React from 'react';
import { cn } from '@/lib/utils';

export interface ContentListRowLayoutProps {
  id?: string;
  /** Tighter vertical padding and smaller type scale */
  compact?: boolean;
  /** Announced for the row when focused (role="button") */
  ariaLabel?: string;
  onClick: () => void;
  /** Left strip (e.g. category gradient / hero) */
  leftVisual: React.ReactNode;
  sponsored?: React.ReactNode;
  /** Top row chips (type, category, etc.) */
  badges?: React.ReactNode;
  title: React.ReactNode;
  /** One–two line summary */
  snippet: React.ReactNode;
  /** Date, location, chips — keep concise */
  meta: React.ReactNode;
  /** Price, bookmark, chevron */
  trailing: React.ReactNode;
  className?: string;
}

/**
 * Shared list-row shell: left visual rail, scannable title + snippet + meta, trailing actions.
 * Keyboard-accessible like a large card row (Enter / Space activates).
 */
export function ContentListRowLayout({
  id,
  compact,
  ariaLabel,
  onClick,
  leftVisual,
  sponsored,
  badges,
  title,
  snippet,
  meta,
  trailing,
  className,
}: ContentListRowLayoutProps) {
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  const railMin = compact ? 'min-h-[56px]' : 'min-h-[72px]';
  const bodyPy = compact ? 'py-2' : 'py-3';

  return (
    <div
      id={id}
      role="button"
      tabIndex={0}
      aria-label={ariaLabel}
      onClick={onClick}
      onKeyDown={onKeyDown}
      className={cn(
        'group flex w-full min-w-0 cursor-pointer items-stretch rounded-lg border border-border/70 bg-card text-left shadow-sm transition-colors',
        'hover:border-primary/30 hover:bg-muted/40',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        railMin,
        className,
      )}
    >
      <div
        className={cn(
          'relative w-[4.5rem] shrink-0 overflow-hidden border-r border-border/50 sm:w-24',
          railMin,
        )}
      >
        {leftVisual}
      </div>

      <div className="flex min-w-0 flex-1 flex-col sm:flex-row sm:items-stretch">
        <div className={cn('flex min-w-0 flex-1 flex-col px-3', bodyPy, 'sm:pr-2')}>
          {sponsored ? <div className="mb-1.5">{sponsored}</div> : null}
          {badges ? (
            <div className="mb-1 flex flex-wrap items-center gap-1.5">{badges}</div>
          ) : null}
          <h3
            className={cn(
              'min-w-0 font-semibold leading-snug text-foreground group-hover:text-primary',
              compact ? 'text-sm line-clamp-2' : 'text-base line-clamp-2',
            )}
          >
            {title}
          </h3>
          <div
            className={cn(
              'mt-1 text-muted-foreground line-clamp-2 break-words',
              compact ? 'text-xs' : 'text-sm',
            )}
          >
            {snippet}
          </div>
          <div
            className={cn(
              'mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-muted-foreground',
              compact ? 'text-[11px]' : 'text-xs',
            )}
          >
            {meta}
          </div>
        </div>

        <div
          className={cn(
            'flex shrink-0 items-center justify-end gap-2 border-t border-border/60 px-3 pb-2 sm:flex-col sm:justify-center sm:border-l sm:border-t-0 sm:px-3 sm:py-3',
            compact ? 'sm:py-2' : '',
          )}
        >
          {trailing}
        </div>
      </div>
    </div>
  );
}

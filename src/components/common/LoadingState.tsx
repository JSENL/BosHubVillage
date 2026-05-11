interface LoadingStateProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingState = ({ message = 'Loading...', size = 'md' }: LoadingStateProps) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <div className={`animate-spin rounded-full border-b-2 border-blue-500 mx-auto mb-2 ${sizeClasses[size]}`}></div>
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
};

export const LoadingGrid = ({ count = 6 }: { count?: number }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="bg-white rounded-lg border shadow-sm p-4 animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      ))}
    </div>
  );
};

/** Matches wide `UnifiedItemCard` list rows (ContentListRowLayout rail + body). */
export const LoadingListRows = ({ count = 8 }: { count?: number }) => {
  return (
    <div className="flex w-full flex-col gap-2 sm:gap-3" aria-hidden>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="flex w-full min-h-[72px] animate-pulse overflow-hidden rounded-lg border border-border/70 bg-card"
        >
          <div className="w-[4.5rem] shrink-0 border-r border-border/50 bg-muted sm:w-24" />
          <div className="flex min-w-0 flex-1 flex-col justify-center gap-2 px-3 py-3 sm:flex-row sm:items-stretch">
            <div className="min-w-0 flex-1 space-y-2">
              <div className="h-3 w-24 rounded bg-muted" />
              <div className="h-4 w-[85%] max-w-md rounded bg-muted" />
              <div className="h-3 w-full rounded bg-muted" />
            </div>
            <div className="hidden w-12 shrink-0 sm:block" />
          </div>
        </div>
      ))}
    </div>
  );
};
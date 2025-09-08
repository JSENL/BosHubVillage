import { Search } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export const EmptyState = ({ 
  title = 'No items found',
  description = 'Try adjusting your search criteria.',
  icon,
  action
}: EmptyStateProps) => {
  return (
    <div className="text-center py-12">
      <div className="mb-4">
        {icon || <Search className="h-12 w-12 text-gray-400 mx-auto" />}
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 mb-4">{description}</p>
      {action}
    </div>
  );
};
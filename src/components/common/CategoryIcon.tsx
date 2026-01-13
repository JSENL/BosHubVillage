import { getCategoryIcon, getCategoryColor, getCategoryGradient } from '@/utils/categoryIcons';
import { cn } from '@/lib/utils';

interface CategoryIconProps {
  category: string;
  type?: 'event' | 'business' | 'local-service' | 'news';
  size?: 'sm' | 'md' | 'lg';
  showBackground?: boolean;
  className?: string;
}

export const CategoryIcon = ({
  category,
  type,
  size = 'md',
  showBackground = false,
  className,
}: CategoryIconProps) => {
  const Icon = getCategoryIcon(category, type);
  const color = getCategoryColor(category, type);
  
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-6 w-6',
  };
  
  const bgSizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  if (showBackground) {
    return (
      <div 
        className={cn(
          'rounded-full flex items-center justify-center shadow-sm',
          bgSizeClasses[size],
          className
        )}
        style={{ 
          background: getCategoryGradient(category, type),
        }}
      >
        <Icon className={cn(sizeClasses[size], 'text-white drop-shadow-sm')} />
      </div>
    );
  }

  return (
    <Icon 
      className={cn(sizeClasses[size], className)} 
      style={{ color }}
    />
  );
};

interface CategoryHeroProps {
  category: string;
  type?: 'event' | 'business' | 'local-service' | 'news';
  height?: string;
  className?: string;
}

export const CategoryHero = ({
  category,
  type,
  height = 'h-24',
  className,
}: CategoryHeroProps) => {
  const Icon = getCategoryIcon(category, type);
  
  return (
    <div 
      className={cn(
        'relative overflow-hidden',
        height,
        className
      )}
      style={{ background: getCategoryGradient(category, type) }}
    >
      {/* Decorative pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-2 left-4 w-12 h-12 rounded-full border-2 border-white/50" />
        <div className="absolute bottom-2 right-8 w-8 h-8 rounded-full border-2 border-white/30" />
        <div className="absolute top-1/2 right-1/4 w-6 h-6 rounded-full bg-white/20" />
      </div>
      
      {/* Main icon */}
      <div className="absolute top-3 left-3">
        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
          <Icon className="h-5 w-5 text-white drop-shadow-md" />
        </div>
      </div>
      
      {/* Gradient overlay for text readability */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/20 to-transparent" />
    </div>
  );
};

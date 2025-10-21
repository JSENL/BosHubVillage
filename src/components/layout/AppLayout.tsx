import { ReactNode } from 'react';
import { Navigation } from '@/components/common/Navigation';

interface AppLayoutProps {
  children: ReactNode;
  showHero?: boolean;
}

export const AppLayout = ({ children, showHero = false }: AppLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      {showHero && (
        <div className="hero-section">
          {/* Hero content can be passed as prop or rendered conditionally */}
        </div>
      )}
      <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        {children}
      </main>
    </div>
  );
};
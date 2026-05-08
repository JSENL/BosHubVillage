import { Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

interface DonateButtonProps {
  variant?: 'default' | 'outline' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  showIcon?: boolean;
  externalUrl?: string;
}

// Default donation URL - GoFundMe campaign
const DEFAULT_DONATE_URL = 'https://gofund.me/0680eb63c';

export const DonateButton = ({ 
  variant = 'default', 
  size = 'default',
  className = '',
  showIcon = true,
  externalUrl = DEFAULT_DONATE_URL
}: DonateButtonProps) => {
  const { t } = useTranslation();

  const handleDonate = () => {
    window.open(externalUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <Button 
      onClick={handleDonate}
      variant={variant}
      size={size}
      className={`bg-logo-coral-orange hover:bg-logo-coral-orange/90 text-white ${className}`}
    >
      {showIcon && <Gift className="h-4 w-4 mr-2" />}
      {t('navigation.donate', 'Donate')}
    </Button>
  );
};

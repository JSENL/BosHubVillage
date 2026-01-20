import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import SponsoredBadge from '@/components/common/SponsoredBadge';

describe('SponsoredBadge', () => {
  it('should render the Sponsored text', () => {
    const { getByText } = render(<SponsoredBadge />);
    expect(getByText('Sponsored')).toBeInTheDocument();
  });

  it('should render with default small size', () => {
    const { getByText } = render(<SponsoredBadge />);
    const badge = getByText('Sponsored').closest('div');
    expect(badge).toHaveClass('text-xs');
  });

  it('should render with medium size when specified', () => {
    const { getByText } = render(<SponsoredBadge size="md" />);
    const badge = getByText('Sponsored').closest('div');
    expect(badge).toHaveClass('text-sm');
  });

  it('should apply custom className', () => {
    const { getByText } = render(<SponsoredBadge className="my-custom-class" />);
    const badge = getByText('Sponsored').closest('div');
    expect(badge).toHaveClass('my-custom-class');
  });

  it('should have gradient background styling', () => {
    const { getByText } = render(<SponsoredBadge />);
    const badge = getByText('Sponsored').closest('div');
    expect(badge).toHaveClass('bg-gradient-to-r');
    expect(badge).toHaveClass('from-amber-500');
    expect(badge).toHaveClass('to-yellow-500');
  });
});

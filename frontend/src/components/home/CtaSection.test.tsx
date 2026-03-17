import { renderWithProviders, screen } from '@/test/test-utils';
import CtaSection from './CtaSection';

describe('CtaSection', () => {
  const defaultProps = {
    title: 'Ready to Start?',
    subtitle: 'Begin your journey today',
    buttonLabel: 'Get Started',
  };

  it('renders title, subtitle, and button', () => {
    renderWithProviders(<CtaSection {...defaultProps} />);
    expect(screen.getByText('Ready to Start?')).toBeInTheDocument();
    expect(screen.getByText('Begin your journey today')).toBeInTheDocument();
    expect(screen.getByText('Get Started')).toBeInTheDocument();
  });

  it('links the button to /learn', () => {
    renderWithProviders(<CtaSection {...defaultProps} />);
    const link = screen.getByText('Get Started').closest('a');
    expect(link).toHaveAttribute('href', '/learn');
  });
});

import { renderWithProviders, screen } from '@/test/test-utils';
import HeroSection from './HeroSection';

describe('HeroSection', () => {
  const defaultProps = {
    title: 'Ham Radio Exam Prep',
    subtitle: 'Pass your exam with confidence',
    getStartedLabel: 'Get Started',
    learnMoreLabel: 'Learn More',
  };

  it('renders title and subtitle', () => {
    renderWithProviders(<HeroSection {...defaultProps} />);
    expect(screen.getByText('Ham Radio Exam Prep')).toBeInTheDocument();
    expect(screen.getByText('Pass your exam with confidence')).toBeInTheDocument();
  });

  it('renders both buttons with correct links', () => {
    renderWithProviders(<HeroSection {...defaultProps} />);
    const getStarted = screen.getByText('Get Started').closest('a');
    expect(getStarted).toHaveAttribute('href', '/learn');
    const learnMore = screen.getByText('Learn More').closest('a');
    expect(learnMore).toHaveAttribute('href', '/about');
  });
});

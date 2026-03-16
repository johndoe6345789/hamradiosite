import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/test/test-utils';
import WeakAreasList from './WeakAreasList';
import type { TopicProgress } from '@/types/progress';

jest.mock('@/i18n/navigation', () => ({
  Link: ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

const mockWeakAreas: TopicProgress[] = [
  { topicId: '2', topicTitle: 'Technical Basics', topicSlug: 'technical-basics', totalAttempts: 3, averageScore: 55, lastAttemptDate: '2024-01-14' },
  { topicId: '4', topicTitle: 'Feeders & Antennas', topicSlug: 'feeders-antennas', totalAttempts: 2, averageScore: 45, lastAttemptDate: '2024-01-12' },
];

describe('WeakAreasList', () => {
  it('renders weak area topics', () => {
    renderWithProviders(<WeakAreasList weakAreas={mockWeakAreas} />);
    expect(screen.getByText('Technical Basics')).toBeInTheDocument();
    expect(screen.getByText('Feeders & Antennas')).toBeInTheDocument();
  });

  it('renders scores as chips', () => {
    renderWithProviders(<WeakAreasList weakAreas={mockWeakAreas} />);
    expect(screen.getByText('55%')).toBeInTheDocument();
    expect(screen.getByText('45%')).toBeInTheDocument();
  });

  it('renders practice more buttons', () => {
    renderWithProviders(<WeakAreasList weakAreas={mockWeakAreas} />);
    const practiceButtons = screen.getAllByText('Practice More');
    expect(practiceButtons).toHaveLength(2);
  });

  it('shows encouraging message when no weak areas', () => {
    renderWithProviders(<WeakAreasList weakAreas={[]} />);
    expect(screen.getByText(/great job/i)).toBeInTheDocument();
  });

  it('links to learn pages', () => {
    renderWithProviders(<WeakAreasList weakAreas={mockWeakAreas} />);
    const links = screen.getAllByRole('link');
    const learnLinks = links.filter((l) => l.getAttribute('href')?.includes('/learn/'));
    expect(learnLinks.length).toBeGreaterThan(0);
  });
});

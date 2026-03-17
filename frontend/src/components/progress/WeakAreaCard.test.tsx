import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/test/test-utils';
import WeakAreaCard from './WeakAreaCard';
import type { TopicProgress } from '@/types/progress';

jest.mock('@/i18n/navigation', () => ({
  Link: ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

const mockArea: TopicProgress = {
  topicId: 'topic-1',
  topicTitle: 'Licensing Conditions',
  topicSlug: 'licensing-conditions',
  totalAttempts: 5,
  averageScore: 42,
  lastAttemptDate: '2025-01-15',
};

describe('WeakAreaCard', () => {
  const defaultProps = {
    area: mockArea,
    attemptsLabel: 'attempts',
    studyLabel: 'Study',
    practiceLabel: 'Practice',
  };

  it('renders the topic title', () => {
    renderWithProviders(<WeakAreaCard {...defaultProps} />);
    expect(screen.getByText('Licensing Conditions')).toBeInTheDocument();
  });

  it('renders the average score chip', () => {
    renderWithProviders(<WeakAreaCard {...defaultProps} />);
    expect(screen.getByText('42%')).toBeInTheDocument();
  });

  it('renders the attempts chip with correct label', () => {
    renderWithProviders(<WeakAreaCard {...defaultProps} />);
    expect(screen.getByText('5 attempts')).toBeInTheDocument();
  });

  it('renders the study button linking to the learn page', () => {
    renderWithProviders(<WeakAreaCard {...defaultProps} />);
    const studyLink = screen.getByText('Study').closest('a');
    expect(studyLink).toHaveAttribute('href', '/learn/licensing-conditions');
  });

  it('renders the practice button linking to the quiz page', () => {
    renderWithProviders(<WeakAreaCard {...defaultProps} />);
    const practiceLink = screen.getByText('Practice').closest('a');
    expect(practiceLink).toHaveAttribute('href', '/quiz/topic-licensing-conditions');
  });

  it('renders the warning icon', () => {
    renderWithProviders(<WeakAreaCard {...defaultProps} />);
    expect(screen.getByTestId('WarningAmberIcon')).toBeInTheDocument();
  });

  it('renders with different area data', () => {
    const differentArea: TopicProgress = {
      topicId: 'topic-2',
      topicTitle: 'Safety',
      topicSlug: 'safety',
      totalAttempts: 3,
      averageScore: 30,
      lastAttemptDate: null,
    };
    renderWithProviders(
      <WeakAreaCard area={differentArea} attemptsLabel="tries" studyLabel="Review" practiceLabel="Quiz" />
    );
    expect(screen.getByText('Safety')).toBeInTheDocument();
    expect(screen.getByText('30%')).toBeInTheDocument();
    expect(screen.getByText('3 tries')).toBeInTheDocument();
    expect(screen.getByText('Review').closest('a')).toHaveAttribute('href', '/learn/safety');
    expect(screen.getByText('Quiz').closest('a')).toHaveAttribute('href', '/quiz/topic-safety');
  });
});

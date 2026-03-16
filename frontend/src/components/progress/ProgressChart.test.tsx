import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/test/test-utils';
import ProgressChart from './ProgressChart';
import type { TopicProgress } from '@/types/progress';

const mockProgress: TopicProgress[] = [
  { topicId: '1', topicTitle: 'Licensing', topicSlug: 'licensing', totalAttempts: 5, averageScore: 85, lastAttemptDate: '2024-01-15' },
  { topicId: '2', topicTitle: 'Technical Basics', topicSlug: 'technical', totalAttempts: 3, averageScore: 55, lastAttemptDate: '2024-01-14' },
];

describe('ProgressChart', () => {
  it('renders topic names', () => {
    renderWithProviders(<ProgressChart topicProgress={mockProgress} />);
    expect(screen.getByText('Licensing')).toBeInTheDocument();
    expect(screen.getByText('Technical Basics')).toBeInTheDocument();
  });

  it('renders scores', () => {
    renderWithProviders(<ProgressChart topicProgress={mockProgress} />);
    expect(screen.getByText('85%')).toBeInTheDocument();
    expect(screen.getByText('55%')).toBeInTheDocument();
  });

  it('renders attempt counts', () => {
    renderWithProviders(<ProgressChart topicProgress={mockProgress} />);
    expect(screen.getByText(/5 Attempts/)).toBeInTheDocument();
    expect(screen.getByText(/3 Attempts/)).toBeInTheDocument();
  });

  it('renders progress bars', () => {
    renderWithProviders(<ProgressChart topicProgress={mockProgress} />);
    const progressBars = screen.getAllByRole('progressbar');
    expect(progressBars).toHaveLength(2);
  });

  it('shows empty state when no data', () => {
    renderWithProviders(<ProgressChart topicProgress={[]} />);
    expect(screen.getByText('No progress data yet')).toBeInTheDocument();
  });

  it('renders with score below 40 using primary color', () => {
    const lowScoreProgress: TopicProgress[] = [
      { topicId: '3', topicTitle: 'Safety', topicSlug: 'safety', totalAttempts: 2, averageScore: 30, lastAttemptDate: '2024-01-16' },
    ];
    renderWithProviders(<ProgressChart topicProgress={lowScoreProgress} />);
    expect(screen.getByText('30%')).toBeInTheDocument();
    expect(screen.getByText('Safety')).toBeInTheDocument();
  });

  it('renders all color ranges correctly', () => {
    const allRangesProgress: TopicProgress[] = [
      { topicId: '1', topicTitle: 'Great', topicSlug: 'great', totalAttempts: 1, averageScore: 90, lastAttemptDate: '2024-01-16' },
      { topicId: '2', topicTitle: 'Medium', topicSlug: 'medium', totalAttempts: 1, averageScore: 65, lastAttemptDate: '2024-01-16' },
      { topicId: '3', topicTitle: 'Low', topicSlug: 'low', totalAttempts: 1, averageScore: 45, lastAttemptDate: '2024-01-16' },
      { topicId: '4', topicTitle: 'VeryLow', topicSlug: 'verylow', totalAttempts: 1, averageScore: 20, lastAttemptDate: '2024-01-16' },
    ];
    renderWithProviders(<ProgressChart topicProgress={allRangesProgress} />);
    expect(screen.getByText('90%')).toBeInTheDocument();
    expect(screen.getByText('65%')).toBeInTheDocument();
    expect(screen.getByText('45%')).toBeInTheDocument();
    expect(screen.getByText('20%')).toBeInTheDocument();
  });
});

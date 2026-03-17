import { renderWithProviders, screen } from '@/test/test-utils';
import AttemptCard from './AttemptCard';
import type { QuizAttemptSummary } from '@/types/progress';

describe('AttemptCard', () => {
  const baseAttempt: QuizAttemptSummary = {
    id: '1',
    quizType: 'topic',
    topicTitle: 'Licensing',
    score: 8,
    total: 10,
    passed: true,
    completedAt: '2025-01-15T10:00:00Z',
  };

  it('renders topic title for topic quiz type', () => {
    renderWithProviders(
      <AttemptCard attempt={baseAttempt} passedLabel="Passed" notPassedLabel="Not Passed" />
    );
    expect(screen.getByText('Licensing')).toBeInTheDocument();
  });

  it('renders "Mock Examination" for mock quiz type', () => {
    const mockAttempt = { ...baseAttempt, quizType: 'mock' };
    renderWithProviders(
      <AttemptCard attempt={mockAttempt} passedLabel="Passed" notPassedLabel="Not Passed" />
    );
    expect(screen.getByText('Mock Examination')).toBeInTheDocument();
  });

  it('renders score', () => {
    renderWithProviders(
      <AttemptCard attempt={baseAttempt} passedLabel="Passed" notPassedLabel="Not Passed" />
    );
    expect(screen.getByText('8/10')).toBeInTheDocument();
  });

  it('renders passed label when passed is true', () => {
    renderWithProviders(
      <AttemptCard attempt={baseAttempt} passedLabel="Passed" notPassedLabel="Not Passed" />
    );
    expect(screen.getByText('Passed')).toBeInTheDocument();
  });

  it('renders not passed label when passed is false', () => {
    const failedAttempt = { ...baseAttempt, passed: false };
    renderWithProviders(
      <AttemptCard attempt={failedAttempt} passedLabel="Passed" notPassedLabel="Not Passed" />
    );
    expect(screen.getByText('Not Passed')).toBeInTheDocument();
  });

  it('renders the completion date', () => {
    renderWithProviders(
      <AttemptCard attempt={baseAttempt} passedLabel="Passed" notPassedLabel="Not Passed" />
    );
    const dateStr = new Date('2025-01-15T10:00:00Z').toLocaleDateString();
    expect(screen.getByText(dateStr)).toBeInTheDocument();
  });
});

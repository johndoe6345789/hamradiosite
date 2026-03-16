import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/test/test-utils';
import ResultsSummary from './ResultsSummary';

jest.mock('@/i18n/navigation', () => ({
  Link: ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

describe('ResultsSummary', () => {
  it('shows passed message when passed', () => {
    renderWithProviders(
      <ResultsSummary
        score={85}
        correctCount={22}
        totalQuestions={26}
        passed={true}
        quizTitle="Mock Exam"
      />
    );
    expect(screen.getByText('Passed!')).toBeInTheDocument();
    expect(screen.getByText('85%')).toBeInTheDocument();
  });

  it('shows failed message when not passed', () => {
    renderWithProviders(
      <ResultsSummary
        score={60}
        correctCount={15}
        totalQuestions={26}
        passed={false}
        quizTitle="Mock Exam"
      />
    );
    expect(screen.getByText('Not Passed')).toBeInTheDocument();
    expect(screen.getByText('60%')).toBeInTheDocument();
  });

  it('displays correct count', () => {
    renderWithProviders(
      <ResultsSummary
        score={85}
        correctCount={22}
        totalQuestions={26}
        passed={true}
        quizTitle="Mock Exam"
      />
    );
    expect(screen.getByText('22 / 26 correct')).toBeInTheDocument();
  });

  it('renders action buttons', () => {
    renderWithProviders(
      <ResultsSummary
        score={85}
        correctCount={22}
        totalQuestions={26}
        passed={true}
        quizTitle="Mock Exam"
      />
    );
    expect(screen.getByText('Back to Quizzes')).toBeInTheDocument();
    expect(screen.getByText('Try Again')).toBeInTheDocument();
  });

  it('shows quiz title', () => {
    renderWithProviders(
      <ResultsSummary
        score={85}
        correctCount={22}
        totalQuestions={26}
        passed={true}
        quizTitle="Mock Exam"
      />
    );
    expect(screen.getByText('Mock Exam')).toBeInTheDocument();
  });
});

import { renderWithProviders, screen } from '@/test/test-utils';
import MockExamCard from './MockExamCard';

describe('MockExamCard', () => {
  const defaultProps = {
    title: 'Mock Exam',
    description: 'Simulate the real exam',
    questionsLabel: '25 questions',
    timeLabel: '55 minutes',
    passLabel: '18/25 to pass',
    startLabel: 'Start Exam',
  };

  it('renders title and description', () => {
    renderWithProviders(<MockExamCard {...defaultProps} />);
    expect(screen.getByText('Mock Exam')).toBeInTheDocument();
    expect(screen.getByText('Simulate the real exam')).toBeInTheDocument();
  });

  it('renders all chips', () => {
    renderWithProviders(<MockExamCard {...defaultProps} />);
    expect(screen.getByText('25 questions')).toBeInTheDocument();
    expect(screen.getByText('55 minutes')).toBeInTheDocument();
    expect(screen.getByText('18/25 to pass')).toBeInTheDocument();
  });

  it('renders start button with correct link', () => {
    renderWithProviders(<MockExamCard {...defaultProps} />);
    const link = screen.getByText('Start Exam').closest('a');
    expect(link).toHaveAttribute('href', '/quiz/mock-exam');
  });
});

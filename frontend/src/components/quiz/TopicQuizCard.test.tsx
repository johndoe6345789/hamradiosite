import { renderWithProviders, screen } from '@/test/test-utils';
import TopicQuizCard from './TopicQuizCard';

describe('TopicQuizCard', () => {
  const defaultProps = {
    id: 'licensing',
    name: 'Licensing',
    questionCount: 15,
    description: 'Learn about licensing requirements',
    startLabel: 'Start Quiz',
  };

  it('renders name and description', () => {
    renderWithProviders(<TopicQuizCard {...defaultProps} />);
    expect(screen.getByText('Licensing')).toBeInTheDocument();
    expect(screen.getByText('Learn about licensing requirements')).toBeInTheDocument();
  });

  it('renders question count chip', () => {
    renderWithProviders(<TopicQuizCard {...defaultProps} />);
    expect(screen.getByText('15 questions')).toBeInTheDocument();
  });

  it('renders start button with correct link', () => {
    renderWithProviders(<TopicQuizCard {...defaultProps} />);
    const link = screen.getByText('Start Quiz').closest('a');
    expect(link).toHaveAttribute('href', '/quiz/licensing');
  });
});

import { renderWithProviders, screen } from '@/test/test-utils';
import FeatureCard from './FeatureCard';
import QuizIcon from '@mui/icons-material/Quiz';

describe('FeatureCard', () => {
  it('renders title and description', () => {
    renderWithProviders(
      <FeatureCard icon={QuizIcon} title="Practice Quizzes" description="Test your knowledge" />
    );
    expect(screen.getByText('Practice Quizzes')).toBeInTheDocument();
    expect(screen.getByText('Test your knowledge')).toBeInTheDocument();
  });

  it('renders the icon', () => {
    const { container } = renderWithProviders(
      <FeatureCard icon={QuizIcon} title="Quizzes" description="Desc" />
    );
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});

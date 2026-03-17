import { renderWithProviders, screen } from '@/test/test-utils';
import StatCard from './StatCard';
import StarIcon from '@mui/icons-material/Star';

describe('StatCard', () => {
  it('renders label and string value', () => {
    renderWithProviders(<StatCard label="Total Quizzes" value="42" icon={StarIcon} />);
    expect(screen.getByText('Total Quizzes')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('renders label and numeric value', () => {
    renderWithProviders(<StatCard label="Score" value={95} icon={StarIcon} />);
    expect(screen.getByText('Score')).toBeInTheDocument();
    expect(screen.getByText('95')).toBeInTheDocument();
  });

  it('renders the icon', () => {
    const { container } = renderWithProviders(
      <StatCard label="Streak" value={7} icon={StarIcon} />
    );
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});

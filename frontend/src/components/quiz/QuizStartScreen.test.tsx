import { renderWithProviders, screen, userEvent } from '@/test/test-utils';
import QuizStartScreen from './QuizStartScreen';

describe('QuizStartScreen', () => {
  const defaultProps = {
    title: 'Topic Quiz',
    description: 'Answer questions on this topic',
    buttonLabel: 'Start Quiz',
    onStart: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders title, description, and button', () => {
    renderWithProviders(<QuizStartScreen {...defaultProps} />);
    expect(screen.getByText('Topic Quiz')).toBeInTheDocument();
    expect(screen.getByText('Answer questions on this topic')).toBeInTheDocument();
    expect(screen.getByText('Start Quiz')).toBeInTheDocument();
  });

  it('calls onStart when button is clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<QuizStartScreen {...defaultProps} />);
    await user.click(screen.getByText('Start Quiz'));
    expect(defaultProps.onStart).toHaveBeenCalledTimes(1);
  });
});

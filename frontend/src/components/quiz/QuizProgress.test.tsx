import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/test/test-utils';
import QuizProgress from './QuizProgress';

describe('QuizProgress', () => {
  it('renders current question indicator', () => {
    renderWithProviders(<QuizProgress current={5} total={26} answered={4} />);
    expect(screen.getByText('Question 5 of 26')).toBeInTheDocument();
  });

  it('renders answered count', () => {
    renderWithProviders(<QuizProgress current={5} total={26} answered={4} />);
    expect(screen.getByText('4 of 26 answered')).toBeInTheDocument();
  });

  it('renders progress bar', () => {
    renderWithProviders(<QuizProgress current={13} total={26} answered={12} />);
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toBeInTheDocument();
  });

  it('shows 100% progress at last question', () => {
    renderWithProviders(<QuizProgress current={26} total={26} answered={26} />);
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('aria-valuenow', '100');
  });

  it('shows 0% progress when total is 0', () => {
    renderWithProviders(<QuizProgress current={0} total={0} answered={0} />);
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('aria-valuenow', '0');
  });
});

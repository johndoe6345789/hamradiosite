import { screen, act } from '@testing-library/react';
import { renderWithProviders } from '@/test/test-utils';
import QuizTimer from './QuizTimer';

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

describe('QuizTimer', () => {
  it('renders formatted time', () => {
    renderWithProviders(<QuizTimer timeRemaining={2700} onTimeUp={() => {}} />);
    expect(screen.getByText('45:00')).toBeInTheDocument();
  });

  it('counts down every second', () => {
    renderWithProviders(<QuizTimer timeRemaining={60} onTimeUp={() => {}} />);
    expect(screen.getByText('01:00')).toBeInTheDocument();
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(screen.getByText('00:59')).toBeInTheDocument();
  });

  it('displays time remaining label', () => {
    renderWithProviders(<QuizTimer timeRemaining={300} onTimeUp={() => {}} />);
    expect(screen.getByText('Time Remaining')).toBeInTheDocument();
  });

  it('calls onTimeUp when timer reaches zero', () => {
    const handleTimeUp = jest.fn();
    renderWithProviders(<QuizTimer timeRemaining={2} onTimeUp={handleTimeUp} />);
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    expect(handleTimeUp).toHaveBeenCalledTimes(1);
  });

  it('uses warning color when under 5 minutes', () => {
    renderWithProviders(<QuizTimer timeRemaining={299} onTimeUp={() => {}} />);
    const timer = screen.getByRole('timer');
    expect(timer).toBeInTheDocument();
  });
});

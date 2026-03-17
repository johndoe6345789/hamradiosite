import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/test/test-utils';
import LoadingSpinner from './LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders a circular progress indicator', () => {
    renderWithProviders(<LoadingSpinner />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('uses default size of 48 when no size prop is provided', () => {
    renderWithProviders(<LoadingSpinner />);
    const progressbar = screen.getByRole('progressbar');
    expect(progressbar).toHaveStyle({ width: '48px', height: '48px' });
  });

  it('uses custom size when size prop is provided', () => {
    renderWithProviders(<LoadingSpinner size={80} />);
    const progressbar = screen.getByRole('progressbar');
    expect(progressbar).toHaveStyle({ width: '80px', height: '80px' });
  });

  it('does not render message text when message prop is not provided', () => {
    const { container } = renderWithProviders(<LoadingSpinner />);
    const typography = container.querySelector('p');
    expect(typography).not.toBeInTheDocument();
  });

  it('renders message text when message prop is provided', () => {
    renderWithProviders(<LoadingSpinner message="Loading data..." />);
    expect(screen.getByText('Loading data...')).toBeInTheDocument();
  });

  it('does not render message Typography when message is an empty string (falsy)', () => {
    const { container } = renderWithProviders(<LoadingSpinner message="" />);
    const paragraphs = container.querySelectorAll('p');
    expect(paragraphs).toHaveLength(0);
  });
});

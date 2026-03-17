import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/test/test-utils';
import ScoreCircle from './ScoreCircle';

describe('ScoreCircle', () => {
  it('renders the score percentage text', () => {
    renderWithProviders(<ScoreCircle score={85} passed={true} />);
    expect(screen.getByText('85%')).toBeInTheDocument();
  });

  it('renders a determinate circular progress indicator', () => {
    renderWithProviders(<ScoreCircle score={75} passed={true} />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '75');
  });

  it('uses success color when passed is true', () => {
    const { container } = renderWithProviders(<ScoreCircle score={80} passed={true} />);
    const circle = container.querySelector('.MuiCircularProgress-root');
    expect(circle).toHaveClass('MuiCircularProgress-colorSuccess');
  });

  it('uses error color when passed is false', () => {
    const { container } = renderWithProviders(<ScoreCircle score={40} passed={false} />);
    const circle = container.querySelector('.MuiCircularProgress-root');
    expect(circle).toHaveClass('MuiCircularProgress-colorError');
  });

  it('renders with a score of 0', () => {
    renderWithProviders(<ScoreCircle score={0} passed={false} />);
    expect(screen.getByText('0%')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
  });

  it('renders with a score of 100', () => {
    renderWithProviders(<ScoreCircle score={100} passed={true} />);
    expect(screen.getByText('100%')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
  });
});

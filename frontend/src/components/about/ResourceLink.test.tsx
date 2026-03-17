import { renderWithProviders, screen } from '@/test/test-utils';
import ResourceLink from './ResourceLink';

describe('ResourceLink', () => {
  it('renders the label as a link', () => {
    renderWithProviders(<ResourceLink href="https://example.com" label="Example Resource" />);
    const link = screen.getByText('Example Resource');
    expect(link).toBeInTheDocument();
    expect(link.closest('a')).toHaveAttribute('href', 'https://example.com');
  });

  it('opens link in a new tab', () => {
    renderWithProviders(<ResourceLink href="https://example.com" label="Example" />);
    const link = screen.getByText('Example').closest('a');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });
});

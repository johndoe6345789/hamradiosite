import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/test/test-utils';
import Footer from './Footer';

jest.mock('@/i18n/navigation', () => ({
  Link: ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

describe('Footer', () => {
  it('renders copyright text', () => {
    renderWithProviders(<Footer />);
    expect(screen.getByText(/HamPrep\. All rights reserved\./)).toBeInTheDocument();
  });

  it('renders built for text', () => {
    renderWithProviders(<Footer />);
    expect(screen.getByText('Built for amateur radio enthusiasts')).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    renderWithProviders(<Footer />);
    expect(screen.getByText('Learn')).toBeInTheDocument();
    expect(screen.getByText('Quiz')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
  });
});

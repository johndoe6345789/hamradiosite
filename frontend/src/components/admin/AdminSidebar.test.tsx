import React from 'react';
import { screen } from '@/test/test-utils';
import { renderWithProviders } from '@/test/test-utils';
import AdminSidebar from './AdminSidebar';

jest.mock('@/i18n/navigation', () => ({
  Link: ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

describe('AdminSidebar', () => {
  it('renders the Admin Panel heading', () => {
    renderWithProviders(<AdminSidebar />);
    expect(screen.getByText('Admin Panel')).toBeInTheDocument();
  });

  it('renders all navigation links', () => {
    renderWithProviders(<AdminSidebar />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Users')).toBeInTheDocument();
    expect(screen.getByText('Questions')).toBeInTheDocument();
    expect(screen.getByText('Topics')).toBeInTheDocument();
    expect(screen.getByText('Translations')).toBeInTheDocument();
  });

  it('renders links with correct hrefs', () => {
    renderWithProviders(<AdminSidebar />);
    const links = screen.getAllByRole('link');
    const hrefs = links.map((l) => l.getAttribute('href'));
    expect(hrefs).toContain('/admin');
    expect(hrefs).toContain('/admin/users');
    expect(hrefs).toContain('/admin/questions');
    expect(hrefs).toContain('/admin/topics');
    expect(hrefs).toContain('/admin/translations');
  });
});

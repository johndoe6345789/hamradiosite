import React from 'react';
import { screen, fireEvent } from '@/test/test-utils';
import { renderWithProviders } from '@/test/test-utils';
import AdminPageHeader from './AdminPageHeader';

describe('AdminPageHeader', () => {
  it('renders the title', () => {
    renderWithProviders(<AdminPageHeader title="Users" error={null} />);
    expect(screen.getByText('Users')).toBeInTheDocument();
  });

  it('does not render Add button when onAdd is not provided', () => {
    renderWithProviders(<AdminPageHeader title="Users" error={null} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders Add button with default label when onAdd is provided', () => {
    const onAdd = jest.fn();
    renderWithProviders(<AdminPageHeader title="Users" error={null} onAdd={onAdd} />);
    const button = screen.getByRole('button', { name: /add/i });
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    expect(onAdd).toHaveBeenCalledTimes(1);
  });

  it('renders Add button with custom addLabel', () => {
    const onAdd = jest.fn();
    renderWithProviders(<AdminPageHeader title="Users" error={null} onAdd={onAdd} addLabel="New User" />);
    expect(screen.getByRole('button', { name: /new user/i })).toBeInTheDocument();
  });

  it('does not render error alert when error is null', () => {
    renderWithProviders(<AdminPageHeader title="Users" error={null} />);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('renders error alert when error is provided', () => {
    renderWithProviders(<AdminPageHeader title="Users" error="Something went wrong" />);
    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent('Something went wrong');
  });
});

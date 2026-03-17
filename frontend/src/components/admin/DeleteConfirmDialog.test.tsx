import React from 'react';
import { screen, fireEvent } from '@/test/test-utils';
import { renderWithProviders } from '@/test/test-utils';
import DeleteConfirmDialog from './DeleteConfirmDialog';

describe('DeleteConfirmDialog', () => {
  const defaultProps = {
    open: true,
    onClose: jest.fn(),
    onConfirm: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the dialog title', () => {
    renderWithProviders(<DeleteConfirmDialog {...defaultProps} />);
    expect(screen.getByText('Confirm Delete')).toBeInTheDocument();
  });

  it('renders generic message when itemLabel is not provided', () => {
    renderWithProviders(<DeleteConfirmDialog {...defaultProps} />);
    expect(screen.getByText(/are you sure you want to delete\?/i)).toBeInTheDocument();
  });

  it('renders message with itemLabel when provided', () => {
    renderWithProviders(<DeleteConfirmDialog {...defaultProps} itemLabel="this user" />);
    expect(screen.getByText(/are you sure you want to delete this user\?/i)).toBeInTheDocument();
  });

  it('calls onClose when Cancel button is clicked', () => {
    renderWithProviders(<DeleteConfirmDialog {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onConfirm when Delete button is clicked', () => {
    renderWithProviders(<DeleteConfirmDialog {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: /delete/i }));
    expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1);
  });

  it('does not render dialog content when open is false', () => {
    renderWithProviders(<DeleteConfirmDialog {...defaultProps} open={false} />);
    expect(screen.queryByText('Confirm Delete')).not.toBeInTheDocument();
  });
});

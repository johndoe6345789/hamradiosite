import React from 'react';
import { screen, fireEvent } from '@/test/test-utils';
import { renderWithProviders } from '@/test/test-utils';
import TopicFormDialog from './TopicFormDialog';
import type { TopicFormData } from './TopicFormDialog';

describe('TopicFormDialog', () => {
  const defaultForm: TopicFormData = {
    title: 'Radio Basics',
    slug: 'radio-basics',
    description: 'Learn the basics',
    content: '<p>Content here</p>',
    icon: 'Radio',
    order: 1,
  };

  const defaultProps = {
    open: true,
    isEditing: false,
    form: defaultForm,
    onClose: jest.fn(),
    onSave: jest.fn(),
    onFormChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders Add Topic title when not editing', () => {
    renderWithProviders(<TopicFormDialog {...defaultProps} />);
    expect(screen.getByText('Add Topic')).toBeInTheDocument();
  });

  it('renders Edit Topic title when editing', () => {
    renderWithProviders(<TopicFormDialog {...defaultProps} isEditing={true} />);
    expect(screen.getByText('Edit Topic')).toBeInTheDocument();
  });

  it('renders Create Topic button when not editing', () => {
    renderWithProviders(<TopicFormDialog {...defaultProps} />);
    expect(screen.getByRole('button', { name: /create topic/i })).toBeInTheDocument();
  });

  it('renders Save Changes button when editing', () => {
    renderWithProviders(<TopicFormDialog {...defaultProps} isEditing={true} />);
    expect(screen.getByRole('button', { name: /save changes/i })).toBeInTheDocument();
  });

  it('calls onClose when Cancel is clicked', () => {
    renderWithProviders(<TopicFormDialog {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onSave when Create Topic is clicked', () => {
    renderWithProviders(<TopicFormDialog {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: /create topic/i }));
    expect(defaultProps.onSave).toHaveBeenCalledTimes(1);
  });

  it('calls onFormChange when title changes', () => {
    renderWithProviders(<TopicFormDialog {...defaultProps} />);
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'New Title' } });
    expect(defaultProps.onFormChange).toHaveBeenCalledWith({ ...defaultForm, title: 'New Title' });
  });

  it('calls onFormChange when slug changes', () => {
    renderWithProviders(<TopicFormDialog {...defaultProps} />);
    fireEvent.change(screen.getByLabelText(/slug/i), { target: { value: 'new-slug' } });
    expect(defaultProps.onFormChange).toHaveBeenCalledWith({ ...defaultForm, slug: 'new-slug' });
  });

  it('calls onFormChange when description changes', () => {
    renderWithProviders(<TopicFormDialog {...defaultProps} />);
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'New desc' } });
    expect(defaultProps.onFormChange).toHaveBeenCalledWith({ ...defaultForm, description: 'New desc' });
  });

  it('calls onFormChange when content changes', () => {
    renderWithProviders(<TopicFormDialog {...defaultProps} />);
    fireEvent.change(screen.getByLabelText(/content/i), { target: { value: '<p>New</p>' } });
    expect(defaultProps.onFormChange).toHaveBeenCalledWith({ ...defaultForm, content: '<p>New</p>' });
  });

  it('calls onFormChange when icon changes', () => {
    renderWithProviders(<TopicFormDialog {...defaultProps} />);
    fireEvent.change(screen.getByLabelText(/icon/i), { target: { value: 'Star' } });
    expect(defaultProps.onFormChange).toHaveBeenCalledWith({ ...defaultForm, icon: 'Star' });
  });

  it('calls onFormChange when order changes', () => {
    renderWithProviders(<TopicFormDialog {...defaultProps} />);
    fireEvent.change(screen.getByLabelText(/order/i), { target: { value: '5' } });
    expect(defaultProps.onFormChange).toHaveBeenCalledWith({ ...defaultForm, order: 5 });
  });

  it('parses non-numeric order value as 0', () => {
    renderWithProviders(<TopicFormDialog {...defaultProps} />);
    fireEvent.change(screen.getByLabelText(/order/i), { target: { value: 'abc' } });
    expect(defaultProps.onFormChange).toHaveBeenCalledWith({ ...defaultForm, order: 0 });
  });

  it('does not render when open is false', () => {
    renderWithProviders(<TopicFormDialog {...defaultProps} open={false} />);
    expect(screen.queryByText('Add Topic')).not.toBeInTheDocument();
  });
});

import React from 'react';
import { screen, fireEvent } from '@/test/test-utils';
import { renderWithProviders } from '@/test/test-utils';
import TopicsTable from './TopicsTable';
import type { TopicWithContent } from '@/types/topic';

describe('TopicsTable', () => {
  const mockTopics: TopicWithContent[] = [
    { id: '1', title: 'Radio Basics', slug: 'radio-basics', description: 'Basics', content: '', icon: '', order: 1 },
    { id: '2', title: 'Safety', slug: 'safety', description: 'Safety', content: '', icon: '', order: 2 },
  ];

  const onEdit = jest.fn();
  const onDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders table headers', () => {
    renderWithProviders(<TopicsTable topics={mockTopics} onEdit={onEdit} onDelete={onDelete} />);
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Slug')).toBeInTheDocument();
    expect(screen.getByText('Order')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });

  it('renders topic data in rows', () => {
    renderWithProviders(<TopicsTable topics={mockTopics} onEdit={onEdit} onDelete={onDelete} />);
    expect(screen.getByText('Radio Basics')).toBeInTheDocument();
    expect(screen.getByText('radio-basics')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('Safety')).toBeInTheDocument();
    expect(screen.getByText('safety')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', () => {
    renderWithProviders(<TopicsTable topics={mockTopics} onEdit={onEdit} onDelete={onDelete} />);
    const editButtons = screen.getAllByTestId('EditIcon');
    fireEvent.click(editButtons[0].closest('button')!);
    expect(onEdit).toHaveBeenCalledWith(mockTopics[0]);
  });

  it('calls onDelete when delete button is clicked', () => {
    renderWithProviders(<TopicsTable topics={mockTopics} onEdit={onEdit} onDelete={onDelete} />);
    const deleteButtons = screen.getAllByTestId('DeleteIcon');
    fireEvent.click(deleteButtons[0].closest('button')!);
    expect(onDelete).toHaveBeenCalledWith(mockTopics[0]);
  });

  it('shows empty state when no topics', () => {
    renderWithProviders(<TopicsTable topics={[]} onEdit={onEdit} onDelete={onDelete} />);
    expect(screen.getByText('No topics found')).toBeInTheDocument();
  });

  it('does not show empty state when topics exist', () => {
    renderWithProviders(<TopicsTable topics={mockTopics} onEdit={onEdit} onDelete={onDelete} />);
    expect(screen.queryByText('No topics found')).not.toBeInTheDocument();
  });
});

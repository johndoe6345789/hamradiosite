import React from 'react';
import { screen, fireEvent } from '@/test/test-utils';
import { renderWithProviders } from '@/test/test-utils';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import UserRow from './UserRow';
import type { User } from '@/types/auth';

// Wrap UserRow in a Table/TableBody since it renders TableRow/TableCell
function renderUserRow(props: React.ComponentProps<typeof UserRow>) {
  return renderWithProviders(
    <Table>
      <TableBody>
        <UserRow {...props} />
      </TableBody>
    </Table>
  );
}

describe('UserRow', () => {
  const mockUser: User = {
    id: '1',
    username: 'johndoe',
    email: 'john@example.com',
    role: 'user',
    createdAt: '2024-01-15T00:00:00Z',
  };

  const defaultEditForm = { username: 'johndoe', email: 'john@example.com', role: 'user' as const };

  const defaultProps = {
    user: mockUser,
    isEditing: false,
    editForm: defaultEditForm,
    onStartEdit: jest.fn(),
    onCancelEdit: jest.fn(),
    onSave: jest.fn(),
    onDelete: jest.fn(),
    onFormChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders user data in display mode', () => {
    renderUserRow(defaultProps);
    expect(screen.getByText('johndoe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('user')).toBeInTheDocument();
  });

  it('renders formatted date', () => {
    renderUserRow(defaultProps);
    // toLocaleDateString will format the date; just check it exists
    const dateStr = new Date('2024-01-15T00:00:00Z').toLocaleDateString();
    expect(screen.getByText(dateStr)).toBeInTheDocument();
  });

  it('shows edit and delete buttons in display mode', () => {
    renderUserRow(defaultProps);
    expect(screen.getByTestId('EditIcon')).toBeInTheDocument();
    expect(screen.getByTestId('DeleteIcon')).toBeInTheDocument();
  });

  it('calls onStartEdit when edit button is clicked', () => {
    renderUserRow(defaultProps);
    fireEvent.click(screen.getByTestId('EditIcon').closest('button')!);
    expect(defaultProps.onStartEdit).toHaveBeenCalledTimes(1);
  });

  it('calls onDelete when delete button is clicked', () => {
    renderUserRow(defaultProps);
    fireEvent.click(screen.getByTestId('DeleteIcon').closest('button')!);
    expect(defaultProps.onDelete).toHaveBeenCalledTimes(1);
  });

  it('shows text fields and save/cancel buttons in editing mode', () => {
    renderUserRow({ ...defaultProps, isEditing: true });
    expect(screen.getByDisplayValue('johndoe')).toBeInTheDocument();
    expect(screen.getByDisplayValue('john@example.com')).toBeInTheDocument();
    expect(screen.getByTestId('SaveIcon')).toBeInTheDocument();
    expect(screen.getByTestId('CancelIcon')).toBeInTheDocument();
  });

  it('does not show edit/delete buttons in editing mode', () => {
    renderUserRow({ ...defaultProps, isEditing: true });
    expect(screen.queryByTestId('EditIcon')).not.toBeInTheDocument();
    expect(screen.queryByTestId('DeleteIcon')).not.toBeInTheDocument();
  });

  it('calls onSave when save button is clicked', () => {
    renderUserRow({ ...defaultProps, isEditing: true });
    fireEvent.click(screen.getByTestId('SaveIcon').closest('button')!);
    expect(defaultProps.onSave).toHaveBeenCalledTimes(1);
  });

  it('calls onCancelEdit when cancel button is clicked', () => {
    renderUserRow({ ...defaultProps, isEditing: true });
    fireEvent.click(screen.getByTestId('CancelIcon').closest('button')!);
    expect(defaultProps.onCancelEdit).toHaveBeenCalledTimes(1);
  });

  it('calls onFormChange when username field is edited', () => {
    renderUserRow({ ...defaultProps, isEditing: true });
    fireEvent.change(screen.getByDisplayValue('johndoe'), { target: { value: 'newname' } });
    expect(defaultProps.onFormChange).toHaveBeenCalledWith({
      ...defaultEditForm,
      username: 'newname',
    });
  });

  it('calls onFormChange when email field is edited', () => {
    renderUserRow({ ...defaultProps, isEditing: true });
    fireEvent.change(screen.getByDisplayValue('john@example.com'), { target: { value: 'new@test.com' } });
    expect(defaultProps.onFormChange).toHaveBeenCalledWith({
      ...defaultEditForm,
      email: 'new@test.com',
    });
  });

  it('renders role select in editing mode', () => {
    renderUserRow({ ...defaultProps, isEditing: true });
    // MUI Select renders the selected value as text
    expect(screen.getByText('user')).toBeInTheDocument();
  });
});

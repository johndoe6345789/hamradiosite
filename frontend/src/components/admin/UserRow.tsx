'use client';

import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import type { User } from '@/types/auth';

interface UserRowProps {
  user: User;
  isEditing: boolean;
  editForm: { username: string; email: string; role: 'admin' | 'user' };
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onSave: () => void;
  onDelete: () => void;
  onFormChange: (form: { username: string; email: string; role: 'admin' | 'user' }) => void;
}

export default function UserRow({ user, isEditing, editForm, onStartEdit, onCancelEdit, onSave, onDelete, onFormChange }: UserRowProps) {
  return (
    <TableRow>
      <TableCell>
        {isEditing ? <TextField size="small" value={editForm.username} onChange={(e) => onFormChange({ ...editForm, username: e.target.value })} /> : user.username}
      </TableCell>
      <TableCell>
        {isEditing ? <TextField size="small" value={editForm.email} onChange={(e) => onFormChange({ ...editForm, email: e.target.value })} /> : user.email}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <Select size="small" value={editForm.role} onChange={(e) => onFormChange({ ...editForm, role: e.target.value as 'admin' | 'user' })}>
            <MenuItem value="user">user</MenuItem>
            <MenuItem value="admin">admin</MenuItem>
          </Select>
        ) : user.role}
      </TableCell>
      <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
      <TableCell align="right">
        {isEditing ? (
          <>
            <IconButton color="primary" onClick={onSave}><SaveIcon /></IconButton>
            <IconButton onClick={onCancelEdit}><CancelIcon /></IconButton>
          </>
        ) : (
          <>
            <IconButton color="primary" onClick={onStartEdit}><EditIcon /></IconButton>
            <IconButton color="error" onClick={onDelete}><DeleteIcon /></IconButton>
          </>
        )}
      </TableCell>
    </TableRow>
  );
}

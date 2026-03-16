'use client';

import { useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import type { User } from '@/types/auth';
import { adminApi } from '@/lib/apiClient';
import useAdminCrud from '@/hooks/useAdminCrud';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import UserRow from '@/components/admin/UserRow';
import DeleteConfirmDialog from '@/components/admin/DeleteConfirmDialog';

export default function AdminUsersPage() {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ username: '', email: '', role: 'user' as 'admin' | 'user' });

  const fetchFn = useCallback(async () => {
    const res = await adminApi.getUsers();
    return res.data.users;
  }, []);

  const crud = useAdminCrud<User>({ fetchFn, deleteFn: (id) => adminApi.deleteUser(id).then(() => {}) });

  const startEdit = (user: User) => { setEditingId(user.id); setEditForm({ username: user.username, email: user.email, role: user.role }); };

  const saveUser = async (id: string) => {
    try {
      await adminApi.updateUser(id, editForm);
      setEditingId(null);
      await crud.fetchData();
    } catch (err) { crud.setError(err instanceof Error ? err.message : 'Failed to update user'); }
  };

  if (crud.loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>;

  return (
    <Box>
      <AdminPageHeader title="Users Management" error={crud.error} />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {crud.items.map((user) => (
              <UserRow key={user.id} user={user} isEditing={editingId === user.id} editForm={editForm} onStartEdit={() => startEdit(user)} onCancelEdit={() => setEditingId(null)} onSave={() => saveUser(user.id)} onDelete={() => crud.confirmDelete(user)} onFormChange={setEditForm} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <DeleteConfirmDialog open={crud.deleteDialogOpen} itemLabel={crud.itemToDelete ? `user "${crud.itemToDelete.username}"` : ''} onClose={crud.closeDeleteDialog} onConfirm={crud.handleDelete} />
    </Box>
  );
}

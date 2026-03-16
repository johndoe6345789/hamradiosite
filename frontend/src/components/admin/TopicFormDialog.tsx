'use client';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

export interface TopicFormData {
  title: string;
  slug: string;
  description: string;
  content: string;
  icon: string;
  order: number;
}

interface TopicFormDialogProps {
  open: boolean;
  isEditing: boolean;
  form: TopicFormData;
  onClose: () => void;
  onSave: () => void;
  onFormChange: (form: TopicFormData) => void;
}

export default function TopicFormDialog({ open, isEditing, form, onClose, onSave, onFormChange }: TopicFormDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{isEditing ? 'Edit Topic' : 'Add Topic'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField label="Title" fullWidth value={form.title} onChange={(e) => onFormChange({ ...form, title: e.target.value })} />
          <TextField label="Slug" fullWidth value={form.slug} onChange={(e) => onFormChange({ ...form, slug: e.target.value })} helperText="URL-friendly identifier (e.g., radio-basics)" />
          <TextField label="Description" fullWidth multiline rows={2} value={form.description} onChange={(e) => onFormChange({ ...form, description: e.target.value })} />
          <TextField label="Content (HTML)" fullWidth multiline rows={10} value={form.content} onChange={(e) => onFormChange({ ...form, content: e.target.value })} />
          <TextField label="Icon" fullWidth value={form.icon} onChange={(e) => onFormChange({ ...form, icon: e.target.value })} helperText="MUI icon name or emoji" />
          <TextField label="Order" type="number" value={form.order} onChange={(e) => onFormChange({ ...form, order: parseInt(e.target.value, 10) || 0 })} />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onSave} variant="contained">{isEditing ? 'Save Changes' : 'Create Topic'}</Button>
      </DialogActions>
    </Dialog>
  );
}

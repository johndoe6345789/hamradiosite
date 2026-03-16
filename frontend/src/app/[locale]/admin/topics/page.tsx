'use client';

import { useEffect, useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Stack from '@mui/material/Stack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import type { TopicWithContent } from '@/types/topic';
import { adminApi } from '@/lib/apiClient';

interface TopicFormData {
  title: string;
  slug: string;
  description: string;
  content: string;
  icon: string;
  order: number;
}

const emptyForm: TopicFormData = {
  title: '',
  slug: '',
  description: '',
  content: '',
  icon: '',
  order: 0,
};

export default function AdminTopicsPage() {
  const [topics, setTopics] = useState<TopicWithContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<TopicWithContent | null>(null);
  const [form, setForm] = useState<TopicFormData>(emptyForm);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [topicToDelete, setTopicToDelete] = useState<TopicWithContent | null>(null);

  const fetchTopics = useCallback(async () => {
    try {
      setLoading(true);
      const res = await adminApi.getTopics();
      setTopics(res.data.topics);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load topics');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTopics();
  }, [fetchTopics]);

  const openAddDialog = () => {
    setEditingTopic(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEditDialog = (topic: TopicWithContent) => {
    setEditingTopic(topic);
    setForm({
      title: topic.title,
      slug: topic.slug,
      description: topic.description,
      content: topic.content,
      icon: topic.icon,
      order: topic.order,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editingTopic) {
        await adminApi.updateTopic(editingTopic.id, form);
      } else {
        await adminApi.createTopic(form as Omit<TopicWithContent, 'id'>);
      }
      setDialogOpen(false);
      await fetchTopics();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save topic');
    }
  };

  const confirmDelete = (topic: TopicWithContent) => {
    setTopicToDelete(topic);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!topicToDelete) return;
    try {
      await adminApi.deleteTopic(topicToDelete.id);
      setDeleteDialogOpen(false);
      setTopicToDelete(null);
      await fetchTopics();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete topic');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>
          Topics Management
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openAddDialog}>
          Add Topic
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Slug</TableCell>
              <TableCell>Order</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {topics.map((topic) => (
              <TableRow key={topic.id}>
                <TableCell>{topic.title}</TableCell>
                <TableCell>{topic.slug}</TableCell>
                <TableCell>{topic.order}</TableCell>
                <TableCell align="right">
                  <IconButton color="primary" onClick={() => openEditDialog(topic)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => confirmDelete(topic)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {topics.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <Typography color="text.secondary" sx={{ py: 4 }}>
                    No topics found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editingTopic ? 'Edit Topic' : 'Add Topic'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Title"
              fullWidth
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            <TextField
              label="Slug"
              fullWidth
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              helperText="URL-friendly identifier (e.g., radio-basics)"
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={2}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            <TextField
              label="Content (HTML)"
              fullWidth
              multiline
              rows={10}
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
            />
            <TextField
              label="Icon"
              fullWidth
              value={form.icon}
              onChange={(e) => setForm({ ...form, icon: e.target.value })}
              helperText="MUI icon name or emoji"
            />
            <TextField
              label="Order"
              type="number"
              value={form.order}
              onChange={(e) => setForm({ ...form, order: parseInt(e.target.value, 10) || 0 })}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            {editingTopic ? 'Save Changes' : 'Create Topic'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete topic &quot;{topicToDelete?.title}&quot;?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

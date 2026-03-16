'use client';

import { useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import type { TopicWithContent } from '@/types/topic';
import { adminApi } from '@/lib/apiClient';
import useAdminCrud from '@/hooks/useAdminCrud';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import TopicsTable from '@/components/admin/TopicsTable';
import TopicFormDialog, { type TopicFormData } from '@/components/admin/TopicFormDialog';
import DeleteConfirmDialog from '@/components/admin/DeleteConfirmDialog';

const emptyForm: TopicFormData = { title: '', slug: '', description: '', content: '', icon: '', order: 0 };

export default function AdminTopicsPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<TopicWithContent | null>(null);
  const [form, setForm] = useState<TopicFormData>(emptyForm);

  const fetchFn = useCallback(async () => {
    const res = await adminApi.getTopics();
    return res.data.topics;
  }, []);

  const crud = useAdminCrud<TopicWithContent>({ fetchFn, deleteFn: (id) => adminApi.deleteTopic(id).then(() => {}) });

  const openAdd = () => { setEditingTopic(null); setForm(emptyForm); setDialogOpen(true); };
  const openEdit = (topic: TopicWithContent) => {
    setEditingTopic(topic);
    setForm({ title: topic.title, slug: topic.slug, description: topic.description, content: topic.content, icon: topic.icon, order: topic.order });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editingTopic) await adminApi.updateTopic(editingTopic.id, form);
      else await adminApi.createTopic(form as Omit<TopicWithContent, 'id'>);
      setDialogOpen(false);
      await crud.fetchData();
    } catch (err) { crud.setError(err instanceof Error ? err.message : 'Failed to save'); }
  };

  if (crud.loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>;

  return (
    <Box>
      <AdminPageHeader title="Topics Management" error={crud.error} onAdd={openAdd} addLabel="Add Topic" />
      <TopicsTable topics={crud.items} onEdit={openEdit} onDelete={crud.confirmDelete} />
      <TopicFormDialog open={dialogOpen} isEditing={!!editingTopic} form={form} onClose={() => setDialogOpen(false)} onSave={handleSave} onFormChange={setForm} />
      <DeleteConfirmDialog open={crud.deleteDialogOpen} itemLabel={crud.itemToDelete ? `topic "${crud.itemToDelete.title}"` : ''} onClose={crud.closeDeleteDialog} onConfirm={crud.handleDelete} />
    </Box>
  );
}

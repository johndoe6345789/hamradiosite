'use client';

import { useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import type { QuizQuestion } from '@/types/quiz';
import type { TopicWithContent } from '@/types/topic';
import { adminApi } from '@/lib/apiClient';
import useAdminCrud from '@/hooks/useAdminCrud';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import QuestionsTable from '@/components/admin/QuestionsTable';
import QuestionFormDialog, { type QuestionFormData } from '@/components/admin/QuestionFormDialog';
import DeleteConfirmDialog from '@/components/admin/DeleteConfirmDialog';

const emptyForm: QuestionFormData = {
  text: '', topic_slug: '', options: [{ id: 'a', text: '' }, { id: 'b', text: '' }, { id: 'c', text: '' }, { id: 'd', text: '' }], correct_option_id: '', explanation: '',
};

export default function AdminQuestionsPage() {
  const [filterTopic, setFilterTopic] = useState('');
  const [topics, setTopics] = useState<TopicWithContent[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<QuizQuestion | null>(null);
  const [form, setForm] = useState<QuestionFormData>(emptyForm);

  const fetchFn = useCallback(async () => {
    const [qRes, tRes] = await Promise.all([adminApi.getQuestions(filterTopic || undefined), adminApi.getTopics()]);
    setTopics(tRes.data.topics);
    return qRes.data.questions;
  }, [filterTopic]);

  const crud = useAdminCrud<QuizQuestion>({ fetchFn, deleteFn: (id) => adminApi.deleteQuestion(id).then(() => {}) });

  const openAdd = () => { setEditingQuestion(null); setForm(emptyForm); setDialogOpen(true); };
  const openEdit = (q: QuizQuestion) => {
    setEditingQuestion(q);
    setForm({ text: q.text, topic_slug: q.topic_slug, options: [...q.options], correct_option_id: q.correct_option_id, explanation: q.explanation });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editingQuestion) await adminApi.updateQuestion(editingQuestion.id, form);
      else await adminApi.createQuestion(form as Omit<QuizQuestion, 'id'>);
      setDialogOpen(false);
      await crud.fetchData();
    } catch (err) { crud.setError(err instanceof Error ? err.message : 'Failed to save'); }
  };

  if (crud.loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>;

  return (
    <Box>
      <AdminPageHeader title="Questions Management" error={crud.error} onAdd={openAdd} addLabel="Add Question" />
      <FormControl sx={{ mb: 2, minWidth: 200 }} size="small">
        <InputLabel>Filter by Topic</InputLabel>
        <Select value={filterTopic} label="Filter by Topic" onChange={(e) => setFilterTopic(e.target.value)}>
          <MenuItem value="">All Topics</MenuItem>
          {topics.map((t) => <MenuItem key={t.slug} value={t.slug}>{t.title}</MenuItem>)}
        </Select>
      </FormControl>
      <QuestionsTable questions={crud.items} onEdit={openEdit} onDelete={crud.confirmDelete} />
      <QuestionFormDialog open={dialogOpen} isEditing={!!editingQuestion} form={form} topics={topics} onClose={() => setDialogOpen(false)} onSave={handleSave} onFormChange={setForm} />
      <DeleteConfirmDialog open={crud.deleteDialogOpen} itemLabel="this question" onClose={crud.closeDeleteDialog} onConfirm={crud.handleDelete} />
    </Box>
  );
}

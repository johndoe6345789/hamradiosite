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
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
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
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import type { QuizQuestion, QuestionOption } from '@/types/quiz';
import type { TopicWithContent } from '@/types/topic';
import { adminApi } from '@/lib/apiClient';

interface QuestionFormData {
  text: string;
  topic_slug: string;
  options: QuestionOption[];
  correct_option_id: string;
  explanation: string;
}

const emptyForm: QuestionFormData = {
  text: '',
  topic_slug: '',
  options: [
    { id: 'a', text: '' },
    { id: 'b', text: '' },
    { id: 'c', text: '' },
    { id: 'd', text: '' },
  ],
  correct_option_id: '',
  explanation: '',
};

export default function AdminQuestionsPage() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [topics, setTopics] = useState<TopicWithContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterTopic, setFilterTopic] = useState<string>('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<QuizQuestion | null>(null);
  const [form, setForm] = useState<QuestionFormData>(emptyForm);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState<QuizQuestion | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [questionsRes, topicsRes] = await Promise.all([
        adminApi.getQuestions(filterTopic || undefined),
        adminApi.getTopics(),
      ]);
      setQuestions(questionsRes.data.questions);
      setTopics(topicsRes.data.topics);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [filterTopic]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const openAddDialog = () => {
    setEditingQuestion(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEditDialog = (question: QuizQuestion) => {
    setEditingQuestion(question);
    setForm({
      text: question.text,
      topic_slug: question.topic_slug,
      options: [...question.options],
      correct_option_id: question.correct_option_id,
      explanation: question.explanation,
    });
    setDialogOpen(true);
  };

  const addOption = () => {
    const nextId = String.fromCharCode(97 + form.options.length);
    setForm({ ...form, options: [...form.options, { id: nextId, text: '' }] });
  };

  const removeOption = (index: number) => {
    const newOptions = form.options.filter((_, i) => i !== index);
    setForm({
      ...form,
      options: newOptions,
      correct_option_id: newOptions.some((o) => o.id === form.correct_option_id)
        ? form.correct_option_id
        : '',
    });
  };

  const updateOptionText = (index: number, text: string) => {
    const newOptions = form.options.map((o, i) => (i === index ? { ...o, text } : o));
    setForm({ ...form, options: newOptions });
  };

  const handleSave = async () => {
    try {
      if (editingQuestion) {
        await adminApi.updateQuestion(editingQuestion.id, form);
      } else {
        await adminApi.createQuestion(form as Omit<QuizQuestion, 'id'>);
      }
      setDialogOpen(false);
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save question');
    }
  };

  const confirmDelete = (question: QuizQuestion) => {
    setQuestionToDelete(question);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!questionToDelete) return;
    try {
      await adminApi.deleteQuestion(questionToDelete.id);
      setDeleteDialogOpen(false);
      setQuestionToDelete(null);
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete question');
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
          Questions Management
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openAddDialog}>
          Add Question
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <FormControl sx={{ mb: 2, minWidth: 200 }} size="small">
        <InputLabel>Filter by Topic</InputLabel>
        <Select
          value={filterTopic}
          label="Filter by Topic"
          onChange={(e) => setFilterTopic(e.target.value)}
        >
          <MenuItem value="">All Topics</MenuItem>
          {topics.map((topic) => (
            <MenuItem key={topic.slug} value={topic.slug}>
              {topic.title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Question</TableCell>
              <TableCell>Topic</TableCell>
              <TableCell>Correct Answer</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {questions.map((question) => (
              <TableRow key={question.id}>
                <TableCell sx={{ maxWidth: 400 }}>
                  <Typography noWrap>{question.text}</Typography>
                </TableCell>
                <TableCell>{question.topic_slug}</TableCell>
                <TableCell>
                  {question.options.find((o) => o.id === question.correct_option_id)?.text || question.correct_option_id}
                </TableCell>
                <TableCell align="right">
                  <IconButton color="primary" onClick={() => openEditDialog(question)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => confirmDelete(question)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {questions.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <Typography color="text.secondary" sx={{ py: 4 }}>
                    No questions found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editingQuestion ? 'Edit Question' : 'Add Question'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Question Text"
              fullWidth
              multiline
              rows={3}
              value={form.text}
              onChange={(e) => setForm({ ...form, text: e.target.value })}
            />
            <FormControl fullWidth>
              <InputLabel>Topic</InputLabel>
              <Select
                value={form.topic_slug}
                label="Topic"
                onChange={(e) => setForm({ ...form, topic_slug: e.target.value })}
              >
                {topics.map((topic) => (
                  <MenuItem key={topic.slug} value={topic.slug}>
                    {topic.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Typography variant="subtitle1" fontWeight={600}>
              Options
            </Typography>
            {form.options.map((option, index) => (
              <Box key={option.id} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Typography sx={{ minWidth: 30, fontWeight: 600 }}>
                  {option.id.toUpperCase()}.
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  value={option.text}
                  onChange={(e) => updateOptionText(index, e.target.value)}
                  placeholder={`Option ${option.id.toUpperCase()}`}
                />
                {form.options.length > 2 && (
                  <IconButton size="small" color="error" onClick={() => removeOption(index)}>
                    <RemoveCircleIcon />
                  </IconButton>
                )}
              </Box>
            ))}
            <Button size="small" startIcon={<AddIcon />} onClick={addOption}>
              Add Option
            </Button>

            <FormControl fullWidth>
              <InputLabel>Correct Answer</InputLabel>
              <Select
                value={form.correct_option_id}
                label="Correct Answer"
                onChange={(e) => setForm({ ...form, correct_option_id: e.target.value })}
              >
                {form.options.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.id.toUpperCase()}: {option.text || '(empty)'}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Explanation"
              fullWidth
              multiline
              rows={3}
              value={form.explanation}
              onChange={(e) => setForm({ ...form, explanation: e.target.value })}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            {editingQuestion ? 'Save Changes' : 'Create Question'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this question?
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

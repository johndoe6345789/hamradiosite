'use client';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import OptionEditor from './OptionEditor';
import type { QuestionOption } from '@/types/quiz';
import type { TopicWithContent } from '@/types/topic';

export interface QuestionFormData {
  text: string;
  topic_slug: string;
  options: QuestionOption[];
  correct_option_id: string;
  explanation: string;
}

interface QuestionFormDialogProps {
  open: boolean;
  isEditing: boolean;
  form: QuestionFormData;
  topics: TopicWithContent[];
  onClose: () => void;
  onSave: () => void;
  onFormChange: (form: QuestionFormData) => void;
}

export default function QuestionFormDialog({ open, isEditing, form, topics, onClose, onSave, onFormChange }: QuestionFormDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{isEditing ? 'Edit Question' : 'Add Question'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField label="Question Text" fullWidth multiline rows={3} value={form.text} onChange={(e) => onFormChange({ ...form, text: e.target.value })} />
          <FormControl fullWidth>
            <InputLabel>Topic</InputLabel>
            <Select value={form.topic_slug} label="Topic" onChange={(e) => onFormChange({ ...form, topic_slug: e.target.value })}>
              {topics.map((t) => <MenuItem key={t.slug} value={t.slug}>{t.title}</MenuItem>)}
            </Select>
          </FormControl>
          <OptionEditor options={form.options} onChange={(opts) => onFormChange({ ...form, options: opts, correct_option_id: opts.some((o) => o.id === form.correct_option_id) ? form.correct_option_id : '' })} />
          <FormControl fullWidth>
            <InputLabel>Correct Answer</InputLabel>
            <Select value={form.correct_option_id} label="Correct Answer" onChange={(e) => onFormChange({ ...form, correct_option_id: e.target.value })}>
              {form.options.map((o) => <MenuItem key={o.id} value={o.id}>{o.id.toUpperCase()}: {o.text || '(empty)'}</MenuItem>)}
            </Select>
          </FormControl>
          <TextField label="Explanation" fullWidth multiline rows={3} value={form.explanation} onChange={(e) => onFormChange({ ...form, explanation: e.target.value })} />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onSave} variant="contained">{isEditing ? 'Save Changes' : 'Create Question'}</Button>
      </DialogActions>
    </Dialog>
  );
}

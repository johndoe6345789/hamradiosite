'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import type { QuestionOption } from '@/types/quiz';

interface OptionEditorProps {
  options: QuestionOption[];
  onChange: (options: QuestionOption[]) => void;
}

export default function OptionEditor({ options, onChange }: OptionEditorProps) {
  const addOption = () => {
    const nextId = String.fromCharCode(97 + options.length);
    onChange([...options, { id: nextId, text: '' }]);
  };

  return (
    <>
      <Typography variant="subtitle1" fontWeight={600}>Options</Typography>
      {options.map((option, index) => (
        <Box key={option.id} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Typography sx={{ minWidth: 30, fontWeight: 600 }}>{option.id.toUpperCase()}.</Typography>
          <TextField fullWidth size="small" value={option.text} onChange={(e) => { const opts = options.map((o, i) => i === index ? { ...o, text: e.target.value } : o); onChange(opts); }} placeholder={`Option ${option.id.toUpperCase()}`} />
          {options.length > 2 && <IconButton size="small" color="error" onClick={() => onChange(options.filter((_, i) => i !== index))}><RemoveCircleIcon /></IconButton>}
        </Box>
      ))}
      <Button size="small" startIcon={<AddIcon />} onClick={addOption}>Add Option</Button>
    </>
  );
}

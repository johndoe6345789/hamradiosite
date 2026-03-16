'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import AddIcon from '@mui/icons-material/Add';

interface AdminPageHeaderProps {
  title: string;
  error: string | null;
  onAdd?: () => void;
  addLabel?: string;
}

export default function AdminPageHeader({ title, error, onAdd, addLabel }: AdminPageHeaderProps) {
  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>{title}</Typography>
        {onAdd && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={onAdd}>
            {addLabel || 'Add'}
          </Button>
        )}
      </Box>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
    </>
  );
}

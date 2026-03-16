'use client';

import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

interface QuizStartScreenProps {
  title: string;
  description: string;
  buttonLabel: string;
  onStart: () => void;
}

export default function QuizStartScreen({ title, description, buttonLabel, onStart }: QuizStartScreenProps) {
  return (
    <Container maxWidth="md" sx={{ py: 6, textAlign: 'center' }}>
      <Typography variant="h5" gutterBottom>{title}</Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>{description}</Typography>
      <Button variant="contained" size="large" onClick={onStart}>{buttonLabel}</Button>
    </Container>
  );
}

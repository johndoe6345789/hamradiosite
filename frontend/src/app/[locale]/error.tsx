'use client';

import { useTranslations } from 'next-intl';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  const t = useTranslations('common');

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="60vh"
        gap={3}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          {t('error')}
        </Typography>
        <Alert severity="error" sx={{ width: '100%' }}>
          {error.message || t('error')}
        </Alert>
        <Button variant="contained" onClick={reset}>
          {t('retry')}
        </Button>
      </Box>
    </Container>
  );
}

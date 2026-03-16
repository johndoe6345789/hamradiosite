'use client';

import { useTranslations } from 'next-intl';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import { Link } from '@/i18n/navigation';

export default function NotFoundPage() {
  const t = useTranslations('common');

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="60vh"
        textAlign="center"
        gap={3}
      >
        <SearchOffIcon sx={{ fontSize: 120, color: 'text.secondary', opacity: 0.5 }} />
        <Typography variant="h3" component="h1" fontWeight={700}>
          404
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          {t('notFound')}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          {t('notFoundMessage')}
        </Typography>
        <Button
          component={Link}
          href="/"
          variant="contained"
          size="large"
        >
          {t('backToHome')}
        </Button>
      </Box>
    </Container>
  );
}

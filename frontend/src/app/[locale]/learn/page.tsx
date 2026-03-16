'use client';

import { useTranslations } from 'next-intl';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import TopicCard from '@/components/learn/TopicCard';
import useTopics from '@/hooks/useTopics';

export default function LearnPage() {
  const t = useTranslations('learn');
  const { topics, loading } = useTopics();

  if (loading) {
    return <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh"><CircularProgress /></Box>;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ mb: 5 }}>
        <Typography variant="h3" component="h1" fontWeight={700} gutterBottom>{t('topicsTitle')}</Typography>
        <Typography variant="h6" color="text.secondary">{t('topicsSubtitle')}</Typography>
      </Box>
      <Grid container spacing={3}>
        {topics.map((topic) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={topic.id}>
            <TopicCard topic={topic} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

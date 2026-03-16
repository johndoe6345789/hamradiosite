'use client';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link } from '@/i18n/navigation';
import ContentRenderer from '@/components/learn/ContentRenderer';
import Sidebar from '@/components/layout/Sidebar';
import useTopicContent from '@/hooks/useTopicContent';

export default function TopicDetailPage() {
  const t = useTranslations('learn');
  const params = useParams<{ topicSlug: string }>();
  const { topic, loading } = useTopicContent(params.topicSlug);

  if (loading || !topic) {
    return <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh"><CircularProgress /></Box>;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button component={Link} href="/learn" startIcon={<ArrowBackIcon />} sx={{ mb: 3 }}>{t('backToTopics')}</Button>
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 3 }}><Sidebar /></Grid>
        <Grid size={{ xs: 12, md: 9 }}>
          <Typography variant="h3" component="h1" fontWeight={700} gutterBottom>{topic.title}</Typography>
          <Box sx={{ mt: 3 }}><ContentRenderer content={topic.content} /></Box>
        </Grid>
      </Grid>
    </Container>
  );
}

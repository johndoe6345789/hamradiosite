'use client';

import { useTranslations } from 'next-intl';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import MockExamCard from '@/components/quiz/MockExamCard';
import TopicQuizCard from '@/components/quiz/TopicQuizCard';
import useTopics from '@/hooks/useTopics';

export default function QuizSelectionPage() {
  const t = useTranslations('quiz');
  const { topics, loading } = useTopics();

  if (loading) {
    return <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh"><CircularProgress /></Box>;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ mb: 5 }}>
        <Typography variant="h3" component="h1" fontWeight={700} gutterBottom>{t('title')}</Typography>
        <Typography variant="h6" color="text.secondary">{t('subtitle')}</Typography>
      </Box>
      <MockExamCard title={t('mockExamTitle')} description={t('mockExamDescription')} questionsLabel={t('mockExamQuestions')} timeLabel={t('mockExamTime')} passLabel={t('mockExamPass')} startLabel={t('startExam')} />
      <Typography variant="h5" component="h2" fontWeight={600} gutterBottom sx={{ mb: 3 }}>{t('topicQuiz')}</Typography>
      <Grid container spacing={3}>
        {topics.map((topic) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={topic.id}>
            <TopicQuizCard id={`topic-${topic.slug}`} name={topic.title} questionCount={15} description={t('topicQuizDescription')} startLabel={t('startQuiz')} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

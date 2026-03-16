'use client';

import { useTranslations } from 'next-intl';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import QuizIcon from '@mui/icons-material/Quiz';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import ProgressChart from '@/components/progress/ProgressChart';
import WeakAreasList from '@/components/progress/WeakAreasList';
import StatCard from '@/components/progress/StatCard';
import AttemptCard from '@/components/progress/AttemptCard';
import useProgress from '@/hooks/useProgress';

export default function ProgressPage() {
  const t = useTranslations('progress');
  const { overall, topicBreakdown, weakAreas, history, loading, isAuthenticated } = useProgress();

  if (!isAuthenticated) return null;

  if (loading) {
    return <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh"><CircularProgress /></Box>;
  }

  const stats = [
    { label: t('totalQuizzes'), value: overall?.totalQuizzes ?? 0, icon: QuizIcon },
    { label: t('averageScore'), value: `${overall?.averageScore ?? 0}%`, icon: TrendingUpIcon },
    { label: t('streak'), value: `${overall?.currentStreak ?? 0} ${t('days')}`, icon: WhatshotIcon },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ mb: 5 }}>
        <Typography variant="h3" component="h1" fontWeight={700} gutterBottom>{t('dashboard')}</Typography>
        <Typography variant="h6" color="text.secondary">{t('subtitle')}</Typography>
      </Box>
      <Grid container spacing={3} sx={{ mb: 5 }}>
        {stats.map(({ label, value, icon }) => (
          <Grid size={{ xs: 12, sm: 4 }} key={label}><StatCard label={label} value={value} icon={icon} /></Grid>
        ))}
      </Grid>
      <Box sx={{ mb: 5 }}>
        <Typography variant="h5" component="h2" fontWeight={600} gutterBottom>{t('topicBreakdown')}</Typography>
        <ProgressChart topicProgress={topicBreakdown} />
      </Box>
      <Box sx={{ mb: 5 }}>
        <Typography variant="h5" component="h2" fontWeight={600} gutterBottom>{t('weakAreas')}</Typography>
        <WeakAreasList weakAreas={weakAreas} />
      </Box>
      <Box>
        <Typography variant="h5" component="h2" fontWeight={600} gutterBottom>{t('recentHistory')}</Typography>
        {history.length === 0 && (
          <Typography variant="body1" color="text.secondary">{t('startPracticing')}</Typography>
        )}
        {history.map((a) => <AttemptCard key={a.id} attempt={a} passedLabel={t('passed')} notPassedLabel={t('notPassed')} />)}
      </Box>
    </Container>
  );
}

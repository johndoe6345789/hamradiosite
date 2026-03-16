'use client';

import { useTranslations } from 'next-intl';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import QuizIcon from '@mui/icons-material/Quiz';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import { useAppSelector } from '@/store/hooks';
import ProgressChart from '@/components/progress/ProgressChart';
import WeakAreasList from '@/components/progress/WeakAreasList';
import type { TopicProgress, QuizAttemptSummary } from '@/types/progress';

const MOCK_TOPIC_PROGRESS: TopicProgress[] = [
  { topicId: '1', topicTitle: 'Licensing Conditions', topicSlug: 'licensing-conditions', totalAttempts: 5, averageScore: 85, lastAttemptDate: '2024-01-15' },
  { topicId: '2', topicTitle: 'Technical Basics', topicSlug: 'technical-basics', totalAttempts: 3, averageScore: 62, lastAttemptDate: '2024-01-14' },
  { topicId: '3', topicTitle: 'Transmitters & Receivers', topicSlug: 'transmitters-receivers', totalAttempts: 4, averageScore: 78, lastAttemptDate: '2024-01-13' },
  { topicId: '4', topicTitle: 'Feeders & Antennas', topicSlug: 'feeders-antennas', totalAttempts: 2, averageScore: 55, lastAttemptDate: '2024-01-12' },
  { topicId: '5', topicTitle: 'Propagation', topicSlug: 'propagation', totalAttempts: 3, averageScore: 90, lastAttemptDate: '2024-01-11' },
  { topicId: '6', topicTitle: 'EMC', topicSlug: 'emc', totalAttempts: 1, averageScore: 70, lastAttemptDate: '2024-01-10' },
  { topicId: '7', topicTitle: 'Operating Practices', topicSlug: 'operating-practices', totalAttempts: 4, averageScore: 82, lastAttemptDate: '2024-01-09' },
  { topicId: '8', topicTitle: 'Safety', topicSlug: 'safety', totalAttempts: 2, averageScore: 75, lastAttemptDate: '2024-01-08' },
];

const MOCK_RECENT_ATTEMPTS: QuizAttemptSummary[] = [
  { id: '1', quizType: 'mock', topicTitle: null, score: 20, total: 26, passed: true, completedAt: '2024-01-15T14:30:00Z' },
  { id: '2', quizType: 'topic', topicTitle: 'Technical Basics', score: 8, total: 15, passed: false, completedAt: '2024-01-14T10:00:00Z' },
  { id: '3', quizType: 'topic', topicTitle: 'Licensing Conditions', score: 13, total: 15, passed: true, completedAt: '2024-01-13T16:45:00Z' },
];

export default function ProgressPage() {
  const t = useTranslations('progress');
  const progressState = useAppSelector((state) => state.progress);

  const overall = progressState.overall;
  const topicBreakdown = progressState.topicBreakdown.length > 0
    ? progressState.topicBreakdown
    : MOCK_TOPIC_PROGRESS;
  const history = progressState.history.length > 0
    ? progressState.history
    : MOCK_RECENT_ATTEMPTS;
  const weakAreas = (progressState.weakAreas.length > 0
    ? progressState.weakAreas
    : MOCK_TOPIC_PROGRESS.filter((tp) => tp.averageScore < 70));

  const displayQuizzes = overall?.totalQuizzes ?? 12;
  const displayAvg = overall?.averageScore ?? 74;
  const displayStreak = overall?.currentStreak ?? 3;

  const statCards = [
    { label: t('totalQuizzes'), value: displayQuizzes, icon: QuizIcon },
    { label: t('averageScore'), value: `${displayAvg}%`, icon: TrendingUpIcon },
    { label: t('streak'), value: `${displayStreak} ${t('days')}`, icon: WhatshotIcon },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ mb: 5 }}>
        <Typography variant="h3" component="h1" fontWeight={700} gutterBottom>
          {t('dashboard')}
        </Typography>
        <Typography variant="h6" color="text.secondary">
          {t('subtitle')}
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 5 }}>
        {statCards.map(({ label, value, icon: Icon }) => (
          <Grid size={{ xs: 12, sm: 4 }} key={label}>
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Icon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                <Typography variant="h4" fontWeight={700}>
                  {value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {label}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mb: 5 }}>
        <Typography variant="h5" component="h2" fontWeight={600} gutterBottom>
          {t('topicBreakdown')}
        </Typography>
        <ProgressChart topicProgress={topicBreakdown} />
      </Box>

      <Box sx={{ mb: 5 }}>
        <Typography variant="h5" component="h2" fontWeight={600} gutterBottom>
          {t('weakAreas')}
        </Typography>
        <WeakAreasList weakAreas={weakAreas} />
      </Box>

      <Box>
        <Typography variant="h5" component="h2" fontWeight={600} gutterBottom>
          {t('recentHistory')}
        </Typography>
        {history.map((attempt) => (
          <Card key={attempt.id} sx={{ mb: 2 }}>
            <CardContent
              sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <Box>
                <Typography variant="subtitle1" fontWeight={600}>
                  {attempt.quizType === 'mock'
                    ? 'Mock Examination'
                    : attempt.topicTitle}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {new Date(attempt.completedAt).toLocaleDateString()}
                </Typography>
              </Box>
              <Box textAlign="right">
                <Typography
                  variant="h6"
                  fontWeight={700}
                  color={attempt.passed ? 'success.main' : 'error.main'}
                >
                  {attempt.score}/{attempt.total}
                </Typography>
                <Typography
                  variant="caption"
                  color={attempt.passed ? 'success.main' : 'error.main'}
                >
                  {attempt.passed ? 'Passed' : 'Not passed'}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Container>
  );
}

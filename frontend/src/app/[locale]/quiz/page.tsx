'use client';

import { useTranslations } from 'next-intl';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import TimerIcon from '@mui/icons-material/Timer';
import QuizIcon from '@mui/icons-material/Quiz';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Link } from '@/i18n/navigation';

const TOPIC_QUIZZES = [
  { id: 'topic-licensing', name: 'Licensing Conditions', questionCount: 15 },
  { id: 'topic-technical', name: 'Technical Basics', questionCount: 20 },
  { id: 'topic-txrx', name: 'Transmitters & Receivers', questionCount: 18 },
  { id: 'topic-antennas', name: 'Feeders & Antennas', questionCount: 15 },
  { id: 'topic-propagation', name: 'Propagation', questionCount: 12 },
  { id: 'topic-emc', name: 'EMC', questionCount: 10 },
  { id: 'topic-operating', name: 'Operating Practices', questionCount: 16 },
  { id: 'topic-safety', name: 'Safety', questionCount: 12 },
];

export default function QuizSelectionPage() {
  const t = useTranslations('quiz');

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ mb: 5 }}>
        <Typography variant="h3" component="h1" fontWeight={700} gutterBottom>
          {t('title')}
        </Typography>
        <Typography variant="h6" color="text.secondary">
          {t('subtitle')}
        </Typography>
      </Box>

      {/* Mock Exam Card */}
      <Card
        sx={{
          mb: 5,
          background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)',
          color: 'white',
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" component="h2" fontWeight={700} gutterBottom>
            {t('mockExamTitle')}
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
            {t('mockExamDescription')}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
            <Chip
              icon={<QuizIcon />}
              label={t('mockExamQuestions')}
              sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
            />
            <Chip
              icon={<TimerIcon />}
              label={t('mockExamTime')}
              sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
            />
            <Chip
              icon={<CheckCircleIcon />}
              label={t('mockExamPass')}
              sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
            />
          </Box>
        </CardContent>
        <CardActions sx={{ p: 4, pt: 0 }}>
          <Button
            component={Link}
            href="/quiz/mock-exam"
            variant="contained"
            size="large"
            sx={{
              bgcolor: 'white',
              color: 'primary.dark',
              '&:hover': { bgcolor: 'grey.100' },
            }}
          >
            {t('startExam')}
          </Button>
        </CardActions>
      </Card>

      {/* Topic Quiz Cards */}
      <Typography variant="h5" component="h2" fontWeight={600} gutterBottom sx={{ mb: 3 }}>
        {t('topicQuiz')}
      </Typography>
      <Grid container spacing={3}>
        {TOPIC_QUIZZES.map((quiz) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={quiz.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'translateY(-2px)' },
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" component="h3" fontWeight={600} gutterBottom>
                  {quiz.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {t('topicQuizDescription')}
                </Typography>
                <Chip
                  label={`${quiz.questionCount} questions`}
                  size="small"
                  variant="outlined"
                />
              </CardContent>
              <CardActions sx={{ p: 2 }}>
                <Button
                  component={Link}
                  href={`/quiz/${quiz.id}`}
                  variant="outlined"
                  fullWidth
                >
                  {t('startQuiz')}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

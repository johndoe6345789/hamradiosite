'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import TimerIcon from '@mui/icons-material/Timer';
import QuizIcon from '@mui/icons-material/Quiz';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Link } from '@/i18n/navigation';

interface MockExamCardProps {
  title: string;
  description: string;
  questionsLabel: string;
  timeLabel: string;
  passLabel: string;
  startLabel: string;
}

export default function MockExamCard({ title, description, questionsLabel, timeLabel, passLabel, startLabel }: MockExamCardProps) {
  return (
    <Card sx={{ mb: 5, background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)', color: 'white' }}>
      <CardContent sx={{ p: 4 }}>
        <Typography variant="h4" component="h2" fontWeight={700} gutterBottom>{title}</Typography>
        <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>{description}</Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
          <Chip icon={<QuizIcon />} label={questionsLabel} sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} />
          <Chip icon={<TimerIcon />} label={timeLabel} sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} />
          <Chip icon={<CheckCircleIcon />} label={passLabel} sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} />
        </Box>
      </CardContent>
      <CardActions sx={{ p: 4, pt: 0 }}>
        <Button component={Link} href="/quiz/mock-exam" variant="contained" size="large" sx={{ bgcolor: 'white', color: 'primary.dark', '&:hover': { bgcolor: 'grey.100' } }}>
          {startLabel}
        </Button>
      </CardActions>
    </Card>
  );
}

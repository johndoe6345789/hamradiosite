'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import type { QuizAttemptSummary } from '@/types/progress';

interface AttemptCardProps {
  attempt: QuizAttemptSummary;
  passedLabel: string;
  notPassedLabel: string;
}

export default function AttemptCard({ attempt, passedLabel, notPassedLabel }: AttemptCardProps) {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="subtitle1" fontWeight={600}>
            {attempt.quizType === 'mock' ? 'Mock Examination' : attempt.topicTitle}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {new Date(attempt.completedAt).toLocaleDateString()}
          </Typography>
        </Box>
        <Box textAlign="right">
          <Typography variant="h6" fontWeight={700} color={attempt.passed ? 'success.main' : 'error.main'}>
            {attempt.score}/{attempt.total}
          </Typography>
          <Typography variant="caption" color={attempt.passed ? 'success.main' : 'error.main'}>
            {attempt.passed ? passedLabel : notPassedLabel}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

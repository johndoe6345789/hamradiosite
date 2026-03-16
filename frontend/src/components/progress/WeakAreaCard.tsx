'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { Link } from '@/i18n/navigation';
import type { TopicProgress } from '@/types/progress';

interface WeakAreaCardProps {
  area: TopicProgress;
  attemptsLabel: string;
  studyLabel: string;
  practiceLabel: string;
}

export default function WeakAreaCard({ area, attemptsLabel, studyLabel, practiceLabel }: WeakAreaCardProps) {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <WarningAmberIcon color="warning" />
          <Box>
            <Typography variant="subtitle1" fontWeight={600}>{area.topicTitle}</Typography>
            <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
              <Chip label={`${area.averageScore}%`} size="small" color="warning" variant="outlined" />
              <Chip label={`${area.totalAttempts} ${attemptsLabel}`} size="small" variant="outlined" />
            </Box>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button component={Link} href={`/learn/${area.topicSlug}`} variant="outlined" size="small">{studyLabel}</Button>
          <Button component={Link} href={`/quiz/topic-${area.topicSlug}`} variant="contained" size="small">{practiceLabel}</Button>
        </Box>
      </CardContent>
    </Card>
  );
}

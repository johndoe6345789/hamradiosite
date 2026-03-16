'use client';

import { useTranslations } from 'next-intl';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import { getScoreColor } from '@/lib/scoreColor';
import type { TopicProgress } from '@/types/progress';

interface ProgressChartProps {
  topicProgress: TopicProgress[];
}

export default function ProgressChart({ topicProgress }: ProgressChartProps) {
  const t = useTranslations('progress');

  if (topicProgress.length === 0) {
    return (
      <Card>
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" color="text.secondary">{t('noDataYet')}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>{t('startPracticing')}</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        {topicProgress.map((topic) => (
          <Box key={topic.topicId} sx={{ mb: 3, '&:last-child': { mb: 0 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
              <Typography variant="body2" fontWeight={500}>{topic.topicTitle}</Typography>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Typography variant="caption" color="text.secondary">{topic.totalAttempts} {t('attempts')}</Typography>
                <Typography variant="body2" fontWeight={600} color={`${getScoreColor(topic.averageScore)}.main`}>{topic.averageScore}%</Typography>
              </Box>
            </Box>
            <LinearProgress variant="determinate" value={topic.averageScore} color={getScoreColor(topic.averageScore)} sx={{ height: 8, borderRadius: 4, bgcolor: 'action.hover', '& .MuiLinearProgress-bar': { borderRadius: 4 } }} />
          </Box>
        ))}
      </CardContent>
    </Card>
  );
}

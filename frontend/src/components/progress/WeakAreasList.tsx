'use client';

import { useTranslations } from 'next-intl';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { Link } from '@/i18n/navigation';
import type { TopicProgress } from '@/types/progress';

interface WeakAreasListProps {
  weakAreas: TopicProgress[];
}

export default function WeakAreasList({ weakAreas }: WeakAreasListProps) {
  const t = useTranslations('progress');

  if (weakAreas.length === 0) {
    return (
      <Card>
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" color="success.main" fontWeight={600}>
            {t('weakAreasEmpty')}
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box>
      {weakAreas.map((area) => (
        <Card key={area.topicId} sx={{ mb: 2 }}>
          <CardContent
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 2,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <WarningAmberIcon color="warning" />
              <Box>
                <Typography variant="subtitle1" fontWeight={600}>
                  {area.topicTitle}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                  <Chip
                    label={`${area.averageScore}%`}
                    size="small"
                    color="warning"
                    variant="outlined"
                  />
                  <Chip
                    label={`${area.totalAttempts} ${t('attempts')}`}
                    size="small"
                    variant="outlined"
                  />
                </Box>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                component={Link}
                href={`/learn/${area.topicSlug}`}
                variant="outlined"
                size="small"
              >
                {t('score')}
              </Button>
              <Button
                component={Link}
                href={`/quiz/topic-${area.topicSlug}`}
                variant="contained"
                size="small"
              >
                {t('practiceMore')}
              </Button>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}

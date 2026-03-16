'use client';

import { useTranslations } from 'next-intl';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import SchoolIcon from '@mui/icons-material/School';
import GavelIcon from '@mui/icons-material/Gavel';
import ElectricalServicesIcon from '@mui/icons-material/ElectricalServices';
import RadioIcon from '@mui/icons-material/Radio';
import CellTowerIcon from '@mui/icons-material/CellTower';
import WavesIcon from '@mui/icons-material/Waves';
import SettingsInputAntennaIcon from '@mui/icons-material/SettingsInputAntenna';
import HeadsetIcon from '@mui/icons-material/Headset';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import type { Topic } from '@/types/topic';
import { Link } from '@/i18n/navigation';

const ICON_MAP: Record<string, React.ElementType> = {
  Gavel: GavelIcon,
  ElectricalServices: ElectricalServicesIcon,
  Radio: RadioIcon,
  CellTower: CellTowerIcon,
  Waves: WavesIcon,
  SettingsInputAntenna: SettingsInputAntennaIcon,
  Headset: HeadsetIcon,
  HealthAndSafety: HealthAndSafetyIcon,
};

interface TopicCardProps {
  topic: Topic;
  progress?: number;
}

export default function TopicCard({ topic, progress }: TopicCardProps) {
  const t = useTranslations('learn');
  const IconComponent = ICON_MAP[topic.icon] || SchoolIcon;

  return (
    <Card
      sx={{
        height: '100%',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
      }}
    >
      <CardActionArea
        component={Link}
        href={`/learn/${topic.slug}`}
        sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
      >
        <CardContent sx={{ width: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
            <Box
              sx={{
                bgcolor: 'primary.main',
                color: 'white',
                borderRadius: 2,
                p: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <IconComponent />
            </Box>
            <Typography variant="h6" component="h3" fontWeight={600}>
              {topic.title}
            </Typography>
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {topic.description}
          </Typography>

          {progress !== undefined && progress > 0 && (
            <Typography variant="caption" color="primary.main" fontWeight={600}>
              {t('readMore')}
            </Typography>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

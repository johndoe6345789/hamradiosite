'use client';

import { useTranslations } from 'next-intl';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import SchoolIcon from '@mui/icons-material/School';
import QuizIcon from '@mui/icons-material/Quiz';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import HeroSection from '@/components/home/HeroSection';
import FeatureCard from '@/components/home/FeatureCard';
import CtaSection from '@/components/home/CtaSection';

const FEATURES = [
  { icon: SchoolIcon, titleKey: 'featureLearnTitle', descKey: 'featureLearnDescription' },
  { icon: QuizIcon, titleKey: 'featureQuizTitle', descKey: 'featureQuizDescription' },
  { icon: TrendingUpIcon, titleKey: 'featureTrackTitle', descKey: 'featureTrackDescription' },
  { icon: EmojiEventsIcon, titleKey: 'featureAchieveTitle', descKey: 'featureAchieveDescription' },
] as const;

export default function HomePage() {
  const t = useTranslations('home');
  const tc = useTranslations('common');

  return (
    <Box>
      <HeroSection title={t('heroTitle')} subtitle={t('heroSubtitle')} getStartedLabel={t('getStarted')} learnMoreLabel={t('learnMore')} />
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Typography variant="h4" component="h2" textAlign="center" fontWeight={600} gutterBottom sx={{ mb: 6 }}>
          {t('featuresHeading')}
        </Typography>
        <Grid container spacing={4}>
          {FEATURES.map(({ icon, titleKey, descKey }) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={titleKey}>
              <FeatureCard icon={icon} title={t(titleKey)} description={t(descKey)} />
            </Grid>
          ))}
        </Grid>
      </Container>
      <Box sx={{ bgcolor: 'background.paper', py: { xs: 6, md: 8 } }}>
        <Container maxWidth="md">
          <Grid container spacing={4} justifyContent="center">
            {(['statsQuestions', 'statsTopics', 'statsExams'] as const).map((key) => (
              <Grid size={{ xs: 12, sm: 4 }} key={key}>
                <Box textAlign="center">
                  <Typography variant="h4" component="p" fontWeight={700} color="primary.main">{tc(key)}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
      <CtaSection title={t('ctaTitle')} subtitle={t('ctaSubtitle')} buttonLabel={t('ctaButton')} />
    </Box>
  );
}

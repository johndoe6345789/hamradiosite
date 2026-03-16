'use client';

import { useTranslations } from 'next-intl';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import SchoolIcon from '@mui/icons-material/School';
import QuizIcon from '@mui/icons-material/Quiz';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { Link } from '@/i18n/navigation';

const features = [
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
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 50%, #1a237e 100%)',
          color: 'white',
          py: { xs: 8, md: 12 },
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h2"
            component="h1"
            fontWeight={700}
            gutterBottom
            sx={{ fontSize: { xs: '2rem', md: '3rem' } }}
          >
            {t('heroTitle')}
          </Typography>
          <Typography
            variant="h6"
            component="p"
            sx={{ mb: 4, opacity: 0.9, maxWidth: 600, mx: 'auto' }}
          >
            {t('heroSubtitle')}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              component={Link}
              href="/learn"
              variant="contained"
              size="large"
              sx={{
                bgcolor: 'white',
                color: 'primary.dark',
                '&:hover': { bgcolor: 'grey.100' },
                px: 4,
                py: 1.5,
              }}
            >
              {t('getStarted')}
            </Button>
            <Button
              component={Link}
              href="/about"
              variant="outlined"
              size="large"
              sx={{
                borderColor: 'white',
                color: 'white',
                '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' },
                px: 4,
                py: 1.5,
              }}
            >
              {t('learnMore')}
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Typography
          variant="h4"
          component="h2"
          textAlign="center"
          fontWeight={600}
          gutterBottom
          sx={{ mb: 6 }}
        >
          {t('featuresHeading')}
        </Typography>
        <Grid container spacing={4}>
          {features.map(({ icon: Icon, titleKey, descKey }) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={titleKey}>
              <Card
                sx={{
                  height: '100%',
                  textAlign: 'center',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-4px)' },
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Icon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                  <Typography variant="h6" component="h3" gutterBottom fontWeight={600}>
                    {t(titleKey)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t(descKey)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Statistics Section */}
      <Box sx={{ bgcolor: 'background.paper', py: { xs: 6, md: 8 } }}>
        <Container maxWidth="md">
          <Grid container spacing={4} justifyContent="center">
            {(['statsQuestions', 'statsTopics', 'statsExams'] as const).map((key) => (
              <Grid size={{ xs: 12, sm: 4 }} key={key}>
                <Box textAlign="center">
                  <Typography variant="h4" component="p" fontWeight={700} color="primary.main">
                    {tc(key)}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #ff8f00 0%, #c56000 100%)',
          color: 'white',
          py: { xs: 6, md: 8 },
          textAlign: 'center',
        }}
      >
        <Container maxWidth="sm">
          <Typography variant="h4" component="h2" fontWeight={700} gutterBottom>
            {t('ctaTitle')}
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, opacity: 0.9 }}>
            {t('ctaSubtitle')}
          </Typography>
          <Button
            component={Link}
            href="/learn"
            variant="contained"
            size="large"
            sx={{
              bgcolor: 'white',
              color: '#c56000',
              '&:hover': { bgcolor: 'grey.100' },
              px: 4,
              py: 1.5,
            }}
          >
            {t('ctaButton')}
          </Button>
        </Container>
      </Box>
    </Box>
  );
}

'use client';

import { useTranslations } from 'next-intl';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

const SYLLABUS_TOPICS = [
  'Licensing conditions',
  'Technical basics',
  'Transmitters and receivers',
  'Feeders and antennas',
  'Propagation',
  'Electromagnetic compatibility (EMC)',
  'Operating practices and procedures',
  'Safety',
];

export default function AboutPage() {
  const t = useTranslations('about');

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h3" component="h1" fontWeight={700} gutterBottom>
        {t('title')}
      </Typography>
      <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
        {t('subtitle')}
      </Typography>

      <Divider sx={{ mb: 4 }} />

      {/* Intro */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h5" component="h2" fontWeight={600} gutterBottom>
          {t('introTitle')}
        </Typography>
        <Typography variant="body1" paragraph>
          {t('aboutSite')}
        </Typography>
      </Box>

      {/* Exam Format */}
      <Card sx={{ mb: 5 }}>
        <CardContent>
          <Typography variant="h5" component="h2" fontWeight={600} gutterBottom>
            {t('formatTitle')}
          </Typography>
          <List>
            {(['examQuestions', 'examTime', 'examPassMark', 'examTopics'] as const).map(
              (key) => (
                <ListItem key={key}>
                  <ListItemIcon>
                    <CheckCircleOutlineIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={t(key)} />
                </ListItem>
              )
            )}
          </List>
        </CardContent>
      </Card>

      {/* Syllabus Topics */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h5" component="h2" fontWeight={600} gutterBottom>
          {t('topicsTitle')}
        </Typography>
        <List>
          {SYLLABUS_TOPICS.map((topic, index) => (
            <ListItem key={topic}>
              <ListItemIcon>
                <Typography variant="body1" fontWeight={600} color="primary.main">
                  {index + 1}.
                </Typography>
              </ListItemIcon>
              <ListItemText primary={topic} />
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Resources */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h5" component="h2" fontWeight={600} gutterBottom>
          {t('resourcesTitle')}
        </Typography>
        <List>
          <ListItem>
            <ListItemIcon>
              <OpenInNewIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary={
                <Link
                  href="https://rsgb.org"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t('rsgbLink')}
                </Link>
              }
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <OpenInNewIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary={
                <Link
                  href="https://www.ofcom.org.uk/manage-your-licence/radiocommunication-licences/amateur-radio"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t('ofcomLink')}
                </Link>
              }
            />
          </ListItem>
        </List>
      </Box>

      {/* Disclaimer */}
      <Alert severity="info" sx={{ mt: 4 }}>
        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
          {t('disclaimerTitle')}
        </Typography>
        <Typography variant="body2">{t('disclaimer')}</Typography>
      </Alert>
    </Container>
  );
}

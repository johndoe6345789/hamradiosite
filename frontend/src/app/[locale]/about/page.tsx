'use client';

import { useTranslations } from 'next-intl';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import ComputerIcon from '@mui/icons-material/Computer';
import GroupsIcon from '@mui/icons-material/Groups';
import EventNoteIcon from '@mui/icons-material/EventNote';
import BadgeIcon from '@mui/icons-material/Badge';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ExamFormatCard from '@/components/about/ExamFormatCard';
import ResourceLink from '@/components/about/ResourceLink';

const SYLLABUS_TOPICS = [
  'Licensing conditions', 'Technical basics', 'Transmitters and receivers',
  'Feeders and antennas', 'Propagation', 'Electromagnetic compatibility (EMC)',
  'Operating practices and procedures', 'Safety',
];

export default function AboutPage() {
  const t = useTranslations('about');

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h3" component="h1" fontWeight={700} gutterBottom>{t('title')}</Typography>
      <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>{t('subtitle')}</Typography>
      <Divider sx={{ mb: 4 }} />
      <Box sx={{ mb: 5 }}>
        <Typography variant="h5" component="h2" fontWeight={600} gutterBottom>{t('introTitle')}</Typography>
        <Typography variant="body1" paragraph>{t('aboutSite')}</Typography>
      </Box>
      <ExamFormatCard title={t('formatTitle')} items={[t('examQuestions'), t('examTime'), t('examPassMark'), t('examTopics')]} />

      {/* How to Take the Exam */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h5" component="h2" fontWeight={600} gutterBottom>{t('howToTitle')}</Typography>
        <Typography variant="body1" paragraph>{t('howToIntro')}</Typography>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 3 }}>
          <Card variant="outlined" sx={{ flex: 1 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <ComputerIcon color="primary" />
                <Typography variant="h6" fontWeight={600}>{t('howToOnlineTitle')}</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">{t('howToOnline')}</Typography>
            </CardContent>
          </Card>
          <Card variant="outlined" sx={{ flex: 1 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <GroupsIcon color="primary" />
                <Typography variant="h6" fontWeight={600}>{t('howToInPersonTitle')}</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">{t('howToInPerson')}</Typography>
            </CardContent>
          </Card>
        </Box>
        <Card variant="outlined" sx={{ mb: 2 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <EventNoteIcon color="primary" />
              <Typography variant="h6" fontWeight={600}>{t('howToBookTitle')}</Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" paragraph>{t('howToBook')}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <BadgeIcon color="primary" fontSize="small" />
              <Typography variant="body2" color="text.secondary">{t('howToWhatYouNeed')}</Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Licence Tiers */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h5" component="h2" fontWeight={600} gutterBottom>{t('tierTitle')}</Typography>
        <Typography variant="body1" paragraph>{t('tierIntro')}</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
          {[
            { key: 'Foundation', color: 'primary' as const, power: '10W' },
            { key: 'Intermediate', color: 'warning' as const, power: '50W' },
            { key: 'Full', color: 'success' as const, power: '400W' },
          ].map((tier, i, arr) => (
            <Box key={tier.key}>
              <Card variant="outlined" sx={{ borderColor: `${tier.color}.main`, borderWidth: tier.key === 'Foundation' ? 2 : 1 }}>
                <CardContent sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Chip label={tier.power} color={tier.color} size="small" sx={{ fontWeight: 700, mt: 0.5 }} />
                  <Box>
                    <Typography variant="h6" fontWeight={600}>{t(`tier${tier.key}Title`)}</Typography>
                    <Typography variant="body2" color="text.secondary">{t(`tier${tier.key}Desc`)}</Typography>
                  </Box>
                </CardContent>
              </Card>
              {i < arr.length - 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 0.5 }}>
                  <ArrowForwardIcon color="action" sx={{ transform: 'rotate(90deg)' }} />
                </Box>
              )}
            </Box>
          ))}
        </Box>
        <Typography variant="body1" color="text.secondary">{t('tierAfterPassing')}</Typography>
      </Box>

      {/* Syllabus Topics */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h5" component="h2" fontWeight={600} gutterBottom>{t('topicsTitle')}</Typography>
        <List>
          {SYLLABUS_TOPICS.map((topic, i) => (
            <ListItem key={topic}>
              <ListItemIcon><Typography variant="body1" fontWeight={600} color="primary.main">{i + 1}.</Typography></ListItemIcon>
              <ListItemText primary={topic} />
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Resources */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h5" component="h2" fontWeight={600} gutterBottom>{t('resourcesTitle')}</Typography>
        <List>
          <ResourceLink href="https://rsgb.org/main/clubs-and-education/exams/" label={t('rsgbExamsLink')} />
          <ResourceLink href="https://rsgb.org/main/clubs-and-education/find-a-club/" label={t('rsgbClubFinderLink')} />
          <ResourceLink href="https://rsgb.org" label={t('rsgbLink')} />
          <ResourceLink href="https://www.ofcom.org.uk/manage-your-licence/radiocommunication-licences/amateur-radio" label={t('ofcomLink')} />
        </List>
      </Box>
      {/* References */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h5" component="h2" fontWeight={600} gutterBottom>{t('referencesTitle')}</Typography>
        <List dense>
          <ListItem sx={{ display: 'list-item', listStyleType: 'none', pl: 4, textIndent: '-2rem' }}>
            <ListItemText primary="Betts, A. (2019) Foundation Licence Now! 5th edn. Bedford: RSGB. ISBN: 978-1-8723-0980-4." />
          </ListItem>
          <ListItem sx={{ display: 'list-item', listStyleType: 'none', pl: 4, textIndent: '-2rem' }}>
            <ListItemText primary="Ofcom (2024) Amateur Radio Licence Terms, Conditions and Limitations. Available at: https://www.ofcom.org.uk/manage-your-licence/radiocommunication-licences/amateur-radio (Accessed: 15 March 2026)." />
          </ListItem>
          <ListItem sx={{ display: 'list-item', listStyleType: 'none', pl: 4, textIndent: '-2rem' }}>
            <ListItemText primary="RSGB (2024) Foundation Exam Syllabus. Available at: https://rsgb.org/main/clubs-and-education/for-students/ (Accessed: 15 March 2026)." />
          </ListItem>
          <ListItem sx={{ display: 'list-item', listStyleType: 'none', pl: 4, textIndent: '-2rem' }}>
            <ListItemText primary="RSGB (2024) UK Band Plans. Available at: https://rsgb.org/main/operating/band-plans/ (Accessed: 15 March 2026)." />
          </ListItem>
          <ListItem sx={{ display: 'list-item', listStyleType: 'none', pl: 4, textIndent: '-2rem' }}>
            <ListItemText primary="RSGB (2024) Exam Booking. Available at: https://rsgb.org/main/clubs-and-education/exams/ (Accessed: 15 March 2026)." />
          </ListItem>
        </List>
      </Box>

      <Alert severity="info" sx={{ mt: 4 }}>
        <Typography variant="subtitle2" fontWeight={600} gutterBottom>{t('disclaimerTitle')}</Typography>
        <Typography variant="body2">{t('disclaimer')}</Typography>
      </Alert>
    </Container>
  );
}

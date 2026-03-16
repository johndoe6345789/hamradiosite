'use client';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link } from '@/i18n/navigation';
import ContentRenderer from '@/components/learn/ContentRenderer';
import Sidebar from '@/components/layout/Sidebar';

const TOPIC_CONTENT: Record<string, { title: string; content: string }> = {
  'licensing-conditions': {
    title: 'Licensing Conditions',
    content: `
      <h2>Overview</h2>
      <p>The Foundation licence is administered by the RSGB on behalf of Ofcom. It allows you to transmit on amateur radio bands with a maximum power of 10 watts.</p>
      <h3>Your Callsign</h3>
      <p>Upon passing the exam, you will be issued a unique callsign. Foundation callsigns follow the format M7xxx, where xxx is a unique combination of letters.</p>
      <h3>Permitted Bands</h3>
      <p>Foundation licence holders can operate on various HF, VHF, and UHF bands. The specific frequency allocations are detailed in the licence schedule.</p>
      <h3>Key Conditions</h3>
      <ul>
        <li>You must identify your station with your callsign at regular intervals</li>
        <li>You must keep a log of your transmissions</li>
        <li>You must not cause undue interference to other services</li>
        <li>You must operate within the power limits specified for your licence level</li>
      </ul>
    `,
  },
  'technical-basics': {
    title: 'Technical Basics',
    content: `
      <h2>Electrical Principles</h2>
      <p>Understanding basic electrical principles is fundamental to amateur radio. This topic covers voltage, current, resistance, and power.</p>
      <h3>Ohm's Law</h3>
      <p>Ohm's Law states that V = I x R, where V is voltage (volts), I is current (amperes), and R is resistance (ohms).</p>
      <h3>Power</h3>
      <p>Electrical power is measured in watts and can be calculated using P = V x I.</p>
      <h3>Components</h3>
      <ul>
        <li><strong>Resistors</strong> - limit current flow</li>
        <li><strong>Capacitors</strong> - store electrical energy in an electric field</li>
        <li><strong>Inductors</strong> - store electrical energy in a magnetic field</li>
        <li><strong>Diodes</strong> - allow current to flow in one direction only</li>
        <li><strong>Transistors</strong> - amplify or switch electronic signals</li>
      </ul>
    `,
  },
};

const DEFAULT_CONTENT = {
  title: 'Topic',
  content: '<p>Content for this topic is being prepared. Please check back soon.</p>',
};

export default function TopicDetailPage() {
  const t = useTranslations('learn');
  const params = useParams<{ topicSlug: string }>();
  const topicSlug = params.topicSlug;

  const topic = TOPIC_CONTENT[topicSlug] || DEFAULT_CONTENT;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button
        component={Link}
        href="/learn"
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 3 }}
      >
        {t('backToTopics')}
      </Button>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 3 }}>
          <Sidebar />
        </Grid>
        <Grid size={{ xs: 12, md: 9 }}>
          <Typography variant="h3" component="h1" fontWeight={700} gutterBottom>
            {topic.title}
          </Typography>
          <Box sx={{ mt: 3 }}>
            <ContentRenderer content={topic.content} />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}

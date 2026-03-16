'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { Link } from '@/i18n/navigation';

interface CtaSectionProps {
  title: string;
  subtitle: string;
  buttonLabel: string;
}

export default function CtaSection({ title, subtitle, buttonLabel }: CtaSectionProps) {
  return (
    <Box sx={{ background: 'linear-gradient(135deg, #ff8f00 0%, #c56000 100%)', color: 'white', py: { xs: 6, md: 8 }, textAlign: 'center' }}>
      <Container maxWidth="sm">
        <Typography variant="h4" component="h2" fontWeight={700} gutterBottom>
          {title}
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, opacity: 0.9 }}>
          {subtitle}
        </Typography>
        <Button component={Link} href="/learn" variant="contained" size="large" sx={{ bgcolor: 'white', color: '#c56000', '&:hover': { bgcolor: 'grey.100' }, px: 4, py: 1.5 }}>
          {buttonLabel}
        </Button>
      </Container>
    </Box>
  );
}

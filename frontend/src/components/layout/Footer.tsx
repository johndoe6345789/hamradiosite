'use client';

import { useTranslations } from 'next-intl';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import MuiLink from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { Link } from '@/i18n/navigation';

const FOOTER_LINKS = [
  { key: 'learn' as const, href: '/learn' },
  { key: 'quiz' as const, href: '/quiz' },
  { key: 'about' as const, href: '/about' },
];

export default function Footer() {
  const t = useTranslations('common');
  const tn = useTranslations('nav');

  return (
    <Box component="footer" sx={{ bgcolor: 'background.paper', mt: 'auto' }}>
      <Divider />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
          <Box>
            <Typography variant="body2" color="text.secondary">&copy; {new Date().getFullYear()} {t('copyright')}</Typography>
            <Typography variant="caption" color="text.secondary">{t('builtFor')}</Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 3 }}>
            {FOOTER_LINKS.map(({ key, href }) => (
              <MuiLink key={key} component={Link} href={href} color="text.secondary" underline="hover" variant="body2">{tn(key)}</MuiLink>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

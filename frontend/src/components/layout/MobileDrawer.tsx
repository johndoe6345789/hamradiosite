'use client';

import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { Link } from '@/i18n/navigation';
import { NAV_ITEMS } from '@/hooks/useHeader';

interface MobileDrawerProps {
  isAdmin: boolean;
  isAuthenticated: boolean;
  t: (key: string) => string;
  tc: (key: string) => string;
  onClose: () => void;
  onLogout: () => void;
}

const NavItem = ({ href, label }: { href: string; label: string }) => (
  <ListItem disablePadding>
    <ListItemButton component={Link} href={href} sx={{ textAlign: 'center' }}><ListItemText primary={label} /></ListItemButton>
  </ListItem>
);

export default function MobileDrawer({ isAdmin, isAuthenticated, t, tc, onClose, onLogout }: MobileDrawerProps) {
  return (
    <Box onClick={onClose} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2, fontWeight: 700 }}>HamPrep</Typography>
      <Divider />
      <List>
        {NAV_ITEMS.map(({ labelKey, href }) => <NavItem key={labelKey} href={href} label={t(labelKey)} />)}
        {isAdmin && <NavItem href="/admin" label="Admin" />}
        <Divider sx={{ my: 1 }} />
        {isAuthenticated ? (
          <ListItem disablePadding>
            <ListItemButton onClick={onLogout} sx={{ textAlign: 'center' }}><ListItemText primary={tc('logout')} /></ListItemButton>
          </ListItem>
        ) : (
          <>
            <NavItem href="/login" label={tc('login')} />
            <NavItem href="/register" label={tc('register')} />
          </>
        )}
      </List>
    </Box>
  );
}

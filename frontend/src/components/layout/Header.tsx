'use client';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import RadioIcon from '@mui/icons-material/Radio';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { Link } from '@/i18n/navigation';
import useHeader, { NAV_ITEMS } from '@/hooks/useHeader';
import ThemeToggle from './ThemeToggle';
import LanguageSwitcher from '../common/LanguageSwitcher';
import MobileDrawer from './MobileDrawer';

export default function Header() {
  const h = useHeader();

  return (
    <>
      <AppBar position="sticky" color="default" elevation={0}>
        <Toolbar>
          <IconButton color="inherit" aria-label="open menu" edge="start" onClick={h.handleDrawerToggle} sx={{ mr: 2, display: { md: 'none' } }}><MenuIcon /></IconButton>
          <Box component={Link} href="/" sx={{ display: 'flex', alignItems: 'center', gap: 1, textDecoration: 'none', color: 'inherit', flexGrow: { xs: 1, md: 0 }, mr: { md: 4 } }}>
            <RadioIcon color="primary" />
            <Typography variant="h6" component="span" fontWeight={700} noWrap>HamPrep</Typography>
          </Box>
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, flexGrow: 1 }}>
            {NAV_ITEMS.map(({ labelKey, href }) => <Button key={labelKey} component={Link} href={href} color="inherit">{h.t(labelKey)}</Button>)}
            {h.isAdmin && <Button component={Link} href="/admin" color="inherit" startIcon={<AdminPanelSettingsIcon />}>Admin</Button>}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ThemeToggle />
            <LanguageSwitcher />
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
              {h.isAuthenticated
                ? <Button color="inherit" onClick={h.handleLogout}>{h.tc('logout')}</Button>
                : <><Button component={Link} href="/login" color="inherit">{h.tc('login')}</Button><Button component={Link} href="/register" variant="contained" size="small">{h.tc('register')}</Button></>}
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer variant="temporary" open={h.mobileOpen} onClose={h.handleDrawerToggle} ModalProps={{ keepMounted: true }} sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280 } }}>
        <MobileDrawer isAdmin={h.isAdmin} isAuthenticated={h.isAuthenticated} t={h.t} tc={h.tc} onClose={h.handleDrawerToggle} onLogout={h.handleLogout} />
      </Drawer>
    </>
  );
}

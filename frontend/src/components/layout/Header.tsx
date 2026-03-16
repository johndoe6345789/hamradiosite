'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import RadioIcon from '@mui/icons-material/Radio';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { logoutUser } from '@/store/slices/authSlice';
import { Link, useRouter } from '@/i18n/navigation';
import ThemeToggle from './ThemeToggle';
import LanguageSwitcher from '../common/LanguageSwitcher';

const NAV_ITEMS = [
  { labelKey: 'learn' as const, href: '/learn' },
  { labelKey: 'quiz' as const, href: '/quiz' },
  { labelKey: 'progress' as const, href: '/progress' },
  { labelKey: 'about' as const, href: '/about' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const t = useTranslations('nav');
  const tc = useTranslations('common');
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    router.push('/');
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2, fontWeight: 700 }}>
        HamPrep
      </Typography>
      <Divider />
      <List>
        {NAV_ITEMS.map(({ labelKey, href }) => (
          <ListItem key={labelKey} disablePadding>
            <ListItemButton component={Link} href={href} sx={{ textAlign: 'center' }}>
              <ListItemText primary={t(labelKey)} />
            </ListItemButton>
          </ListItem>
        ))}
        {user?.role === 'admin' && (
          <ListItem disablePadding>
            <ListItemButton component={Link} href="/admin" sx={{ textAlign: 'center' }}>
              <ListItemText primary="Admin" />
            </ListItemButton>
          </ListItem>
        )}
        <Divider sx={{ my: 1 }} />
        {isAuthenticated ? (
          <ListItem disablePadding>
            <ListItemButton onClick={handleLogout} sx={{ textAlign: 'center' }}>
              <ListItemText primary={tc('logout')} />
            </ListItemButton>
          </ListItem>
        ) : (
          <>
            <ListItem disablePadding>
              <ListItemButton component={Link} href="/login" sx={{ textAlign: 'center' }}>
                <ListItemText primary={tc('login')} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} href="/register" sx={{ textAlign: 'center' }}>
                <ListItemText primary={tc('register')} />
              </ListItemButton>
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="sticky" color="default" elevation={0}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open menu"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Box
            component={Link}
            href="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              textDecoration: 'none',
              color: 'inherit',
              flexGrow: { xs: 1, md: 0 },
              mr: { md: 4 },
            }}
          >
            <RadioIcon color="primary" />
            <Typography variant="h6" component="span" fontWeight={700} noWrap>
              HamPrep
            </Typography>
          </Box>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, flexGrow: 1 }}>
            {NAV_ITEMS.map(({ labelKey, href }) => (
              <Button
                key={labelKey}
                component={Link}
                href={href}
                color="inherit"
              >
                {t(labelKey)}
              </Button>
            ))}
            {user?.role === 'admin' && (
              <Button
                component={Link}
                href="/admin"
                color="inherit"
                startIcon={<AdminPanelSettingsIcon />}
              >
                Admin
              </Button>
            )}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ThemeToggle />
            <LanguageSwitcher />
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
              {isAuthenticated ? (
                <Button color="inherit" onClick={handleLogout}>
                  {tc('logout')}
                </Button>
              ) : (
                <>
                  <Button component={Link} href="/login" color="inherit">
                    {tc('login')}
                  </Button>
                  <Button component={Link} href="/register" variant="contained" size="small">
                    {tc('register')}
                  </Button>
                </>
              )}
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280 },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
}

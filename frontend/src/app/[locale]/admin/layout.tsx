'use client';

import { useEffect } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import QuizIcon from '@mui/icons-material/Quiz';
import TopicIcon from '@mui/icons-material/Category';
import TranslateIcon from '@mui/icons-material/Translate';
import { useAppSelector } from '@/store/hooks';
import { Link, useRouter } from '@/i18n/navigation';

const DRAWER_WIDTH = 240;

const ADMIN_NAV = [
  { label: 'Dashboard', href: '/admin', icon: <DashboardIcon /> },
  { label: 'Users', href: '/admin/users', icon: <PeopleIcon /> },
  { label: 'Questions', href: '/admin/questions', icon: <QuizIcon /> },
  { label: 'Topics', href: '/admin/topics', icon: <TopicIcon /> },
  { label: 'Translations', href: '/admin/translations', icon: <TranslateIcon /> },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/');
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            position: 'relative',
          },
        }}
      >
        <Toolbar>
          <Typography variant="h6" fontWeight={700} noWrap>
            Admin Panel
          </Typography>
        </Toolbar>
        <Divider />
        <List>
          {ADMIN_NAV.map(({ label, href, icon }) => (
            <ListItem key={label} disablePadding>
              <ListItemButton component={Link} href={href}>
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3, minHeight: '80vh' }}>
        {children}
      </Box>
    </Box>
  );
}

'use client';

import { useEffect } from 'react';
import Box from '@mui/material/Box';
import { useAppSelector } from '@/store/hooks';
import { useRouter } from '@/i18n/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') router.push('/');
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || user?.role !== 'admin') return null;

  return (
    <Box sx={{ display: 'flex' }}>
      <AdminSidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3, minHeight: '80vh' }}>
        {children}
      </Box>
    </Box>
  );
}

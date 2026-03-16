import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { logoutUser } from '@/store/slices/authSlice';
import { useRouter } from '@/i18n/navigation';

export const NAV_ITEMS = [
  { labelKey: 'learn' as const, href: '/learn' },
  { labelKey: 'quiz' as const, href: '/quiz' },
  { labelKey: 'progress' as const, href: '/progress' },
  { labelKey: 'about' as const, href: '/about' },
  { labelKey: 'bookmarks' as const, href: '/bookmarks' },
];

export default function useHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const t = useTranslations('nav');
  const tc = useTranslations('common');
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const handleLogout = () => {
    dispatch(logoutUser());
    router.push('/');
  };

  const isAdmin = user?.role === 'admin';

  return { mobileOpen, t, tc, isAuthenticated, isAdmin, handleDrawerToggle, handleLogout };
}

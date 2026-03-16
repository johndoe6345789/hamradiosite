import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';

export const LOCALES = [
  { code: 'en', label: 'English' },
  { code: 'cy', label: 'Cymraeg' },
  { code: 'gd', label: 'G\u00e0idhlig' },
  { code: 'ga', label: 'Gaeilge' },
  { code: 'kw', label: 'Kernewek' },
  { code: 'pirate', label: 'Pirate \u2620\ufe0f' },
] as const;

export default function useLanguageSwitcher() {
  const t = useTranslations('language');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleLocaleChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale as (typeof LOCALES)[number]['code'] });
    handleClose();
  };

  return { t, locale, anchorEl, handleOpen, handleClose, handleLocaleChange };
}

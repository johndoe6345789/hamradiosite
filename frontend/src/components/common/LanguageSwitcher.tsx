'use client';

import { useLocale, useTranslations } from 'next-intl';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import LanguageIcon from '@mui/icons-material/Language';
import { useState } from 'react';
import { useRouter, usePathname } from '@/i18n/navigation';

const LOCALES = [
  { code: 'en', label: 'English' },
  { code: 'cy', label: 'Cymraeg' },
] as const;

export default function LanguageSwitcher() {
  const t = useTranslations('language');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLocaleChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale as 'en' | 'cy' });
    handleClose();
  };

  return (
    <>
      <Tooltip title={t('switchTo')}>
        <IconButton
          onClick={handleOpen}
          color="inherit"
          aria-label={t('switchTo')}
        >
          <LanguageIcon />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {LOCALES.map(({ code, label }) => (
          <MenuItem
            key={code}
            onClick={() => handleLocaleChange(code)}
            selected={locale === code}
          >
            <Typography variant="body2">{label}</Typography>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

'use client';

import { useTranslations } from 'next-intl';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleTheme } from '@/store/slices/themeSlice';

export default function ThemeToggle() {
  const t = useTranslations('theme');
  const dispatch = useAppDispatch();
  const mode = useAppSelector((state) => state.theme.mode);

  const label = mode === 'light' ? t('toggleDark') : t('toggleLight');

  return (
    <Tooltip title={label}>
      <IconButton
        onClick={() => dispatch(toggleTheme())}
        color="inherit"
        aria-label={label}
      >
        {mode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
      </IconButton>
    </Tooltip>
  );
}

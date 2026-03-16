'use client';

import React, { useMemo } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { useAppSelector } from '@/store/hooks';
import { getTheme } from './theme';

const cache = createCache({ key: 'mui', prepend: true });

export default function ThemeRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  const mode = useAppSelector((state) => state.theme.mode);
  const theme = useMemo(() => getTheme(mode), [mode]);

  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
}

'use client';

import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import LanguageIcon from '@mui/icons-material/Language';
import useLanguageSwitcher, { LOCALES } from '@/hooks/useLanguageSwitcher';

export default function LanguageSwitcher() {
  const { t, locale, anchorEl, handleOpen, handleClose, handleLocaleChange } = useLanguageSwitcher();

  return (
    <>
      <Tooltip title={t('switchTo')}>
        <IconButton onClick={handleOpen} color="inherit" aria-label={t('switchTo')}>
          <LanguageIcon />
        </IconButton>
      </Tooltip>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} transformOrigin={{ vertical: 'top', horizontal: 'right' }}>
        {LOCALES.map(({ code, label }) => (
          <MenuItem key={code} onClick={() => handleLocaleChange(code)} selected={locale === code}>
            <Typography variant="body2">{label}</Typography>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

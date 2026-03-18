'use client';

import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import MuiLink from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

interface GlossaryTooltipProps {
  term: string;
  definition: string;
  detail?: string;
  url?: string;
  children: string;
}

export default function GlossaryTooltip({ term, definition, detail, url, children }: GlossaryTooltipProps) {
  return (
    <Tooltip
      title={
        <Box sx={{ maxWidth: 380, p: 0.5 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.9rem', mb: 0.5 }}>
            {term}
          </Typography>
          <Typography variant="body2" sx={{ lineHeight: 1.5, mb: detail ? 0.75 : 0 }}>
            {definition}
          </Typography>
          {detail && (
            <Typography variant="body2" sx={{ lineHeight: 1.5, opacity: 0.9 }}>
              {detail}
            </Typography>
          )}
          {url && (
            <MuiLink
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.5,
                mt: 0.75,
                fontSize: '0.75rem',
                color: 'info.light',
              }}
            >
              Read more <OpenInNewIcon sx={{ fontSize: '0.75rem' }} />
            </MuiLink>
          )}
        </Box>
      }
      arrow
      enterTouchDelay={0}
      slotProps={{
        tooltip: {
          sx: {
            bgcolor: 'grey.900',
            maxWidth: 400,
            p: 1.5,
            '& .MuiTooltip-arrow': { color: 'grey.900' },
          },
        },
      }}
    >
      <Box
        component="span"
        sx={{
          borderBottom: '1px dotted',
          borderColor: 'primary.main',
          cursor: 'help',
        }}
      >
        {children}
      </Box>
    </Tooltip>
  );
}

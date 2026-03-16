'use client';

import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

interface ContentRendererProps {
  content: string;
}

export default function ContentRenderer({ content }: ContentRendererProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        '& h2': {
          ...theme.typography.h4,
          fontWeight: 600,
          mt: 4,
          mb: 2,
          color: 'text.primary',
        },
        '& h3': {
          ...theme.typography.h5,
          fontWeight: 600,
          mt: 3,
          mb: 1.5,
          color: 'text.primary',
        },
        '& h4': {
          ...theme.typography.h6,
          fontWeight: 600,
          mt: 2.5,
          mb: 1,
          color: 'text.primary',
        },
        '& p': {
          ...theme.typography.body1,
          mb: 2,
          lineHeight: 1.8,
          color: 'text.primary',
        },
        '& ul, & ol': {
          pl: 3,
          mb: 2,
        },
        '& li': {
          ...theme.typography.body1,
          mb: 0.5,
          lineHeight: 1.8,
          color: 'text.primary',
        },
        '& strong': {
          fontWeight: 600,
        },
        '& table': {
          width: '100%',
          borderCollapse: 'collapse',
          mb: 2,
          '& th, & td': {
            border: `1px solid ${theme.palette.divider}`,
            p: 1.5,
            textAlign: 'left',
            ...theme.typography.body2,
          },
          '& th': {
            bgcolor: 'action.hover',
            fontWeight: 600,
          },
        },
        '& blockquote': {
          borderLeft: `4px solid ${theme.palette.primary.main}`,
          pl: 2,
          py: 1,
          ml: 0,
          bgcolor: 'action.hover',
          borderRadius: 1,
          mb: 2,
        },
        '& code': {
          bgcolor: 'action.hover',
          px: 0.5,
          py: 0.25,
          borderRadius: 0.5,
          fontFamily: 'monospace',
          fontSize: '0.875em',
        },
        '& a': {
          color: 'primary.main',
          textDecoration: 'underline',
          '&:hover': {
            color: 'primary.dark',
          },
        },
      }}
      dangerouslySetInnerHTML={{ __html: content }}
      data-testid="content-renderer"
    />
  );
}

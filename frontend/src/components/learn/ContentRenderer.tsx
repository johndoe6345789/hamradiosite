'use client';

import Box from '@mui/material/Box';
import useContentStyles from '@/hooks/useContentStyles';

interface ContentRendererProps {
  content: string;
}

export default function ContentRenderer({ content }: ContentRendererProps) {
  const sx = useContentStyles();

  return (
    <Box
      sx={sx}
      dangerouslySetInnerHTML={{ __html: content }}
      data-testid="content-renderer"
    />
  );
}

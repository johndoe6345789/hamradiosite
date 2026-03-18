'use client';

import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';

interface GlossaryTooltipProps {
  term: string;
  definition: string;
  children: string;
}

export default function GlossaryTooltip({ term, definition, children }: GlossaryTooltipProps) {
  return (
    <Tooltip
      title={
        <Box>
          <Box component="span" sx={{ fontWeight: 700 }}>{term}</Box>
          <Box component="span"> — {definition}</Box>
        </Box>
      }
      arrow
      enterTouchDelay={0}
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

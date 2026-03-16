'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

type TranslationData = Record<string, unknown>;

interface JsonEditorProps {
  data: TranslationData;
  path: string;
  onChange: (path: string, value: string) => void;
}

export default function JsonEditor({ data, path, onChange }: JsonEditorProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  return (
    <Box sx={{ pl: path ? 2 : 0 }}>
      {Object.entries(data).map(([key, value]) => {
        const fullPath = path ? `${path}.${key}` : key;

        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          const isExpanded = expanded[key] ?? true;
          return (
            <Box key={key} sx={{ mb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', py: 0.5, '&:hover': { bgcolor: 'action.hover' }, borderRadius: 1 }} onClick={() => setExpanded((p) => ({ ...p, [key]: !p[key] }))}>
                <IconButton size="small">{isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}</IconButton>
                <Typography variant="subtitle2" fontWeight={600} color="primary">{key}</Typography>
              </Box>
              <Collapse in={isExpanded}>
                <JsonEditor data={value as TranslationData} path={fullPath} onChange={onChange} />
              </Collapse>
            </Box>
          );
        }

        return (
          <Box key={key} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, pl: 4 }}>
            <Typography variant="body2" sx={{ minWidth: 180, fontFamily: 'monospace', color: 'text.secondary' }}>{key}:</Typography>
            <TextField size="small" fullWidth value={String(value ?? '')} onChange={(e) => onChange(fullPath, e.target.value)} />
          </Box>
        );
      })}
    </Box>
  );
}

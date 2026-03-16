'use client';

import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Link from '@mui/material/Link';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

interface ResourceLinkProps {
  href: string;
  label: string;
}

export default function ResourceLink({ href, label }: ResourceLinkProps) {
  return (
    <ListItem>
      <ListItemIcon><OpenInNewIcon color="primary" /></ListItemIcon>
      <ListItemText primary={<Link href={href} target="_blank" rel="noopener noreferrer">{label}</Link>} />
    </ListItem>
  );
}

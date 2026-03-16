'use client';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import type { SvgIconComponent } from '@mui/icons-material';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: SvgIconComponent;
}

export default function StatCard({ label, value, icon: Icon }: StatCardProps) {
  return (
    <Card>
      <CardContent sx={{ textAlign: 'center', py: 3 }}>
        <Icon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
        <Typography variant="h4" fontWeight={700}>{value}</Typography>
        <Typography variant="body2" color="text.secondary">{label}</Typography>
      </CardContent>
    </Card>
  );
}

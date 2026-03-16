'use client';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import type { SvgIconComponent } from '@mui/icons-material';

interface FeatureCardProps {
  icon: SvgIconComponent;
  title: string;
  description: string;
}

export default function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <Card sx={{ height: '100%', textAlign: 'center', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
      <CardContent sx={{ p: 4 }}>
        <Icon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
        <Typography variant="h6" component="h3" gutterBottom fontWeight={600}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
}

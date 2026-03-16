'use client';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

interface ExamFormatCardProps {
  title: string;
  items: string[];
}

export default function ExamFormatCard({ title, items }: ExamFormatCardProps) {
  return (
    <Card sx={{ mb: 5 }}>
      <CardContent>
        <Typography variant="h5" component="h2" fontWeight={600} gutterBottom>{title}</Typography>
        <List>
          {items.map((item) => (
            <ListItem key={item}>
              <ListItemIcon><CheckCircleOutlineIcon color="primary" /></ListItemIcon>
              <ListItemText primary={item} />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}

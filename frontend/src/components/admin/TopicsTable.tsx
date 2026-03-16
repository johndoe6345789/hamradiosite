'use client';

import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import type { TopicWithContent } from '@/types/topic';

interface TopicsTableProps {
  topics: TopicWithContent[];
  onEdit: (topic: TopicWithContent) => void;
  onDelete: (topic: TopicWithContent) => void;
}

export default function TopicsTable({ topics, onEdit, onDelete }: TopicsTableProps) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Slug</TableCell>
            <TableCell>Order</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {topics.map((topic) => (
            <TableRow key={topic.id}>
              <TableCell>{topic.title}</TableCell>
              <TableCell>{topic.slug}</TableCell>
              <TableCell>{topic.order}</TableCell>
              <TableCell align="right">
                <IconButton color="primary" onClick={() => onEdit(topic)}><EditIcon /></IconButton>
                <IconButton color="error" onClick={() => onDelete(topic)}><DeleteIcon /></IconButton>
              </TableCell>
            </TableRow>
          ))}
          {topics.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} align="center"><Typography color="text.secondary" sx={{ py: 4 }}>No topics found</Typography></TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

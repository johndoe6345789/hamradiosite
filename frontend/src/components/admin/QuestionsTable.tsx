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
import type { QuizQuestion } from '@/types/quiz';

interface QuestionsTableProps {
  questions: QuizQuestion[];
  onEdit: (question: QuizQuestion) => void;
  onDelete: (question: QuizQuestion) => void;
}

export default function QuestionsTable({ questions, onEdit, onDelete }: QuestionsTableProps) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Question</TableCell>
            <TableCell>Topic</TableCell>
            <TableCell>Correct Answer</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {questions.map((q) => (
            <TableRow key={q.id}>
              <TableCell sx={{ maxWidth: 400 }}><Typography noWrap>{q.text}</Typography></TableCell>
              <TableCell>{q.topic_slug}</TableCell>
              <TableCell>{q.options.find((o) => o.id === q.correct_option_id)?.text || q.correct_option_id}</TableCell>
              <TableCell align="right">
                <IconButton color="primary" onClick={() => onEdit(q)}><EditIcon /></IconButton>
                <IconButton color="error" onClick={() => onDelete(q)}><DeleteIcon /></IconButton>
              </TableCell>
            </TableRow>
          ))}
          {questions.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} align="center"><Typography color="text.secondary" sx={{ py: 4 }}>No questions found</Typography></TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

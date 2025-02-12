import Divider from "@mui/material/Divider";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Card,
  Box,
  Typography,
  IconButton,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  Tooltip,
} from '@mui/material';

type Answer = {
  text: string;
  correct: boolean;
};

type QuestionViewCardProps = {
  index: number;
  question: string;
  answers: Answer[];
  onEdit: () => void;
  onDelete: () => void;
};

export function QuestionViewCard({ index, question, answers, onEdit, onDelete }: QuestionViewCardProps) {
  return (
    <Card sx={{ borderRadius: '15px', padding: '20px 20px 10px 20px', marginTop: 2 }}>
      <Typography variant="h6" sx={{ my: 1 }}>{index + 1}. {question}</Typography>
      <List>
        {answers.map((answer, idx) => (
          <ListItem key={idx} sx={{ p: 0 }}>
            <ListItemText primary={answer.text} />
            <Checkbox checked={answer.correct} disabled />
          </ListItem>
        ))}
      </List>
      <Divider />
      <Box sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center' }}>
        <Tooltip title="Edit question" arrow>
          <IconButton onClick={onEdit}>
            <EditIcon fontSize='small' />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete question" arrow>
          <IconButton onClick={onDelete}>
            <DeleteIcon fontSize='small' />
          </IconButton>
        </Tooltip>
      </Box>
    </Card>
  );
}

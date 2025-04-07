import type { Question } from "src/types/quiz";

import Divider from "@mui/material/Divider";
import EditIcon from '@mui/icons-material/Edit';
import {
  Box,
  Card,
  List,
  Radio,
  Tooltip,
  Checkbox,
  ListItem,
  Typography,
  IconButton,
  ListItemText,
  CircularProgress
} from '@mui/material';

import { useTranslate } from "src/locales";
import { useDeleteQuestion } from "src/actions/quiz";

import { Iconify } from "src/components/iconify";

import type { Operation } from "../../../types/operation";

type QuestionViewCardProps = {
  index: number;
  question: Question;
  onEdit: () => void;
  editorProps:{
    quizOperation: Operation;
    questions: Question[];
    setQuestions: (questions: Question[]) => void;
  };
};

export function QuestionViewCard({ index, question, onEdit, editorProps }: QuestionViewCardProps) {
  const { t } = useTranslate();
  const { deleteQuestion, isDeleting } = useDeleteQuestion(editorProps);

  const renderChoiceBased = () => (
    <List>
      {question.answers.map((answer, idx) => (
        <ListItem key={idx} sx={{ p: 0 }}>
          {
            question.type === 'single-choice' &&
            <Radio checked={answer.isCorrect} disabled />
          }
          {
            question.type === 'multiple-choice' &&
            <Checkbox checked={answer.isCorrect} disabled />
          }
          <ListItemText sx={{ ml: 1 }} primary={`${String.fromCharCode(97 + idx)}) ${answer.text}`} />
        </ListItem>
      ))}
    </List>
  );

  const renderTrueFalse = () => (
    <List>
      <ListItem sx={{ p: 0 }}>
        <Radio checked={question.answers[0].isCorrect} disabled />
        <ListItemText sx={{ ml: 1 }} primary={t('true')} />
      </ListItem>
      <ListItem sx={{ p: 0 }}>
        <Radio checked={!question.answers[0].isCorrect} disabled />
        <ListItemText sx={{ ml: 1 }} primary={t('false')} />
      </ListItem>
    </List>
  );

  const renderShortAnswer = () => (
    <List>
      <ListItem sx={{ p: 0 }}>
        <Checkbox
          indeterminate
          defaultChecked
          disabled
        />
        <Typography variant="body1" sx={{ fontWeight: 'bold', opacity: 0.7 }}>{`${t('answer')} :`}</Typography>
        <ListItemText sx={{ ml: 1 }} primary={question.answers[0].text} />
      </ListItem>
    </List>
  );


  return (
    <Card sx={{ borderRadius: '10px', padding: '20px 20px 10px 20px', marginTop: 2 }}>
      <Typography variant="h6" sx={{ my: 1 }}>{index + 1}. {question.text}</Typography>
      {
        question.type === 'true-false' &&
        renderTrueFalse()
      }
      {
        (question.type === 'single-choice' || question.type === 'multiple-choice') &&
        renderChoiceBased()
      }
      {
        question.type === 'short-answer' &&
        renderShortAnswer()
      }
      <Divider />
      <Box sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center' }}>
        <Tooltip title="Edit question" arrow>
          <IconButton onClick={onEdit}>
            <EditIcon fontSize='small' />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete question" arrow>
          <IconButton onClick={() => deleteQuestion(index)} disabled={isDeleting}>
            {
              isDeleting ?
                <CircularProgress size={20}/>
                :
                <Iconify width={20} icon="solar:trash-bin-trash-bold" />
            }
          </IconButton>
        </Tooltip>
      </Box>
    </Card>
  );
}

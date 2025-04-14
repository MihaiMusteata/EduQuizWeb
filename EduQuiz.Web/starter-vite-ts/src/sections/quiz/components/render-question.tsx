import type { Question, AnswerGiven } from "src/types/quiz";

import { List, Radio, Checkbox, ListItem, TextField, Typography, ListItemText } from "@mui/material";

import { useTranslate } from "src/locales";

import { ListItemHover } from "src/components/List";

type Props = {
  question: Question;
  answersGiven: AnswerGiven[];
  setAnswersGiven: React.Dispatch<React.SetStateAction<AnswerGiven[]>>;
  submitted: boolean;
}

export function RenderQuestion({ question, answersGiven, setAnswersGiven, submitted }: Props) {
  const { t } = useTranslate();
  const handleAnswerSelect = (questionId: string, selectedId: string, isMultipleChoice: boolean) => {

    setAnswersGiven((prev) => {
      const existingAnswer = prev.find((a) => a.questionId === questionId);

      if (isMultipleChoice) {
        if (existingAnswer) {
          const selectedIds = existingAnswer.selectedIds || [];
          const isAlreadySelected = selectedIds.includes(selectedId);
          const updatedSelectedIds = isAlreadySelected
            ? selectedIds.filter((id) => id !== selectedId)
            : [...selectedIds, selectedId];

          return prev.map((a) =>
            a.questionId === questionId
              ? { ...a, selectedIds: updatedSelectedIds }
              : a
          );
        } else {
          return [...prev, { questionId, selectedIds: [selectedId] }];
        }
      } else {
        return prev
          .filter((a) => a.questionId !== questionId)
          .concat({ questionId, userAnswer: selectedId });
      }
    });
  };

  const getSelectedIds = (questionId: string) =>
    answersGiven.find(a => a.questionId === questionId)?.selectedIds ?? [];

  const isChecked = (questionId: string, answerId: string) => {
    const answer = answersGiven.find(a => a.questionId === questionId);
    if (!answer) return false;
    return answer.selectedIds?.includes(answerId) || answer.userAnswer === answerId;
  };


  switch (question.type) {
    case 'single-choice':
      return (
        <List>
          {question.answers.map((answer, idx) => (
            <ListItemHover key={idx} onClick={() => handleAnswerSelect(question.id!, answer.id!, true)}>
              <ListItemText sx={{ ml: 1 }} primary={`${String.fromCharCode(97 + idx)}) ${answer.text}`} />
              <Radio
                checked={isChecked(question.id!, answer.id!)}
                disabled={submitted}
                sx={{
                  '&.Mui-checked': {
                    color: submitted
                      ? answer.isCorrect
                        ? 'success.main'
                        : 'error.main'
                      : 'default',
                  },
                }}
              />
            </ListItemHover>
          ))}
        </List>
      );

    case 'multiple-choice':
      return (
        <List>
          {question.answers.map((answer, idx) => (
            <ListItemHover key={idx} onClick={() => handleAnswerSelect(question.id!, answer.id!, true)}>
              <ListItemText sx={{ ml: 1 }} primary={`${String.fromCharCode(97 + idx)}) ${answer.text}`} />
              <Checkbox
                checked={isChecked(question.id!, answer.id!)}
                disabled={submitted}
                sx={{
                  '&.Mui-checked': {
                    color: submitted
                      ? answer.isCorrect
                        ? 'success.main'
                        : 'error.main'
                      : 'default',
                  },
                }}
              />
            </ListItemHover>
          ))}
        </List>
      );

    case 'true-false':
      return (
        <List>
          <ListItemHover onClick={() => handleAnswerSelect(question.id!, 'true', false)}>
            <ListItemText sx={{ ml: 1 }} primary={t('true')} />
            <Radio
              checked={answersGiven.some(a => a.questionId === question.id && a.userAnswer === 'true')}
              disabled={submitted}
              sx={{
                '&.Mui-checked': {
                  color: submitted ? answersGiven.some(a => a.questionId === question.id && a.userAnswer === 'true') && question.answers[0].isCorrect ? 'success.main' : 'error.main'
                    : 'default',
                },
              }}
            />
          </ListItemHover>
          <ListItemHover onClick={() => handleAnswerSelect(question.id!, 'false', false)}>
            <ListItemText sx={{ ml: 1 }} primary={t('false')} />
            <Radio
              checked={answersGiven.some(a => a.questionId === question.id && a.userAnswer === 'false')}
              disabled={submitted}
              sx={{
                '&.Mui-checked': {
                  color: submitted ? answersGiven.some(a => a.questionId === question.id && a.userAnswer === 'true') && !question.answers[0].isCorrect ? 'success.main' : 'error.main'
                    : 'default',
                },
              }}
            />
          </ListItemHover>
        </List>
      );

    case 'short-answer':
      return (
        <List>
          <ListItem sx={{ p: 0 }}>
            <TextField
              fullWidth
              variant="standard"
              onBlur={(e) => {
                const newAnswer = e.target.value;
                setAnswersGiven((prev) => {
                  const existingAnswer = prev.find(a => a.questionId === question.id);
                  if (existingAnswer) {
                    return prev.map(a => a.questionId === question.id ? { ...a, userAnswer: newAnswer } : a);
                  } else {
                    return [...prev, { questionId: question.id!, userAnswer: newAnswer }];
                  }
                });
              }}
              slotProps={{
                input: {
                  startAdornment:
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: "bold",
                        opacity: 0.7,
                        whiteSpace: 'nowrap',
                        flexShrink: 0,
                        mr: '2px',
                        mb: '2px'
                      }}
                    >
                      {`${t('your-answer')} :`}
                    </Typography>,
                },
              }} />
          </ListItem>
        </List>
      );
    default:
      return <Typography variant="body2" color="error">Invalid question type</Typography>;
  }
}

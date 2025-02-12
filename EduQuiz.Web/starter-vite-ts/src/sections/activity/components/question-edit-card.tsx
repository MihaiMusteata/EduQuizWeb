import { useState } from "react";

import { Button, Card, MenuItem, FormControl, InputLabel, Box, Select } from '@mui/material';

import { useTranslate } from "../../../locales";
import { QuestionMultipleChoice } from "./question-multiple-choice";

type Props = {
  onSave: (index: number) => void;
  onCancel: (index: number) => void;
  index: number;
};

export function QuestionEditCard({ onSave, onCancel, index }: Props) {
  const [questionType, setQuestionType] = useState<string | undefined>(undefined);
  const { t: tCommon } = useTranslate('common');
  const { t: tQuiz } = useTranslate('activity');
  return (
    <Card sx={{ border: '1px solid #ddd', borderRadius: '15px', padding: 2, marginTop: 2 }}>
      {
        questionType === undefined &&
        <FormControl fullWidth>
          <InputLabel>{tQuiz('question-type.label')}</InputLabel>
          <Select
            value={questionType}
            label={tQuiz('question-type.label')}
            onChange={(e) => setQuestionType(e.target.value as string)}
            sx={{
              backgroundColor: (theme) => theme.palette.background.default,
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  backgroundColor: (theme) => theme.palette.background.default,
                },
              },
            }}
          >
            <MenuItem value="true/false">{tQuiz('question-type.types.true-false')}</MenuItem>
            <MenuItem value="multiple-choice">{tQuiz('question-type.types.multiple-choice')}</MenuItem>
            <MenuItem value="single-choice">{tQuiz('question-type.types.single-choice')}</MenuItem>
            <MenuItem value="short-answer">{tQuiz('question-type.types.short-answer')}</MenuItem>
          </Select>
        </FormControl>
      }
      {
        questionType === 'multiple-choice' && <QuestionMultipleChoice />
      }
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, marginTop: 2 }}>
        <Button variant="outlined" color="inherit" onClick={() => onCancel(index)}>
          {tCommon('cancel')}
        </Button>
        <Button variant="contained" color="primary" onClick={() => onSave(index)}>
          {tCommon('save')}
        </Button>
      </Box>
    </Card>
  );
};

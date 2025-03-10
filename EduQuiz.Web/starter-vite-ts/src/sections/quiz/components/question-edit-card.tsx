import { useState } from "react";

import { Card, Select, MenuItem, InputLabel, FormControl } from '@mui/material';

import { QuestionForm } from "./question-form";
import { useTranslate } from "../../../locales";

import type { Question, QuestionType } from "../../../types/quiz";

type Props = {
  onSave: (question: Question) => void;
};

export function QuestionEditCard({ onSave }: Props) {
  const [questionType, setQuestionType] = useState<QuestionType| undefined>(undefined);
  const { t } = useTranslate('activity');
  return (
    <Card sx={{ border: '1px solid #ddd', borderRadius: '10px', padding: 2, marginTop: 2 }}>
      {
        questionType === undefined ?
          <FormControl fullWidth>
            <InputLabel>{t('question-type.label')}</InputLabel>
            <Select
              value={questionType}
              label={t('question-type.label')}
              onChange={(e) => setQuestionType(e.target.value as QuestionType)}
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
              <MenuItem value="true/false">{t('question-type.types.true-false')}</MenuItem>
              <MenuItem value="multiple-choice">{t('question-type.types.multiple-choice')}</MenuItem>
              <MenuItem value="single-choice">{t('question-type.types.single-choice')}</MenuItem>
              <MenuItem value="short-answer">{t('question-type.types.short-answer')}</MenuItem>
            </Select>
          </FormControl>
          :
          <QuestionForm onSave={onSave} questionType={questionType} />
      }
    </Card>
  );
};

import type { Question, QuestionType } from 'src/types/quiz';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Box, Button } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

import { useTranslate } from 'src/locales';

import { Form, Field } from 'src/components/hook-form';

import { FieldsSchema } from "../schema";
import { TrueFalseQuestion } from "./true-false-question";
import { ChoiceBasedQuestion } from "./choice-based-question";
import { ShortAnswerQuestion } from "./short-answer-question";

import type { FieldsSchemaType } from "../schema";

type Props = {
  onSave: (question: Question) => void;
  onCancel: () => void;
  questionType: QuestionType;
  initialData?: Question;
  isLoading: boolean;
}

export function QuestionForm({ onSave, onCancel, questionType, initialData, isLoading }: Props) {
  const { t } = useTranslate();
  const [totalAnswers, setTotalAnswers] = useState(
    questionType === 'multiple-choice' || questionType === 'single-choice'
      ? initialData?.answers.length || 4
      : 1
  );
  const [updateAnswers, setUpdateAnswers] = useState(false);

  const methods = useForm<FieldsSchemaType>({
    resolver: zodResolver(FieldsSchema),
    defaultValues: {
      question: {
        id: initialData?.id,
        type: questionType,
        text: initialData?.text || '',
        answers: initialData?.answers || (
          questionType === 'multiple-choice' || questionType === 'single-choice'
            ? [
              { text: '', isCorrect: false },
              { text: '', isCorrect: false },
              { text: '', isCorrect: false },
              { text: '', isCorrect: false },
            ]
            : [{ text: '', isCorrect: true }]
        ),
        hint: initialData?.hint || '',
      },
    },
  });


  const {
    setValue,
    getValues,
    reset,
  } = methods;

  const handleSave = () => {
    const data = getValues();
    onSave(data.question);
  }

  const handleCancel = () => {
    reset();
    onCancel();
  }

  return (
    <Form methods={methods}>
      <Field.Text
        label={t('question')}
        multiline rows={3}
        name='question.text'
        sx={{
          marginBottom: 4,
          '& .MuiInputBase-root': {
            backgroundColor: (theme) => theme.palette.background.default,
          }
        }}
      />
      {
        (questionType === 'multiple-choice' || questionType === 'single-choice') &&
        <ChoiceBasedQuestion
          totalAnswers={totalAnswers}
          setTotalAnswers={setTotalAnswers}
          updateAnswers={updateAnswers}
          setUpdateAnswers={setUpdateAnswers}
          setValue={setValue}
          getValues={getValues}
          questionType={questionType}
          t={t}
        />
      }
      {
        questionType === 'true-false' &&
        <TrueFalseQuestion
          updateAnswers={updateAnswers}
          setUpdateAnswers={setUpdateAnswers}
          setValue={setValue}
          getValues={getValues}
          t={t}
        />
      }
      {
        questionType === 'short-answer' &&
        <ShortAnswerQuestion t={t} />
      }

      <Field.Text
        label={t('answer-hint')}
        multiline rows={2}
        fullWidth margin='normal'
        name='question.hint'
        helperText={t('hint-caption')}
        sx={{
          '& .MuiInputBase-root': {
            backgroundColor: (theme) => theme.palette.background.default,
          }
        }} />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, marginTop: 2 }}>
        <Button variant='outlined' color='inherit' onClick={handleCancel}>
          {t('cancel')}
        </Button>
        <LoadingButton
          variant='contained'
          color='primary'
          onClick={handleSave}
          loading={isLoading}
        >
          {t('save')}
        </LoadingButton>
      </Box>
    </Form>
  );
}

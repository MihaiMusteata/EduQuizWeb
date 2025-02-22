import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button, Box } from '@mui/material';

import { Form, Field } from 'src/components/hook-form';

import { useTranslate } from '../../../locales';
import { TrueFalseQuestion } from "./true-false-question";
import { FieldsSchema, FieldsSchemaType } from "../schema";
import { Question, QuestionType } from '../../../types/quiz';
import { ChoiceBasedQuestion } from "./choice-based-question";
import { ShortAnswerQuestion } from "./short-answer-question";

type Props = {
  onSave: (question: Question) => void;
  questionType: QuestionType;
}

export function QuestionForm({ onSave, questionType }: Props) {
  const { t } = useTranslate('activity');
  const { t: tCommon } = useTranslate('common');
  const [totalAnswers, setTotalAnswers] = useState(questionType === 'multiple-choice' || questionType === 'single-choice' ? 4 : 1);
  const [updateAnswers, setUpdateAnswers] = useState(false);

  const methods = useForm<FieldsSchemaType>({
    resolver: zodResolver(FieldsSchema),
    defaultValues: {
      question: {
        type: questionType,
        answers: questionType === 'multiple-choice' || questionType === 'single-choice' ? [
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
        ] : [
          { text: '', isCorrect: true },
        ],
      }
    }
  });

  const {
    handleSubmit,
    setValue,
    getValues,
    formState: { errors }
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    onSave(data.question);
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
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
        questionType === 'true/false' &&
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
        name='hint'
        helperText={t('hint-caption')}
        sx={{
          '& .MuiInputBase-root': {
            backgroundColor: (theme) => theme.palette.background.default,
          }
        }} />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, marginTop: 2 }}>
        <Button variant='outlined' color='inherit' onClick={() => console.log('cancel')}>
          {tCommon('cancel')}
        </Button>
        <Button variant='contained' color='primary' type='submit'>
          {tCommon('save')}
        </Button>
      </Box>
    </Form>
  );
}

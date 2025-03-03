import { TFunction } from "i18next";
import { UseFormGetValues, UseFormSetValue } from "react-hook-form";

import { TextField, Checkbox, Box, IconButton, Tooltip, Radio } from '@mui/material';

import { Field } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';

import { FieldsSchemaType } from "../schema";
import { Answer, QuestionType } from "../../../types/quiz";

type Props = {
  totalAnswers: number;
  setTotalAnswers: (totalAnswers: number) => void;
  setValue: UseFormSetValue<FieldsSchemaType>;
  getValues: UseFormGetValues<FieldsSchemaType>;
  questionType: QuestionType;
  t: TFunction;
  updateAnswers: boolean;
  setUpdateAnswers: (updateAnswers: boolean) => void;
}

export function ChoiceBasedQuestion({ totalAnswers, setTotalAnswers, setValue, getValues, questionType, t, updateAnswers, setUpdateAnswers }: Props) {
  const handleAddAnswer = () => {
    setTotalAnswers(totalAnswers + 1);
    const newAnswer: Answer = { text: '', isCorrect: false };
    setValue(`question.answers.${totalAnswers}`, newAnswer);
  };

  const handleDeleteAnswer = (index: number) => {
    setTotalAnswers(totalAnswers - 1);
    const answers = getValues('question.answers');
    answers.splice(index, 1);
    answers.forEach((answer, i) => {
      setValue(`question.answers.${i}`, answer);
    });
  };

  const handleRadioChange = (index: number) => {
    const answers = getValues('question.answers');
    answers.forEach((_, i) => {
      setValue(`question.answers.${i}.isCorrect`, i === index);
    });
    setUpdateAnswers(!updateAnswers);
  };

  return (
    <>
      {
        [...Array(totalAnswers)].map((_, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, marginBottom: 2 }}>
            <Field.Text
              name={`question.answers.${index}.text`}
              label={`${t('answer')} ${String.fromCharCode(65 + index)}`}
              fullWidth
              sx={{
                '& .MuiInputBase-root': {
                  backgroundColor: (theme) => theme.palette.background.default,
                }
              }}
            />
            <Tooltip title={t('tool-tip.check-correct-answer')} arrow>
              <div>
                {
                  questionType === 'single-choice' &&
                  <Radio
                    value={index}
                    checked={getValues(`question.answers.${index}.isCorrect`)}
                    onChange={() => handleRadioChange(index)}
                  />
                }
                {
                  questionType === 'multiple-choice' &&
                  <Field.Checkbox
                    name={`question.answers.${index}.isCorrect`}
                    label=''
                  />
                }
              </div>
            </Tooltip>
            <Tooltip title={t('tool-tip.delete-answer')} arrow>
              <IconButton
                onClick={() => handleDeleteAnswer(index)}
                sx={{ padding: '4px' }}
              >
                <Iconify width={24} icon="solar:trash-bin-trash-bold" />
              </IconButton>
            </Tooltip>
          </Box>
        ))
      }

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, marginBottom: 2 }}>
        <TextField
          value={`${t('add-answer')}`}
          variant='outlined'
          fullWidth
          onClick={handleAddAnswer}
          InputProps={{
            readOnly: true,
            style: { fontWeight: 'bold' }
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              cursor: 'pointer',
              '& fieldset': {
                borderStyle: 'dashed',
              },
              '&:hover fieldset': {
                borderColor: 'primary.main',
              },
            },
            '& .MuiInputBase-input': {
              cursor: 'pointer',
            },
          }}
        />

        {
          questionType === 'single-choice' &&
          <Radio disabled />
        }
        {
          questionType === 'multiple-choice' &&
          <Checkbox disabled />
        }
        <IconButton
          disabled
          sx={{ padding: '4px' }}
        >
          <Iconify width={24} icon="solar:trash-bin-trash-bold" />
        </IconButton>
      </Box>
    </>
  );
};

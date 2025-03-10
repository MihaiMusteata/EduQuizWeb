import type { Flashcard } from "src/types/flashcard";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Box, Card, Button } from '@mui/material';

import { useTranslate } from "src/locales";

import { Form, Field } from "src/components/hook-form";

import { FieldsSchema } from "../schema"

import type { FieldsSchemaType } from "../schema";

type Props = {
  onSave: (flashcard: Flashcard) => void;
};

export function FlashcardEditForm({ onSave }: Props) {
  const { t } = useTranslate('activity');
  const { t: tCommon } = useTranslate('common');

  const methods = useForm<FieldsSchemaType>({
    resolver: zodResolver(FieldsSchema),
    defaultValues: {
      flashcard: {
        frontSideText: '',
        backSideText: '',
      }
    }
  });

  const {
    handleSubmit,
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    onSave(data.flashcard);
  });

  return (
    <Card sx={{ border: '1px solid #ddd', borderRadius: '10px', padding: 2, marginTop: 2 }}>
      <Form methods={methods} onSubmit={onSubmit}>
        <Field.Text
          label={t('front-side-text')}
          name='flashcard.frontSideText'
          sx={{
            marginBottom: 2,
            '& .MuiInputBase-root': {
              backgroundColor: (theme) => theme.palette.background.default,
            }
          }}
        />
        <Field.Text
          label={t('back-side-text')}
          name='flashcard.backSideText'
          sx={{
            marginBottom: 4,
            '& .MuiInputBase-root': {
              backgroundColor: (theme) => theme.palette.background.default,
            }
          }}
        />

        <Field.Text
          label={t('answer-hint')}
          multiline rows={2}
          fullWidth margin='normal'
          name='flashcard.hint'
          helperText={t('hint-caption')}
          sx={{
            '& .MuiInputBase-root': {
              backgroundColor: (theme) => theme.palette.background.default,
            }
          }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, marginTop: 2 }}>
          <Button variant='outlined' color='inherit' onClick={() => console.log('cancel')}>
            {tCommon('cancel')}
          </Button>
          <Button variant='contained' color='primary' type='submit'>
            {tCommon('save')}
          </Button>
        </Box>
      </Form>
    </Card>
  );
}

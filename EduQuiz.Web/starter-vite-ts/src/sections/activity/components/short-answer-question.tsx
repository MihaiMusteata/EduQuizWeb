import type { TFunction } from "i18next";

import { Box } from "@mui/material";

import { Field } from "../../../components/hook-form";

type Props = {
  t: TFunction;
}
export function ShortAnswerQuestion ({ t }: Props) {
  return (
    <Box sx={{ marginBottom: 2 }}>
      <Field.Text
        label={t('short-answer-label')}
        name='question.answers.0.text'
        fullWidth
        sx={{
          '& .MuiInputBase-root': {
            backgroundColor: (theme) => theme.palette.background.default,
          }
        }}
      />
    </Box>
  );
}

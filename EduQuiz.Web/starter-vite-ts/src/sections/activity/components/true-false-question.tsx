import type { TFunction } from "i18next";
import type { UseFormSetValue, UseFormGetValues } from "react-hook-form";

import { Box } from "@mui/material";

import { Field } from "../../../components/hook-form";

import type { FieldsSchemaType } from "../schema";

type Props = {
  updateAnswers: boolean;
  setUpdateAnswers: (updateAnswers: boolean) => void;
  setValue: UseFormSetValue<FieldsSchemaType>;
  getValues: UseFormGetValues<FieldsSchemaType>;
  t: TFunction;
}

export function TrueFalseQuestion({ updateAnswers, setUpdateAnswers, setValue, getValues, t }: Props) {
  const handleRadioChange = (value: string) => {
    const isCorrect = value === 'true';
    setValue(`question.answers.${0}.isCorrect`, isCorrect);
    setUpdateAnswers(!updateAnswers);
  };
  return (
    <Box sx={{ marginBottom: 2 }}>
      <Field.RadioGroup
        row
        options={[
          { label: t('true'), value: 'true' },
          { label: t('false'), value: 'false' }
        ]}
        name='question.answers[0].isCorrect'
        value={getValues('question.answers.0.isCorrect') ? 'true' : 'false'}
        onChange={(e) => handleRadioChange(e.target.value)}
      />
    </Box>
  );
}

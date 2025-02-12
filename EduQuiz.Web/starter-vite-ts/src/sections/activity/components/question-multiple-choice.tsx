import { useState } from "react";

import DeleteIcon from "@mui/icons-material/Delete";
import { FormControl, TextField, Checkbox, Button, Box, IconButton, Typography, Tooltip } from "@mui/material";

import { useTranslate } from "../../../locales";

type Answer = {
  text: string;
  correct: boolean;
};

export function QuestionMultipleChoice() {
  const { t } = useTranslate('activity');
  const [answers, setAnswers] = useState<Answer[]>([
    { text: "", correct: false },
    { text: "", correct: false },
    { text: "", correct: false },
    { text: "", correct: false },
  ]);

  const handleAddAnswer = () => {
    setAnswers([...answers, { text: "", correct: false }]);
  };

  const handleDeleteAnswer = (index: number) => {
    setAnswers(answers.filter((_, i) => i !== index));
  };

  const handleAnswerChange = (index: number, key: keyof Answer, value: any) => {
    const newAnswers = [...answers];
    newAnswers[index][key] = value;
    setAnswers(newAnswers);
  };

  return (
    <div>
      <FormControl fullWidth>
        <TextField
          label={t('question')}
          multiline rows={4}
          fullWidth margin="normal"
          sx={{
            marginBottom: 5,
            borderRadius: 1,
            backgroundColor: (theme) => theme.palette.background.default,
          }} />
        {answers.map((answer, index) => (
          <Box key={index} sx={{ display: "flex", alignItems: "center", gap: 1, marginBottom: 1 }}>
            <TextField
              label={`${t('answer')} ${String.fromCharCode(65 + index)}`}
              value={answer.text}
              onChange={(e) => handleAnswerChange(index, "text", e.target.value)}
              fullWidth
              sx={{
                borderRadius: 1,
                backgroundColor: (theme) => theme.palette.background.default,
              }}
            />
            <Tooltip title={t('tool-tip.check-correct-answer')} arrow>
              <Checkbox
                checked={answer.correct}
                onChange={(e) => handleAnswerChange(index, "correct", e.target.checked)}
              />
            </Tooltip>
            <Tooltip title={t('tool-tip.delete-answer')} arrow>
              <IconButton onClick={() => handleDeleteAnswer(index)}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        ))}
        <Button variant="outlined" onClick={handleAddAnswer} sx={{ my: 3 }}>
          {t('add-answer')}
        </Button>

        <TextField
          label={t('answer-hint')}
          multiline rows={4}
          fullWidth margin="normal"
          sx={{
            borderRadius: 1,
            backgroundColor: (theme) => theme.palette.background.default,
          }} />
        <Typography variant="caption" color='text.secondary'>
          {t('hint-caption')}
        </Typography>
      </FormControl>
    </div>
  );
}

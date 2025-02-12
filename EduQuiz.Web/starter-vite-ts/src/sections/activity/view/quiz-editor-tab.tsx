import { useState } from "react";

import AddIcon from '@mui/icons-material/Add';
import { Box, Typography, Container } from '@mui/material';

import { useTranslate } from "../../../locales";
import { HoverCard } from "../../../components/hover-card";
import { QuestionEditCard } from "../components/question-edit-card";
import { QuestionViewCard } from "../components/question-view-card";

export function QuizEditorTab() {
  const { t } = useTranslate('activity');
  const [questions, setQuestions] = useState<any[]>([]);

  const addQuestion = () => {
    setQuestions((prevQuestions) => [...prevQuestions, {}]); // Adaugă un obiect gol pentru fiecare întrebare
  };

  const removeQuestion = (index: number) => {
    setQuestions((prevQuestions) => prevQuestions.filter((_, i) => i !== index)); // Șterge întrebarea de la indexul respectiv
  };

  const saveQuestion = (index: number) => {
    console.log('Saving question at index', index);
  };

  return (
    <Container sx={{ width: '100%' }}>

      <QuestionViewCard
        index={0}
        answers={[
          { text: 'Answer 1', correct: true },
          { text: 'Answer 2', correct: false },
          { text: 'Answer 3', correct: false },
          { text: 'Answer 4', correct: false },
        ]}
        question='This is a sample question'
        onDelete={() => console.log('Delete question')}
        onEdit={() => console.log('Edit question')}
      />

      {questions.map((_, index) => (
        <QuestionEditCard
          key={index}
          index={index}
          onCancel={removeQuestion}
          onSave={saveQuestion}
        />
      ))}

      <HoverCard
        onClick={addQuestion}
        sx={{ p: 2, mt: 3, width: '100%', marginBottom: "40px" }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
            {t('add-another-question')}
          </Typography>
          <AddIcon sx={{ fontSize: 20 }} />
        </Box>
      </HoverCard>
    </Container>
  );
}

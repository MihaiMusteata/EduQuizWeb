import type { Question} from "src/types/quiz";

import { useState } from "react";

import AddIcon from '@mui/icons-material/Add';
import { Button, Tooltip, Container } from '@mui/material';

import { useTranslate } from "src/locales";

import { QuestionEditCard } from "./components/question-edit-card";
import { QuestionViewCard } from "./components/question-view-card";

type Props = {
  questions: Question[];
  setQuestions: (questions: Question[]) => void;
};

export function QuizEditorTab({ questions, setQuestions }: Props) {
  const { t } = useTranslate('activity');
  const [isEditing, setIsEditing] = useState(true);

  const addQuestion = () => {
    setIsEditing(true);
  };

  const removeQuestion = (index: number) => {
  };

  const handleSave = (question: Question) => {
    setIsEditing(false);
    setQuestions([...questions, question]);
  }

  return (
    <Container sx={{ width: '100%' }}>

      {
        questions.map((question, index) => (
          <QuestionViewCard
            key={index}
            index={index}
            question={question}
            onDelete={() => removeQuestion(index)}
            onEdit={() => console.log('Edit question')}
          />
        ))
      }

      {
        isEditing &&
        <QuestionEditCard onSave={handleSave} />
      }

      <div style={{ marginBottom: '70px' }}>
        <Tooltip
          title={t('tool-tip.add-new-question')}
          arrow
          disableHoverListener={!isEditing}
          disableTouchListener={!isEditing}
        >
          <div>
            <Button
              variant='outlined'
              onClick={addQuestion}
              sx={{ p: 2, mt: 3, justifyContent: 'space-between', border: '1px solid #ddd' }}
              endIcon={<AddIcon />}
              disabled={isEditing}
              fullWidth
            >
              {t('add-new-question')}
            </Button>
          </div>
        </Tooltip>
      </div>
    </Container>
  );
}

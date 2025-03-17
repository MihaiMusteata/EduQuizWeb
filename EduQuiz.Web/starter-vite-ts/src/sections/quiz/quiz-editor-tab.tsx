import type { Question } from "src/types/quiz";

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
  const [editingIndex, setEditingIndex] = useState<number | undefined>(undefined)
  const addQuestion = () => {
    setEditingIndex(questions.length);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleSave = (question: Question, index: number | undefined) => {
    if (index !== undefined) {
      const updatedQuestions = [...questions];
      updatedQuestions[index] = question;
      setQuestions(updatedQuestions);
    } else {
      setQuestions([...questions, question]);
    }
    setEditingIndex(undefined);
  }

  const handleCancel = () => {
    setEditingIndex(undefined);
  }

  return (
    <Container sx={{ width: '100%' }}>
      {
        questions.map((question, index) => (
          editingIndex === index ? (
            <QuestionEditCard key={index} onSave={(q) => handleSave(q, index)} onCancel={handleCancel} initialData={question} />
          ) : (
            <QuestionViewCard
              key={index}
              index={index}
              question={question}
              onDelete={() => removeQuestion(index)}
              onEdit={() => setEditingIndex(index)}
            />
          )
        ))
      }

      {
        editingIndex === questions.length && (
          <QuestionEditCard onSave={(q) => handleSave(q, undefined)} onCancel={handleCancel}/>
        )}

      <div style={{ marginBottom: '70px' }}>
        <Tooltip
          title={t('tool-tip.add-new-question')}
          arrow
          disableHoverListener={editingIndex === undefined}
          disableTouchListener={editingIndex === undefined}
        >
          <div>
            <Button
              variant='outlined'
              onClick={addQuestion}
              sx={{ p: 2, mt: 3, justifyContent: 'space-between', border: '1px solid #ddd' }}
              endIcon={<AddIcon />}
              disabled={editingIndex === questions.length}
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

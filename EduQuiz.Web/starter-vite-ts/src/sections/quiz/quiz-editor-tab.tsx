import type { Question } from "src/types/quiz";
import type { Operation } from "src/types/operation";

import { useState } from "react";

import AddIcon from "@mui/icons-material/Add";
import { Button, Tooltip, Container } from "@mui/material";

import { useParams } from "src/routes/hooks";

import { useTranslate } from "src/locales";
import { useCreateQuestion, useUpdateQuestion } from "src/actions/quiz";

import { QuestionEditCard } from "./components/question-edit-card";
import { QuestionViewCard } from "./components/question-view-card";

type Props = {
  quizOperation: Operation;
  questions: Question[];
  setQuestions: (questions: Question[]) => void;
};

export function QuizEditorTab({ quizOperation, questions, setQuestions }: Props) {
  const { t } = useTranslate();
  const [editingIndex, setEditingIndex] = useState<number | undefined>(undefined);
  const { id: quizId = "" } = useParams();

  const {
    createQuestion,
    isCreating
  } = useCreateQuestion(quizId, quizOperation, questions, setQuestions, setEditingIndex);
  const {
    updateQuestion,
    isUpdating
  } = useUpdateQuestion(quizOperation, questions, setQuestions, setEditingIndex);

  const addQuestion = () => setEditingIndex(questions.length);
  const handleCancel = () => setEditingIndex(undefined);

  return (
    <Container sx={{ width: "100%" }}>
      {questions.map((question, index) =>
        editingIndex === index ? (
          <QuestionEditCard
            key={index}
            onSave={(q) => updateQuestion(q, index)}
            onCancel={handleCancel}
            initialData={question}
            isLoading={isUpdating}
          />
        ) : (
          <QuestionViewCard
            key={index}
            index={index}
            question={question}
            onEdit={() => setEditingIndex(index)}
            editorProps={{ quizOperation, questions, setQuestions }}
          />
        )
      )}

      {editingIndex === questions.length && (
        <QuestionEditCard
          onSave={createQuestion}
          onCancel={handleCancel}
          isLoading={isCreating}
        />
      )}

      <div style={{ marginBottom: "70px" }}>
        <Tooltip
          title={t("tool-tip.add-new-question")}
          arrow
          disableHoverListener={editingIndex === undefined}
          disableTouchListener={editingIndex === undefined}
        >
          <div>
            <Button
              variant="outlined"
              onClick={addQuestion}
              sx={{ p: 2, mt: 3, justifyContent: "space-between", border: "1px solid #ddd" }}
              endIcon={<AddIcon />}
              disabled={editingIndex === questions.length}
              fullWidth
            >
              {t("add-new-question")}
            </Button>
          </div>
        </Tooltip>
      </div>
    </Container>
  );
}

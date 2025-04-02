import type { Question } from "src/types/quiz";
import type { Operation } from "src/types/operation";

import { useState } from "react";

import { useAxios } from "src/axios/hooks";
import { useTranslate } from "src/locales";
import { endpoints } from "src/axios/endpoints";

import { toast } from "src/components/snackbar";

export function useCreateQuestion(
  quizId: string,
  quizOperation: Operation,
  questions: Question[],
  setQuestions: (questions: Question[]) => void,
  setEditingIndex: (index: number | undefined) => void
) {
  const { postAuth } = useAxios();
  const { t } = useTranslate();
  const [isCreating, setIsCreating] = useState(false);

  const createQuestion = async (question: Question) => {
    setIsCreating(true);
    try {
      if (quizOperation === "edit") {
        const questionId = await postAuth<string>(endpoints.question.create(quizId), question);
        toast.success(t("question-added.success"));
        question.id = questionId;
        setQuestions([...questions, question]);
        setEditingIndex(undefined);
      } else {
        setQuestions([...questions, question]);
        setEditingIndex(undefined);
      }
    } catch (e) {
      toast.error(t("question-added.error"));
      console.log("Error", e);
    } finally {
      setIsCreating(false);
    }
  };

  return { createQuestion, isCreating };
}

export function useUpdateQuestion(
  quizOperation: Operation,
  questions: Question[],
  setQuestions: (questions: Question[]) => void,
  setEditingIndex: (index: number | undefined) => void
) {
  const { patchAuth } = useAxios();
  const { t } = useTranslate();
  const [isUpdating, setIsUpdating] = useState(false);

  const updateQuestion = async (question: Question, index: number) => {
    const updatedQuestion = {
      id: question.id,
      text: question.text !== questions[index].text ? question.text : undefined,
      hint: question.hint !== questions[index].hint ? question.hint : undefined,
      answers: question.answers,
    };

    setIsUpdating(true);
    try {
      if (quizOperation === "edit") {
        await patchAuth<void>(endpoints.question.update, updatedQuestion);
        toast.success(t("question-updated.success"));
        const updatedQuestions = [...questions];
        updatedQuestions[index] = question;
        setQuestions(updatedQuestions);
        setEditingIndex(undefined);
      } else {
        const updatedQuestions = [...questions];
        updatedQuestions[index] = question;
        setQuestions(updatedQuestions);
        setEditingIndex(undefined);
      }
    } catch (e) {
      toast.error(t("question-updated.error"));
      console.log("Error", e);
    } finally {
      setIsUpdating(false);
    }
  };

  return { updateQuestion, isUpdating };
}

type EditorProps = {
  quizOperation: Operation;
  questions: Question[];
  setQuestions: (questions: Question[]) => void;
}

export function useDeleteQuestion(editorProps: EditorProps) {
  const { quizOperation, questions, setQuestions } = editorProps;
  const { deleteAuth } = useAxios();
  const { t } = useTranslate();
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteQuestion = async (index: number) => {
    setIsDeleting(true);
    try {
      if (quizOperation === "edit" && questions[index].id) {
        await deleteAuth<void>(endpoints.question.delete(questions[index].id));
        toast.success(t("question-deleted.success"));
        setQuestions(questions.filter((_, i) => i !== index));
      } else {
        setQuestions(questions.filter((_, i) => i !== index));
      }
    } catch (e) {
      toast.error(t("question-deleted.error"));
      console.log("Error", e);
    } finally {
      setIsDeleting(false);
    }
  };

  return { deleteQuestion, isDeleting };
}

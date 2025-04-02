import type { Flashcard } from "src/types/flashcard";
import type { Operation } from "src/types/operation";

import { useState } from "react";

import { useAxios } from "src/axios/hooks";
import { endpoints } from "src/axios/endpoints";

import { toast } from "src/components/snackbar";

import { useTranslate } from "../locales";

export function useCreateFlashcard(
  deckId: string,
  operation: Operation,
  flashcards: Flashcard[],
  setFlashcards: (flashcards: Flashcard[]) => void,
  setEditingIndex: (index: number | undefined) => void
) {
  const { postAuth } = useAxios();
  const { t } = useTranslate();
  const [isCreating, setIsCreating] = useState(false);

  const createFlashcard = async (flashcard: Flashcard) => {
    setIsCreating(true);
    try {
      if (operation === "edit") {
        const flashcardId = await postAuth<string>(endpoints.flashcard.create(deckId), flashcard);
        toast.success(t('flashcard-added.success'));
        flashcard.id = flashcardId;
        setFlashcards([...flashcards, flashcard]);
        setEditingIndex(undefined);
      } else {
        setFlashcards([...flashcards, flashcard]);
        setEditingIndex(undefined);
      }
    } catch (e) {
      toast.error("Error creating flashcard");
      console.log("Error", e);
    } finally {
      setIsCreating(false);
    }
  };

  return { createFlashcard, isCreating };
}

export function useUpdateFlashcard(
  operation: Operation,
  flashcards: Flashcard[],
  setFlashcards: (flashcards: Flashcard[]) => void,
  setEditingIndex: (index: number | undefined) => void
) {
  const { patchAuth } = useAxios();
  const { t } = useTranslate();
  const [isUpdating, setIsUpdating] = useState(false);

  const updateFlashcard = async (flashcard: Flashcard, index: number) => {
    const updatedFlashcard = {
      id: flashcard.id,
      front: flashcard.frontSideText !== flashcards[index].frontSideText ? flashcard.frontSideText : undefined,
      back: flashcard.backSideText !== flashcards[index].backSideText ? flashcard.backSideText : undefined,
    };

    setIsUpdating(true);
    try {
      if (operation === "edit" && flashcard.id) {
        await patchAuth<void>(endpoints.flashcard.update, updatedFlashcard);
        toast.success(t('flashcard-updated.success'));
        const updatedFlashcards = [...flashcards];
        updatedFlashcards[index] = flashcard;
        setFlashcards(updatedFlashcards);
        setEditingIndex(undefined);
      } else {
        const updatedFlashcards = [...flashcards];
        updatedFlashcards[index] = flashcard;
        setFlashcards(updatedFlashcards);
        setEditingIndex(undefined);
      }
    } catch (e) {
      toast.error("Error updating flashcard");
      console.log("Error", e);
    } finally {
      setIsUpdating(false);
    }
  };

  return { updateFlashcard, isUpdating };
}

type EditorProps = {
  flashcardDeckOperation: Operation,
  flashcards: Flashcard[],
  setFlashcards: (flashcards: Flashcard[]) => void
}
export function useDeleteFlashcard(editorProps: EditorProps) {
  const { flashcardDeckOperation, flashcards, setFlashcards } = editorProps;
  const { deleteAuth } = useAxios();
  const { t } = useTranslate();
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteFlashcard = async (index: number) => {
    setIsDeleting(true);
    try {
      if (flashcardDeckOperation === "edit" && flashcards[index].id) {
        await deleteAuth<void>(endpoints.flashcard.delete(flashcards[index].id));
        toast.success(t('flashcard-deleted.success'));
        setFlashcards(flashcards.filter((_, i) => i !== index));
      } else {
        setFlashcards(flashcards.filter((_, i) => i !== index));
      }
    } catch (e) {
      toast.error("Error deleting flashcard");
      console.log("Error", e);
    } finally {
      setIsDeleting(false);
    }
  };

  return { deleteFlashcard, isDeleting };
}

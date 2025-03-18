import type { Flashcard } from "src/types/flashcard";

import { useState } from "react";

import AddIcon from '@mui/icons-material/Add';
import { Button, Tooltip, Container } from '@mui/material';

import { useTranslate } from "src/locales";

import { FlashcardView } from "./components/flashcard-view";
import { FlashcardEditForm } from "./components/flashcard-edit-form";

type Props = {
  flashcards: Flashcard[];
  setFlashcards: (flashcards: Flashcard[]) => void;
};

export function FlashcardDeckEditorTab({ flashcards, setFlashcards }: Props) {
  const { t } = useTranslate('activity');
  const [editingIndex, setEditingIndex] = useState<number | undefined>(undefined)

  const addFlashcard = () => {
    setEditingIndex(flashcards.length);
  };

  const removeFlashcard = (index: number) => {
    setFlashcards(flashcards.filter((_, i) => i !== index));
  };

  const handleSave = (flashcard: Flashcard, index: number | undefined) => {
    if (index !== undefined) {
      const updatedFlashcards = [...flashcards];
      updatedFlashcards[index] = flashcard;
      setFlashcards(updatedFlashcards);
    } else {
      setFlashcards([...flashcards, flashcard]);
    }
    setEditingIndex(undefined);
  }

  const handleCancel = () => {
    setEditingIndex(undefined);
  }

  return (
    <Container sx={{ width: '100%' }}>
      {
        flashcards.map((flashcard, index) => (
          editingIndex === index ? (
            <FlashcardEditForm key={index} onSave={(q) => handleSave(q, index)} onCancel={handleCancel}
                               initialData={flashcard} />
          ) : (
            <FlashcardView
              key={index}
              index={index}
              flashcard={flashcard}
              onDelete={() => removeFlashcard(index)}
              onEdit={() => setEditingIndex(index)}
            />
          )
        ))
      }

      {
        editingIndex === flashcards.length && (
          <FlashcardEditForm onSave={(q) => handleSave(q, editingIndex)} onCancel={handleCancel} />
        )}

      <div style={{ marginBottom: '70px' }}>
        <Tooltip
          title={t('tool-tip.add-new-flashcard')}
          arrow
          disableHoverListener={editingIndex === undefined}
          disableTouchListener={editingIndex === undefined}
        >
          <div>
            <Button
              variant='outlined'
              onClick={addFlashcard}
              sx={{ p: 2, mt: 3, justifyContent: 'space-between', border: '1px solid #ddd' }}
              endIcon={<AddIcon />}
              disabled={editingIndex === flashcards.length}
              fullWidth
            >
              {t('add-new-flashcard')}
            </Button>
          </div>
        </Tooltip>
      </div>
    </Container>
  );
}

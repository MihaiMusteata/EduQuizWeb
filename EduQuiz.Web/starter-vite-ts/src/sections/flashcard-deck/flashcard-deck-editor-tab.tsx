import type { Flashcard} from "src/types/flashcard";

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
  const [isEditing, setIsEditing] = useState(true);

  const addFlashcard = () => {
    setIsEditing(true);
  };

  const removeFlashcard = (index: number) => {
  };

  const editFlashcard = (index: number) => {
  };

  const handleSave = (flashcard: Flashcard) => {
    setIsEditing(false);
    setFlashcards([...flashcards, flashcard]);
  }

  return (
    <Container sx={{ width: '100%' }}>

      {
        flashcards.map((flashcard, index) => (
          <FlashcardView
            key={index}
            index={index}
            flashcard={flashcard}
            onDelete={() => removeFlashcard(index)}
            onEdit={() => editFlashcard(index)}
          />
        ))
      }

      {
        isEditing &&
        <FlashcardEditForm onSave={handleSave} />
      }

      <div style={{ marginBottom: '70px' }}>
        <Tooltip
          title={t('tool-tip.add-new-flashcard')}
          arrow
          disableHoverListener={!isEditing}
          disableTouchListener={!isEditing}
        >
          <div>
            <Button
              variant='outlined'
              onClick={addFlashcard}
              sx={{ p: 2, mt: 3, justifyContent: 'space-between', border: '1px solid #ddd' }}
              endIcon={<AddIcon />}
              disabled={isEditing}
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

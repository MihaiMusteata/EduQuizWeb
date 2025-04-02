import type { Flashcard } from "src/types/flashcard";
import type { Operation } from "src/types/operation";

import { useState } from "react";

import AddIcon from '@mui/icons-material/Add';
import { Button, Tooltip, Container } from '@mui/material';

import { useParams } from "src/routes/hooks";

import { useTranslate } from "src/locales";
import { useCreateFlashcard, useUpdateFlashcard } from "src/actions/flashcard";

import { FlashcardView } from "./components/flashcard-view";
import { FlashcardEditForm } from "./components/flashcard-edit-form";

type Props = {
  flashcardDeckOperation: Operation;
  flashcards: Flashcard[];
  setFlashcards: (flashcards: Flashcard[]) => void;
};

export function FlashcardDeckEditorTab({ flashcardDeckOperation, flashcards, setFlashcards }: Props) {
  const { t } = useTranslate();
  const [editingIndex, setEditingIndex] = useState<number | undefined>(undefined);
  const { id: deckId = "" } = useParams();

  const {
    createFlashcard,
    isCreating
  } = useCreateFlashcard(deckId, flashcardDeckOperation, flashcards, setFlashcards, setEditingIndex);
  const {
    updateFlashcard,
    isUpdating
  } = useUpdateFlashcard(flashcardDeckOperation, flashcards, setFlashcards, setEditingIndex);

  const addFlashcard = () => setEditingIndex(flashcards.length);

  const handleCancel = () => setEditingIndex(undefined);

  return (
    <Container sx={{ width: '100%' }}>
      {
        flashcards.map((flashcard, index) => (
          editingIndex === index ? (
            <FlashcardEditForm
              key={index}
              onSave={(q) => updateFlashcard(q, index)}
              onCancel={handleCancel}
              initialData={flashcard}
              isLoading={isUpdating}
            />
          ) : (
            <FlashcardView
              key={index}
              index={index}
              flashcard={flashcard}
              onEdit={() => setEditingIndex(index)}
              editorProps={{ flashcardDeckOperation, flashcards, setFlashcards }}
            />
          )
        ))
      }

      {
        editingIndex === flashcards.length && (
          <FlashcardEditForm
            onSave={createFlashcard}
            onCancel={handleCancel}
            isLoading={isCreating}
          />
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

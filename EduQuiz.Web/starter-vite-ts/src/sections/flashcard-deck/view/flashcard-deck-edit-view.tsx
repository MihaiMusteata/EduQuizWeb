import type { FlashcardDeck } from "src/types/flashcard";

import { FullScreenDialog } from "src/components/dialog/full-screen-dialog";

import { FlashcardDeckEditNewForm  } from "../flashcard-deck-edit-new-form";


type Props = {
  flashcardDeck?: FlashcardDeck;
}

export function FlashcardDeckEditView({ flashcardDeck }: Props) {
  return (
    <FullScreenDialog>
      <FlashcardDeckEditNewForm operation="edit" currentFlashcardDeck={flashcardDeck} />
    </FullScreenDialog>
  )
}

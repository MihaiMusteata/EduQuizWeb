import { FullScreenDialog } from "src/components/dialog/full-screen-dialog";

import { FlashcardDeckEditNewForm } from "../flashcard-deck-edit-new-form";

export function FlashcardDeckCreateView() {
  return (
    <FullScreenDialog>
      <FlashcardDeckEditNewForm />
    </FullScreenDialog>
  );
}

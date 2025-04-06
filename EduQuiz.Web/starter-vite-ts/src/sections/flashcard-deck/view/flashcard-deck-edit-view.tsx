import type { FlashcardDeck } from "src/types/flashcard";

import { paths } from "src/routes/paths";
import { useRouter } from "src/routes/hooks";

import { FullScreenDialog } from "src/components/dialog/full-screen-dialog";

import { FlashcardDeckEditNewForm  } from "../flashcard-deck-edit-new-form";


type Props = {
  flashcardDeck?: FlashcardDeck;
}

export function FlashcardDeckEditView({ flashcardDeck }: Props) {
  const router = useRouter();
  return (
    <FullScreenDialog onClose={() => router.push(paths.dashboard.library)}>
      <FlashcardDeckEditNewForm operation="edit" currentFlashcardDeck={flashcardDeck} />
    </FullScreenDialog>
  )
}

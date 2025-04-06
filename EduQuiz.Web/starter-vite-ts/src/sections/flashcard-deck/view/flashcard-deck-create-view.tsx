import { paths } from "src/routes/paths";
import { useRouter } from "src/routes/hooks";

import { FullScreenDialog } from "src/components/dialog/full-screen-dialog";

import { FlashcardDeckEditNewForm } from "../flashcard-deck-edit-new-form";

export function FlashcardDeckCreateView() {
  const router = useRouter();
  return (
    <FullScreenDialog onClose={() => router.push(paths.dashboard.tools)}>
      <FlashcardDeckEditNewForm operation="create" />
    </FullScreenDialog>
  );
}

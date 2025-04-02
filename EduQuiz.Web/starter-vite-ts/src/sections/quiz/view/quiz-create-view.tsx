import { FullScreenDialog } from "src/components/dialog/full-screen-dialog";

import { QuizEditNewForm } from "../quiz-edit-new-form";

export function QuizCreateView() {
  return (
    <FullScreenDialog>
      <QuizEditNewForm operation="create"/>
    </FullScreenDialog>
  );
}

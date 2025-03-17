import type { Quiz } from "src/types/quiz";

import { FullScreenDialog } from "src/components/dialog/full-screen-dialog";

import { QuizEditNewForm } from "../quiz-edit-new-form";


type Props = {
  quiz?: Quiz;
}

export function QuizEditView({ quiz }: Props) {
  return (
    <FullScreenDialog>
      <QuizEditNewForm currentQuiz={quiz} />
    </FullScreenDialog>
  )
}

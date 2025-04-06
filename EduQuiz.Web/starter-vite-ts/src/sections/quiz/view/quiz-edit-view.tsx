import type { Quiz } from "src/types/quiz";

import { paths } from "src/routes/paths";
import { useRouter } from "src/routes/hooks";

import { FullScreenDialog } from "src/components/dialog/full-screen-dialog";

import { QuizEditNewForm } from "../quiz-edit-new-form";


type Props = {
  quiz?: Quiz;
}

export function QuizEditView({ quiz }: Props) {
  const router = useRouter();
  return (
    <FullScreenDialog onClose={() => router.push(paths.dashboard.library)}>
      <QuizEditNewForm operation="edit" currentQuiz={quiz} />
    </FullScreenDialog>
  )
}

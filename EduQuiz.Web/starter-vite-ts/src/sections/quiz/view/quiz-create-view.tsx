import { paths } from "src/routes/paths";
import { useRouter } from "src/routes/hooks";

import { FullScreenDialog } from "src/components/dialog/full-screen-dialog";

import { QuizEditNewForm } from "../quiz-edit-new-form";

export function QuizCreateView() {
  const router = useRouter();
  return (
    <FullScreenDialog onClose={() => router.push(paths.dashboard.tools)}>
      <QuizEditNewForm operation="create"/>
    </FullScreenDialog>
  );
}

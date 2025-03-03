import { useCallback, useState } from "react";
import { varAlpha } from "minimal-shared/utils";

import { Tab, Tabs, Container } from "@mui/material";

import { useAxios } from "../../../axios/hooks";
import { useTranslate } from "../../../locales";
import { useRouter } from "../../../routes/hooks";
import { QuizEditorTab } from "./quiz-editor-tab";
import { Question, Quiz } from "../../../types/quiz";
import { QuizSettingsTab } from "./quiz-settings-tab";

export function QuizCreateView() {
  const { t } = useTranslate('common');
  const router = useRouter();

  const { postAuth } = useAxios();
  const [currentTab, setCurrentTab] = useState('Editor');
  const [quiz, setQuiz] = useState<Quiz>({
    title: '',
    visibility: 'public',
    questions: [],
  });

  const handleChangeTab = useCallback((event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  }, []);

  const handleSetQuestions = (questions: Question[]) => {
    setQuiz({ ...quiz, questions: questions });
  };

  const handleSave = async () => {
    await postAuth('/quiz/create', quiz)
      .then((response) => {
        router.refresh();
      })
      .catch((error) => {
        console.error('Error creating quiz', error);
      });
  };

  return (
    <Container sx={{ width: { xs: '100%', lg: '70%', xl: '60%' } }}>
      <Tabs
        value={currentTab}
        onChange={handleChangeTab}
        sx={[
          (theme) => ({
            px: 2.5,
            boxShadow: `inset 0 -2px 0 0 ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
          }),
        ]}
      >
        <Tab
          iconPosition="end"
          value="Editor"
          label={t('editor')}
        />
        <Tab
          iconPosition="end"
          value="Settings"
          label={t('settings')}
        />
      </Tabs>
      {
        currentTab === 'Editor' &&
        <QuizEditorTab questions={quiz.questions} setQuestions={handleSetQuestions} />
      }
      {
        currentTab === 'Settings' &&
        <QuizSettingsTab onSubmit={handleSave} quiz={quiz} setQuiz={setQuiz} />
      }
    </Container>
  );
}

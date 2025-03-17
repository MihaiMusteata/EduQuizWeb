import type { Quiz, Question } from "src/types/quiz";

import { useState, useCallback } from "react";
import { varAlpha } from "minimal-shared/utils";

import { Tab, Tabs, Container } from "@mui/material";

import { paths } from "src/routes/paths";
import { useRouter } from "src/routes/hooks";

import { useTranslate } from "src/locales";
import { useAxios } from "src/axios/hooks";
import { endpoints } from "src/axios/endpoints";

import { QuizEditorTab } from "./quiz-editor-tab";
import { QuizSettingsTab } from "./quiz-settings-tab";

type Props = {
  currentQuiz?: Quiz;
}
export function QuizEditNewForm({ currentQuiz }: Props) {
  const { t } = useTranslate('common');
  const router = useRouter();

  const { postAuth, putAuth } = useAxios();
  const [currentTab, setCurrentTab] = useState('Editor');
  const [quiz, setQuiz] = useState<Quiz>(currentQuiz ?? {
    id: '',
    title: '',
    visibility: 'public',
    questions: [],
  });

  const handleChangeTab = useCallback((event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  }, []);

  const handleSetQuestions = (questions: Question[]) => {
    setQuiz({ ...quiz, questions });
  };

  const handleSave = async () => {
    try {
      if (currentQuiz) {
        await putAuth(endpoints.quiz.update, quiz);
      } else {
        await postAuth(endpoints.quiz.create, quiz);
      }

      router.push(paths.dashboard.library);
    } catch (error) {
      console.error("Error saving quiz", error);
    }
  };


  return (
    <Container sx={{ width: { xs: '100%', lg: '70%', xl: '60%' }, padding: { xs: '0' } }}>
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

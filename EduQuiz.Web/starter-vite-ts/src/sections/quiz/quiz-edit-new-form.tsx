import type { Quiz, Question } from "src/types/quiz";
import type { Operation } from "src/types/operation";

import { useState, useCallback } from "react";
import { varAlpha } from "minimal-shared/utils";

import { Tab, Tabs, Container } from "@mui/material";

import { useRouter } from "src/routes/hooks";

import { useTranslate } from "src/locales";
import { useAxios } from "src/axios/hooks";
import { endpoints } from "src/axios/endpoints";

import { QuizEditorTab } from "./quiz-editor-tab";
import { QuizSettingsTab } from "./quiz-settings-tab";

type Props = {
  operation: Operation;
  currentQuiz?: Quiz;
}

export function QuizEditNewForm({ operation, currentQuiz }: Props) {
  const { t } = useTranslate();

  const { postAuth, patchAuth } = useAxios();
  const [currentTab, setCurrentTab] = useState('Editor');
  const [quiz, setQuiz] = useState<Quiz>(currentQuiz ?? {
    title: '',
    visibility: 'public',
    questions: [],
  });

  const saveAction = () => {
    if (operation === "create") {
      return () => postAuth(endpoints.quiz.create, quiz);
    } else {
      return () => patchAuth(endpoints.quiz.update, quiz);
    }
  }

  const handleChangeTab = useCallback((event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  }, []);

  const handleSetQuestions = (questions: Question[]) => {
    setQuiz({ ...quiz, questions });
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
        <QuizEditorTab
          quizOperation={operation}
          questions={quiz.questions}
          setQuestions={handleSetQuestions}
        />
      }
      {
        currentTab === 'Settings' &&
        <QuizSettingsTab
          operation={operation}
          action={saveAction()}
          quiz={quiz}
          setQuiz={setQuiz}
        />
      }
    </Container>
  );
}

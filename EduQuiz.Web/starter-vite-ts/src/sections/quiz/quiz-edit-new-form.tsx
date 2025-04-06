import type { Operation } from "src/types/operation";
import type { Quiz, Question, AIConfigParams } from "src/types/quiz";

import { useState, useCallback } from "react";
import { varAlpha } from "minimal-shared/utils";
import { useBoolean } from "minimal-shared/hooks";

import { Tab, Tabs, Container } from "@mui/material";

import { useSearchParams } from "src/routes/hooks";

import { useTranslate } from "src/locales";
import { useAxios } from "src/axios/hooks";
import { endpoints } from "src/axios/endpoints";

import { QuizEditorTab } from "./quiz-editor-tab";
import { QuizSettingsTab } from "./quiz-settings-tab";
import { QuizAIConfigDialog } from "./quiz-ai-config-dialog";

type Props = {
  operation: Operation;
  currentQuiz?: Quiz;
}

export function QuizEditNewForm({ operation, currentQuiz }: Props) {
  const { t } = useTranslate();
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode') === 'ai' ? 'ai' : 'manual';
  const openAIDialog = useBoolean(true);

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

  const handleGenerate = async (config: AIConfigParams) => {
    openAIDialog.onFalse();
    try {
      const response = await fetch("http://localhost:8001/api/ai/quiz/generate", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });

      if (!response.ok) {
        throw new Error('Failed to generate quiz');
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Failed to read response stream');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');

        for (let i = 0; i < lines.length - 1; i++) {
          const line = lines[i].trim();
          if (line) {
            try {
              const question: Question = JSON.parse(line);
              setQuiz((prevQuiz) => ({
                ...prevQuiz,
                questions: [...prevQuiz.questions, question],
              }));
            } catch (error) {
              console.error('Failed to parse question:', error);
            }
          }
        }

        buffer = lines[lines.length - 1];
      }

      if (buffer.trim()) {
        try {
          const question: Question = JSON.parse(buffer.trim());
          setQuiz((prevQuiz) => ({
            ...prevQuiz,
            questions: [...prevQuiz.questions, question],
          }));
        } catch (error) {
          console.error('Failed to parse final question:', error);
        }
      }
    } catch (error) {
      console.error('Error generating quiz:', error);
    }
  };

  return (
    <>
      {
        mode === 'ai' && openAIDialog.value ?
          <QuizAIConfigDialog
            onGenerate={handleGenerate}
          />
          :
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
      }
    </>
  );
}

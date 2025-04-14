import type { PracticeConfig } from "src/types/activity"
import type { Question, QuizResult, AnswerGiven } from "src/types/quiz"

import { useState, useEffect } from "react"
import { useBoolean } from "minimal-shared/hooks";

import LoadingButton from "@mui/lab/LoadingButton";
import {
  Box,
  Card,
  Stack,
  Alert,
  Button,
  Slider,
  Container,
  Typography
} from "@mui/material"

import { paths } from "src/routes/paths";
import { useRouter } from "src/routes/hooks";

import { useTranslate } from "src/locales";
import { useAxios } from "src/axios/hooks";
import { endpoints } from "src/axios/endpoints";

import { Iconify } from "src/components/iconify";
import { Hint } from "src/components/activity/hint";
import { Scrollbar } from "src/components/scrollbar";
import { CountdownTimer } from "src/components/timer";

import { RenderQuestion } from "./components/render-question";


type Props = {
  quizId: string;
  totalQuestions: number;
  config: PracticeConfig,
}

export function QuizPracticeContent({ quizId, totalQuestions, config }: Props) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [orderList] = useState<number[]>(shuffleList(Array.from({ length: totalQuestions }, (_, i) => i)));
  const [finalGrade, setFinalGrade] = useState<number | undefined>(undefined);
  const [page, setPage] = useState(0);
  const [answersGiven, setAnswersGiven] = useState<AnswerGiven[]>([]);
  const { getAuth, postAuth } = useAxios();
  const submitted = useBoolean(false);
  const router = useRouter();
  const { t } = useTranslate();

  console.log('answerGive', answersGiven);
  const progress = new Set(answersGiven.map(answer => answer.questionId)).size;

  const handleAnswerSelect = (questionId: string, userAnswer: string, isMultipleChoice: boolean) => {
    setAnswersGiven((prev) => {
      if (isMultipleChoice) {
        const existingAnswers = prev.filter((a) => a.questionId === questionId);
        const isSelected = existingAnswers.some((a) => a.userAnswer === userAnswer);

        if (isSelected) {
          return prev.filter((a) => !(a.questionId === questionId && a.userAnswer === userAnswer));
        } else {
          return [...prev, { questionId, userAnswer }];
        }
      } else {
        return prev.filter((a) => a.questionId !== questionId).concat({ questionId, userAnswer });
      }
    });
  };

  const handleSubmit = () => {
    const url = endpoints.quiz.submit(quizId);
    try {
      postAuth<QuizResult>(url, answersGiven).then((result) => {
          setQuestions(result.questions);
          setFinalGrade(result.finalScore);
        }
      )
      submitted.onTrue();
    } catch (e) {
      console.error(e);
    }
  }
  const getQuestions = () => {
    try {
      getAuth<Question[]>(endpoints.question.getList, { params: { quizId } }).then((data) => {
        if (config.shuffleQuestions) {
          data = shuffleList(data);
        }

        if (config.shuffleAnswers) {
          data = data.map((question) => ({
            ...question,
            answers: shuffleList(question.answers),
          }));
        }

        setQuestions(data);
      });
    } catch (error) {
      console.error(error);
    }
  }

  const getQuestion = () => {
    try {
      getAuth(endpoints.question.getByIndex, {
        params: {
          quizId,
          index: orderList[page]
        }
      }).then((data) => {
        if (config.shuffleAnswers) {
          data.answers = shuffleList(data.answers);
        }

        setQuestions([data]);
      });
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (config.numberOfQuestions === "all") {
      getQuestions();
    }
  });

  useEffect(() => {
    if (config.numberOfQuestions === "one") {
      getQuestion();
    }
  }, [page]);

  return (
    <Container sx={{ mt: 3 }}>
      {
        config.withTimer &&

        <CountdownTimer timer={{
          start: new Date(),
          end: new Date(new Date().getTime() + config.timer! * 60 * 1000)
        }} />
      }
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <Iconify icon="noto:trophy" sx={{ opacity: 0.1, mr: 2 }} width={30} />
        <Slider
          size="medium"
          marks
          min={0}
          step={1}
          max={totalQuestions}
          value={progress}
          color={
            progress < totalQuestions * 0.25
              ? 'error'
              : progress < totalQuestions * 0.75
                ? 'warning'
                : 'success'
          }
          sx={{ flexGrow: 1 }}
        />
        <Iconify icon="noto:trophy" sx={{ color: 'primary.main', ml: 2 }} width={30} />

        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            paddingX: '10px',
            paddingY: '1px',
            transform: 'translate(-50%, -50%)',
            fontWeight: 'bold',
            fontSize: '14px',
            color: 'text.primary',
            backgroundColor: 'primary.main',
            borderRadius: 1,
          }}
        >
          <Typography variant="body1" fontWeight="bold">
            {progress}/{totalQuestions}
          </Typography>
        </Box>
      </Box>

      <Scrollbar sx={{ mt: 3, height: `calc(100vh - 78px - ${config.withTimer ? '46px' : '0px'})` }}>
        <Box sx={{ paddingX: 2 }}>
          <Stack>
            {
              questions.map((question, index) => (
                <Card key={index} sx={{ borderRadius: '10px', padding: '20px 20px 10px 20px', marginTop: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="h6" sx={{ my: 1 }}>
                      {index + 1}. {question.text}
                    </Typography>
                    {
                      question.hint &&
                      <Hint text={question.hint} t={t} />
                    }
                  </Box>
                  <RenderQuestion
                    question={question}
                    setAnswersGiven={setAnswersGiven}
                    answersGiven={answersGiven}
                    submitted={submitted.value}
                  />
                  {
                    submitted.value &&
                    <Alert
                      severity='success'
                    >
                      {
                        `Răspuns corect: ${
                          question.answers
                            .filter((answer) => answer.isCorrect)
                            .map((answer) => answer.text)
                            .join(", ")
                        }`
                      }
                    </Alert>
                  }
                </Card>
              ))
            }
          </Stack>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, mb: 5 }}>
            {
              (page < totalQuestions - 1 && config.numberOfQuestions === "one") &&
              <Button
                variant='soft'
                color='primary'
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
            }
            {
              (!submitted.value && (page === totalQuestions - 1 || config.numberOfQuestions === "all")) &&
              <LoadingButton
                variant='soft'
                color='primary'
                loading={false}
                onClick={handleSubmit}
              >
                {t('finish')}
              </LoadingButton>
            }
            {
              submitted.value &&
              <>
                <Alert
                  sx={{ width: '100%', mr: 1 }}
                  severity='success'
                >
                  {
                    `${t('final-grade')}: ${finalGrade}`
                  }
                </Alert>
                <Button
                  variant='soft'
                  color='primary'
                  onClick={() => {
                    router.push(paths.dashboard.root)
                  }}
                >
                  {t('home')}
                </Button>
              </>
            }
          </Box>
        </Box>
      </Scrollbar>

    </Container>
  )
}

function shuffleList<T>(list: T[]): T[] {
  const shuffled = [...list];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

import type { Question, AnswerGiven, QuizSession} from "src/types/quiz";

import dayjs from "dayjs";
import React, { useState, useEffect } from "react";
import { MuiOtpInput } from "mui-one-time-password-input";

import LoadingButton from "@mui/lab/LoadingButton";
import {
  Box,
  Card,
  Stack,
  Alert,
  Button,
  Slider,
  Container,
  TextField,
  Typography,
  Grid2 as Grid,
  CircularProgress
} from "@mui/material";

import { paths } from "src/routes/paths";
import { useRouter, useSearchParams } from "src/routes/hooks";

import { useTranslate } from "src/locales";
import { useSignalR } from "src/signalR/hooks";
import { endpoints } from "src/axios/endpoints";
import { useAxios, usePromise } from "src/axios/hooks";

import { Iconify } from "src/components/iconify";
import { Hint } from "src/components/activity/hint";
import { Scrollbar } from "src/components/scrollbar";
import { CountdownTimer } from "src/components/timer";

import { useAuthContext } from "src/auth/hooks";

import { RenderQuestion } from "../../quiz/components/render-question";

export function QuizSessionView() {
  const { connection, connect, disconnect, registerHandler, unregisterHandler } = useSignalR();
  const [answersGiven, setAnswersGiven] = useState<AnswerGiven[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [finalGrade, setFinalGrade] = useState<number | undefined>(undefined);
  const [page, setPage] = useState(0);
  const searchParams = useSearchParams();
  const [session, setSession] = useState<QuizSession>({
    id: searchParams.get('sessionId') ?? '',
    accessPin: searchParams.get('pin') ?? '',
    status: "waiting",
    totalQuestions: 0
  });
  const { user } = useAuthContext();
  const [nickname, setNickname] = useState(user?.nickname ?? '');
  const [step, setStep] = useState(1);
  const { postPublic, getPublic } = useAxios();
  const { t } = useTranslate();
  const router = useRouter();
  const progress = new Set(answersGiven.map(answer => answer.questionId)).size;

  const { execute: getQuestion, isLoading: isGettingQuestion, data: question } = usePromise<Question>(() =>
    getPublic(endpoints.quizSession.getQuestion(session.id ?? '', nickname, page))
  );

  const { execute: submitAnswer, isLoading: isSubmittingAnswer } = usePromise<any, any>(
    (answerPayload) =>
      postPublic(endpoints.quizSession.submitAnswer(session.id ?? ''), answerPayload)
  );

  const handleError = (msg: string) => {
    alert(msg);
    setStep(1);
  }

  const handleJoin = async () => {
    if (connection) {
      const result = await connection.invoke("JoinSession", session.accessPin, nickname);
      setSession(result);
    }
  };

  const handleSubmit = async () => {
    try {
      setPage(page + 1)
      await submitAnswer({
        nickname,
        answerGiven: answersGiven[page]
      });
    } catch (e) {
      console.error(e);
    }
  }

  const handleGetResult = async () => {
    try {
      const result = await getPublic(endpoints.quizSession.getResult(session.id ?? '', nickname));
      setFinalGrade(result.finalScore);
      setQuestions(result.questions);
    } catch (e) {
      console.error(e);
    }
  }

  const handleFinish = async () => {
    try {
      if (answersGiven[page] !== undefined) {
        await submitAnswer({
          nickname,
          answerGiven: answersGiven[page]
        });
      }
      await handleGetResult()
    } catch (e) {
      console.error(e);
    }
  }

  const sessionStartedHandler = (s: QuizSession) => {
    setSession(s);
  };

  const sessionEndedHandler = (s: QuizSession) => {
    alert("Session End")
    setSession(s);
  };

  useEffect(() => {
    connect();
  }, []);

  useEffect(() => {
    if (connection) {
      registerHandler("Error", handleError);
      registerHandler("SessionStarted", sessionStartedHandler);
      registerHandler("SessionEnded", sessionEndedHandler);
    }

    return () => {
      unregisterHandler("Error", handleError);
      unregisterHandler("SessionStarted", sessionStartedHandler)
      unregisterHandler("SessionEnded", sessionEndedHandler);
    }
  }, [connection]);

  useEffect(() => {
    if (session.status === "running") {
      getQuestion();
    }

    if (session.status === "finished") {
      handleFinish();
    }
  }, [session, page]);

  const renderWaiting = () => (
    <Box
      display='flex'
      flexDirection='row'
      justifyContent='center'
      alignItems='center'
      gap={2}
    >
      <Typography variant="h4">
        Asteptam sa inceapa quizul
      </Typography>
      <CircularProgress size={30} />
    </Box>
  )

  const renderJoining = () => (
    <>
      <h2>Join Quiz Session</h2>
      <Grid
        width="350px"
        container
        spacing={3}
      >
        {
          step === 1 && (
            <>
              <MuiOtpInput
                autoFocus
                value={session.accessPin}
                onChange={(value) => setSession({ ...session, accessPin: value })}
                gap={1}
                length={6}
                TextFieldsProps={{
                  placeholder: '-',
                }}
              />
              <Button
                variant='soft'
                color="secondary"
                fullWidth
                onClick={() => setStep(2)}
              >
                Next
              </Button>
            </>
          )
        }
        {
          step === 2 && (
            <>
              <TextField
                disabled={user?.nickname !== undefined}
                fullWidth
                label="Nickname"
                variant="outlined"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
              />

              <Button
                variant='soft'
                color="success"
                fullWidth
                onClick={handleJoin}
                disabled={nickname?.length < 1}
              >
                Conect
              </Button>
            </>
          )
        }
      </Grid>
    </>
  );

  const renderRunning = () => (
    <Container sx={{ mt: 3 }}>
      {
        finalGrade === undefined &&
        <>
          {
            session.startTime && session.endTime &&
            <CountdownTimer
              timer={{
                start: dayjs.utc(session.startTime).toDate(),
                end: dayjs.utc(session.endTime).toDate()
              }}
              size="small"
            />
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
              max={session.totalQuestions}
              value={progress}
              color={
                progress < session.totalQuestions * 0.25
                  ? 'error'
                  : progress < session.totalQuestions * 0.75
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
                {progress}/{session.totalQuestions}
              </Typography>
            </Box>
          </Box>

          <Scrollbar sx={{ mt: 3, height: `calc(100vh - 78px - 0px)` }}>
            <Box sx={{ paddingX: 2 }}>
              <Stack>
                {
                  !isGettingQuestion && question &&
                  <Card sx={{ borderRadius: '10px', padding: '20px 20px 10px 20px', marginTop: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography variant="h6" sx={{ my: 1 }}>
                        {page + 1}. {question!.text}
                      </Typography>
                      {
                        question!.hint &&
                        <Hint text={question!.hint} t={t} />
                      }
                    </Box>
                    <RenderQuestion
                      question={question!}
                      submitted={session.status === "finished"}
                      answersGiven={answersGiven}
                      setAnswersGiven={setAnswersGiven}
                    />
                  </Card>
                }
              </Stack>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, mb: 5 }}>
                {
                  (page < session.totalQuestions - 1) &&
                  <Button
                    variant='soft'
                    color='primary'
                    onClick={handleSubmit}
                  >
                    Next
                  </Button>
                }
                {
                  ((page === session.totalQuestions - 1)) &&
                  <LoadingButton
                    variant='soft'
                    color='primary'
                    onClick={handleFinish}
                  >
                    {t('finish')}
                  </LoadingButton>
                }
              </Box>
            </Box>
          </Scrollbar>
        </>
      }
      {
        finalGrade !== undefined &&
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, mb: 5 }}>
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
        </Box>
      }
    </Container>
  )

  return (
    <Grid
      container
      justifyContent="center"
      direction="column"
      alignItems="center"
      spacing={3}
    >
      {
        session.id === '' &&
        renderJoining()
      }
      {
        session.id !== '' && session.status === 'waiting' &&
        renderWaiting()
      }
      {
        (session.status === 'running' || session.status === "finished") &&
        renderRunning()
      }
    </Grid>
  );
}

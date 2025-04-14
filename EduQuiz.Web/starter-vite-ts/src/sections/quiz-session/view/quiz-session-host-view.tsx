import type { QuizSession } from "src/types/quiz";

import dayjs from "dayjs";
import { QRCodeSVG } from 'qrcode.react';
import React, { useState, useEffect } from "react";

import LoadingButton from "@mui/lab/LoadingButton";
import { Box, Card, Button, Typography, CircularProgress } from "@mui/material";

import { paths } from "src/routes/paths";
import { useRouter , useSearchParams } from "src/routes/hooks";

import { CONFIG } from "src/global-config";
import { useSignalR } from "src/signalR/hooks";
import { endpoints } from "src/axios/endpoints";
import { useAxios, usePromise } from "src/axios/hooks";

import { Iconify } from "src/components/iconify";
import { CountdownTimer } from "src/components/timer";

type Props = {
  quizSession: QuizSession;
}

export function QuizSessionHostView({ quizSession }: Props) {
  const { connection, connect, disconnect, registerHandler, unregisterHandler } = useSignalR();
  const [session, setSession] = useState<QuizSession>(quizSession);
  const { postAuth } = useAxios();
  const [participants, setParticipants] = useState<string[]>([]);
  const [leaderboard, setLeaderboard] = useState<string[]>([]);
  const searchParams = useSearchParams();
  const router = useRouter();
  const time = searchParams.get('time');

  const { execute: startSession, isLoading: isStarting } = usePromise<QuizSession>(() =>
    postAuth(endpoints.quizSession.start(session.id), { numberOfMinutes: time })
  );

  const { execute: endSession, isLoading: isEnding } = usePromise(() =>
    postAuth(endpoints.quizSession.end(session.id), {})
  );

  const participantJoinedHandler = (nickname: string) => {
    setParticipants(prev => [...prev, nickname]);
  }

  const sessionStartedHandler = (message: string) => {
  };

  const sessionEndedHandler = (s: QuizSession) => {
    alert("Session ended");
    setSession(s);
  };

  const handleStart = async () => {
    try {
      if (session) {
        const updatedSession = await startSession();
        setSession(updatedSession);
      }
    } catch (error) {
      console.error("Error starting quiz session", error);
    }
  }

  const handleEnd = async () => {
    try {
      if (session) {
        const updatedSession = await endSession();
        setSession(updatedSession);
      }
    } catch (error) {
      console.error("Error ending quiz session", error);
    }
  }

  useEffect(() => {
    connect();
  }, []);

  useEffect(() => {
    if (connection) {
      connection.invoke("HostJoin", session.id);
      registerHandler("ParticipantJoined", participantJoinedHandler);
      registerHandler("SessionStarted", sessionStartedHandler);
      registerHandler("SessionEnded", sessionEndedHandler);
    }

    return () => {
      unregisterHandler("ParticipantJoined", participantJoinedHandler);
      unregisterHandler("SessionStarted", sessionStartedHandler);
      unregisterHandler("SessionEnded", sessionEndedHandler);
    }
  }, [connection]);

  return (
    <>
      <Box
        display='flex'
        flexDirection='row'
        justifyContent='center'
        alignItems='center'
        mb={2}
      >
        <Card
          sx={{
            p: 3,
            pb: 4,
            mr: 3,
            height: 256,
          }}
        >
          {
            (session.status === "waiting" || time === null) && session.status !== "finished" &&
            <Typography
              variant='h3'
              fontWeight='bold'
              mb={1}
            >
              Session PIN:
            </Typography>
          }
          {
            session.status === "running" && (time || (session.endTime && session.startTime)) &&
            <Box
              display='flex'
              flexDirection='column'
              justifyContent='center'
              alignItems='center'
            >
              <CountdownTimer
                timer={{
                  start: dayjs.utc(session.startTime).toDate(),
                  end: dayjs.utc(session.endTime).toDate()
                }}
                size="small"
              />
            </Box>
          }
          <Box display="flex" gap={1}>
            {
              session.status === "finished" &&
              <Typography variant="h1" marginTop={1}>
                Session Finished
              </Typography>
            }
            {
              session.accessPin && session.accessPin.split('').map((char, index) => (
                <Box
                  key={index}
                  sx={{
                    width: 70,
                    height: 100,
                    border: 2,
                    borderColor: 'primary.main',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: '10px',
                  }}
                >
                  <Typography variant="h1">
                    {char}
                  </Typography>
                </Box>
              ))}
          </Box>
          {
            session.status === "waiting" &&
            <LoadingButton
              fullWidth
              color="success"
              onClick={handleStart}
              variant="soft"
              loading={isStarting}
              sx={{
                mt: 1.5
              }}
            >
              Start
            </LoadingButton>
          }
          {
            session.status === "running" &&
            <LoadingButton
              fullWidth
              color="error"
              onClick={handleEnd}
              variant="soft"
              loading={isEnding}
              sx={{
                mt: 1.5
              }}
            >
              Finish
            </LoadingButton>
          }

          {
            session.status === "finished" &&
            <Button
              fullWidth
              color="info"
              onClick={() => {
                router.push(paths.dashboard.library)
              }}
              variant="soft"
              sx={{
                mt: 8
              }}
            >
              Home
            </Button>
          }
        </Card>
        {
          session.status !== "finished" &&
          <QRCodeSVG
            value={`http://localhost:3000/join?pin=${session.accessPin}`}
            size={256}
            level="L"
            style={{
              borderRadius: "25px",
            }}
            marginSize={2}
            imageSettings={{
              src: `${CONFIG.assetsDir}/logo/Logo.svg`,
              height: 50,
              width: 50,
              excavate: true,
            }}
          />
        }
      </Box>
      {
        session.status !== "finished" &&
        <Box
          display="flex"
          flexWrap="wrap"
          justifyContent="center"
          gap={2}
          mt={3}
        >
          {
            participants.length > 0 ?
              participants.map((p, index) => (
                <Button
                  key={index}
                  color="secondary"
                  variant="soft"
                  startIcon={<Iconify icon="fluent-color:person-32" />}
                  size='large'
                >
                  {p}
                </Button>
              ))
              :
              <Box
                display='flex'
                flexDirection='row'
                justifyContent='center'
                alignItems='center'
                gap={2}
              >
                <Typography variant="h4">Asteptam participantii</Typography>
                <CircularProgress size={30} />
              </Box>
          }
        </Box>
      }
    </>
  )
}

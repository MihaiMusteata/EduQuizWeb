import React, { useState, useEffect } from 'react';

import { Box, IconButton, Typography, LinearProgress } from '@mui/material';

import { Iconify } from 'src/components/iconify';

import type { CountdownTimerProps } from "./types";

interface Props {
  timer: CountdownTimerProps;
}

export function CountdownTimer({ timer }: Props) {
  const [timeLeft, setTimeLeft] = useState<number>(Math.floor((timer.end.getTime() - new Date().getTime()) / 1000));
  const [isRunning, setIsRunning] = useState<boolean>(true);

  // eslint-disable-next-line
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      const interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);

      return () => clearInterval(interval);
    }

    if (timeLeft <= 0) {
      setIsRunning(false);
    }
  }, [timeLeft, isRunning]);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  const progress = (timeLeft / ((timer.end.getTime() - timer.start.getTime()) / 1000)) * 100;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', width: '100%' }}>
      <IconButton sx={{ mr: 2 }}>
        <Iconify icon="icon-park-twotone:timer" width={30} />
      </IconButton>

      <Box sx={{ width: '100%' }}>
        <LinearProgress
          variant="determinate"
          value={progress}
          color={progress > 10 ? 'primary' : progress > 4 ? 'warning' : 'error'}
        />
      </Box>
      <Box
        sx={{ width: '83px', textAlign: 'center' }}
        color={progress > 10 ? '#FFF' : progress > 5 ? 'warning.main' : 'error.main'}
      >
        <Typography variant="h6" sx={{ fontWeight: 'bold', ml: 2 }}>
          {hours < 10 ? `0${hours}` : hours}:
          {minutes < 10 ? `0${minutes}` : minutes}:
          {seconds < 10 ? `0${seconds}` : seconds}
        </Typography>
      </Box>
    </Box>
  );
}

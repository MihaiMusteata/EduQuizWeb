import React, { useState, useEffect } from 'react';

import { Box, IconButton, Typography, LinearProgress } from '@mui/material';

import { Iconify } from 'src/components/iconify';

import type { CountdownTimerProps } from "./types";

interface Props {
  timer: CountdownTimerProps;
  size?: "small" | "medium" | "large";
}

export function CountdownTimer({ timer, size = "small" }: Props) {
  const [timeLeft, setTimeLeft] = useState<number>(
    Math.max(0, Math.floor((timer.end.getTime() - new Date().getTime()) / 1000))
  );
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
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      textAlign: 'center',
      width: '100%'
    }}
    >
      <IconButton
        sx={{
          m: size === "small" ? 1 : 2,
        }}
      >
        <Iconify icon="icon-park-twotone:timer" width={size === "small" ? 30 : size === "medium" ? 60 : 80} />
      </IconButton>

      <Box sx={{ width: '100%' }}>
        <LinearProgress
          variant="determinate"
          value={progress}
          color={progress > 10 ? 'primary' : progress > 4 ? 'warning' : 'error'}
          sx={{
            height: size === "small" ? 4 : size === "medium" ? 15 : 8,
          }}
        />
      </Box>
      <Box
        sx={{
          ml: size === "small" ? 1 : 2,
          textAlign: 'center',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
        color={progress > 10 ? '#FFF' : progress > 5 ? 'warning.main' : 'error.main'}
      >
        <Typography
          variant={size === "small" ? "h4" : size === "medium" ? "h3" : "h2"}
          sx={{
            fontWeight: 'bold',
            width: size === "small" ? 34 : size === "medium" ? 35 : 50,
          }}
        >
          {hours < 10 ? `0${hours}` : hours}
        </Typography>

        <Typography
          variant={size === "small" ? "h4" : size === "medium" ? "h3" : "h2"}
          sx={{
            fontWeight: 'bold'
          }}
        >
          :
        </Typography>

        <Typography
          variant={size === "small" ? "h4" : size === "medium" ? "h3" : "h2"}
          sx={{
            fontWeight: 'bold',
            width: size === "small" ? 34 : size === "medium" ? 35 : 50,
          }}
        >
          {minutes < 10 ? `0${minutes}` : minutes}
        </Typography>

        <Typography
          variant={size === "small" ? "h4" : size === "medium" ? "h3" : "h2"}
          sx={{ fontWeight: 'bold' }}
        >
          :
        </Typography>

        <Typography
          variant={size === "small" ? "h4" : size === "medium" ? "h3" : "h2"}
          sx={{
            fontWeight: 'bold',
            width: size === "small" ? 34 : size === "medium" ? 35 : 50,
          }}
        >
          {seconds < 10 ? `0${seconds}` : seconds}
        </Typography>
      </Box>

    </Box>
  );
}

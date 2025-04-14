import type { PracticeMode, PracticeConfig } from "src/types/activity";

import { useState } from 'react';

import Typography from "@mui/material/Typography";
import LoadingButton from '@mui/lab/LoadingButton';
import {
  Switch,
  Select,
  MenuItem,
  TextField,
  Grid2 as Grid, InputAdornment
} from "@mui/material";

import { paths } from "src/routes/paths";
import { useParams, useRouter } from "src/routes/hooks";

import { CONFIG } from "src/global-config";
import { useTranslate } from "src/locales";
import { endpoints } from "src/axios/endpoints";
import { useAxios, usePromise } from "src/axios/hooks";

import { Iconify } from "src/components/iconify";
import { ActionCard } from "src/components/action-card";
import { FullScreenDialog } from 'src/components/dialog/full-screen-dialog';

import { QuizPracticeContent } from "../quiz-practice-content";

export function QuizPracticeView() {
  const [practiceMode, setPracticeMode] = useState<PracticeMode | undefined>(undefined);
  const [practiceConfig, setPracticeConfig] = useState<PracticeConfig>({
    timer: 5,
    shuffleQuestions: true,
    shuffleAnswers: true,
    numberOfQuestions: "all",
    withTimer: false
  });

  const { getAuth, postAuth } = useAxios();

  const { t } = useTranslate();
  const { id = '' } = useParams();

  const router = useRouter();

  const { execute: fetchTotalQuestions, isLoading, data: totalQuestions } = usePromise(() =>
    getAuth<number>(endpoints.quiz.totalQuestions(id))
  );

  const { execute: createSession, isLoading: isCreating } = usePromise<string>(() =>
    postAuth(endpoints.quizSession.create, {
      quizId: id,
      shuffleQuestions: practiceConfig.shuffleQuestions,
      shuffleAnswers: practiceConfig.shuffleAnswers,
    })
  );

  const handleCreateSession = async () => {
    try {
      const sessionId = await createSession();
      const query = practiceConfig.withTimer ? `?time=${practiceConfig.timer}` : '';
      router.push(`${paths.session.host(sessionId)}${query}`);

    } catch (error) {
      console.error("Error creating quiz session", error);
    }
  }

  const handleStart = async () => {
    if (practiceMode === "multiplayer") {
      await handleCreateSession();
      return
    }

    try {
      await fetchTotalQuestions();
    } catch (error) {
      console.error('Error fetching total questions:', error);
    }
  };

  const renderSelectMode = () => (
    <>
      <Typography
        variant="h3"
        sx={{ fontWeight: 'bold', mb: 2, mt: 10 }}
      >
        {t('start-practice')}
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        {t('select-practice-mode')}
      </Typography>

      <Grid container spacing={3} justifyContent="center" sx={{ width: { xs: '100%', lg: '80%', xl: '60%' } }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <ActionCard
            title={t('singleplayer.title')}
            image={`${CONFIG.assetsDir}/assets/icons/activity/ic-single.png`}
            description={t('singleplayer.description')}
            onClick={() => setPracticeMode("singleplayer")}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <ActionCard
            title={t('multiplayer.title')}
            image={`${CONFIG.assetsDir}/assets/icons/activity/ic-group.png`}
            description={t('multiplayer.description')}
            onClick={() => setPracticeMode("multiplayer")}
          />
        </Grid>
      </Grid>
    </>
  )

  const renderConfig = () => (
    <>
      <Typography
        variant="h3"
        sx={{ fontWeight: 'bold', mb: 2, mt: 10 }}
      >
        {t('practice-mode-config.how-would-you-like')}
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        {t('practice-mode-config.adjust-the-settings')}
      </Typography>

      <Grid
        container
        justifyContent="center"
        direction="column"
        spacing={3}
        sx={{ width: { xs: '100%', lg: '60%' } }}>

        <Grid>
          <TextField
            value={t('practice-mode-config.shuffle-questions')}
            fullWidth
            InputProps={{
              readOnly: true,
              endAdornment: (
                <InputAdornment position="start">
                  <Switch
                    checked={practiceConfig.shuffleQuestions}
                    onChange={(e) => setPracticeConfig({ ...practiceConfig, shuffleQuestions: e.target.checked })}
                  />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid>
          <TextField
            value={t('practice-mode-config.shuffle-answers')}
            fullWidth
            InputProps={{
              readOnly: true,
              endAdornment: (
                <InputAdornment position="start">
                  <Switch
                    checked={practiceConfig.shuffleAnswers}
                    onChange={(e) => setPracticeConfig({ ...practiceConfig, shuffleAnswers: e.target.checked })}
                  />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid>
          <TextField
            value={t('practice-mode-config.with-timer')}
            fullWidth
            InputProps={{
              readOnly: true,
              endAdornment: (
                <InputAdornment position="start">
                  <Switch
                    checked={practiceConfig.withTimer}
                    onChange={(e) => setPracticeConfig({ ...practiceConfig, withTimer: e.target.checked })}
                  />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        {practiceConfig.withTimer && (
          <Grid>
            <Typography variant="body2" sx={{ mb: 1 }}>
              {t('practice-mode-config.timer-duration')}
            </Typography>
            <TextField
              fullWidth
              value={practiceConfig.timer ?? ""}
              onChange={(e) => {
                let newValue = e.target.value.replace(/[^0-9]/g, "");
                newValue = newValue ? Math.min(parseInt(newValue, 10), 1440).toString() : "";
                setPracticeConfig({ ...practiceConfig, timer: newValue ? parseInt(newValue, 10) : undefined });
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Iconify icon="icon-park-twotone:timer" />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Grid>
        )}

        <Grid>
          <Select
            fullWidth
            value={practiceConfig.numberOfQuestions}
            onChange={(e) => setPracticeConfig({
              ...practiceConfig,
              numberOfQuestions: e.target.value as "all" | "one"
            })}
          >
            <MenuItem value="all">{t('practice-mode-config.all-in-page')}</MenuItem>
            <MenuItem value="one">{t('practice-mode-config.one-in-page')}</MenuItem>
          </Select>
        </Grid>
        <Grid container justifyContent="center" spacing={3}>
          <Grid>
            <LoadingButton
              loading={isLoading || isCreating}
              variant="soft"
              color="primary"
              sx={{ width: '200px' }}
              onClick={handleStart}
            >
              {t('start')}
            </LoadingButton>
          </Grid>
        </Grid>

      </Grid>

    </>
  );


  return (
    <>
      {
        totalQuestions === undefined ?
          <FullScreenDialog onClose={() => router.push(paths.dashboard.library)}>
            {
              practiceMode === undefined ? renderSelectMode() : renderConfig()
            }
          </FullScreenDialog>
          :
          <>
            {
              practiceMode === "singleplayer" &&
              <QuizPracticeContent quizId={id} totalQuestions={totalQuestions} config={practiceConfig} />
            }
          </>
      }
    </>
  );
}

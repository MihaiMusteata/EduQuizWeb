import type { AIConfigParams } from "src/types/quiz";
import type {
  SelectChangeEvent
} from "@mui/material";

import { useState } from 'react';

import Button from "@mui/material/Button";
import {
  Select,
  MenuItem,
  TextField,
  InputLabel,
  Typography,
  FormControl,
  Grid2 as Grid
} from "@mui/material";

import { paths } from "src/routes/paths";
import { useRouter } from "src/routes/hooks";

import { allLangs, useTranslate } from "src/locales";
import { DashboardContent } from 'src/layouts/dashboard/content'

import { FullScreenDialog } from "src/components/dialog/full-screen-dialog";


type Props = {
  onGenerate: (config: AIConfigParams) => void;
}


export function QuizAIConfigDialog({ onGenerate }: Props) {
  const { currentLang, t } = useTranslate();
  const router = useRouter();

  const [config, setConfig] = useState<AIConfigParams>({
    subject: '',
    topic: '',
    numQuestions: "5",
    language: currentLang.value,
  });


  const selectLanguagesMenu = allLangs.map((lang) => ({
    label: lang.label,
    value: lang.value,
  }));

  return (
    <DashboardContent>
      <FullScreenDialog onClose={() => router.push(paths.dashboard.tools)}>
        <Typography
          variant="h3"
          sx={{ fontWeight: 'bold', mb: 2, mt: 10 }}
        >
          {t("generate-mode-config.title")}
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          {t("generate-mode-config.description")}
        </Typography>
        <Grid
          container
          justifyContent="center"
          direction="column"
          spacing={3}
          sx={{
            width: { xs: '100%', lg: '60%' }
          }}
        >

          <Grid>
            <TextField
              label={t("generate-mode-config.subject")}
              value={config.subject}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setConfig({ ...config, subject: e.target.value })
              }}
              fullWidth
            />
          </Grid>
          <Grid>
            <TextField
              label={t("generate-mode-config.topic")}
              value={config.topic}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setConfig({ ...config, topic: e.target.value })
              }}
              fullWidth
            />
          </Grid>
          <Grid>
            <FormControl fullWidth>
              <InputLabel>{t("generate-mode-config.language")}</InputLabel>
              <Select
                label={t("generate-mode-config.language")}
                value={config.language}
                onChange={(e: SelectChangeEvent<string>) => {
                  setConfig({ ...config, language: e.target.value })
                }}
                fullWidth
              >
                {
                  selectLanguagesMenu.map((lang) => (
                    <MenuItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </MenuItem>
                  ))
                }
              </Select>
            </FormControl>
          </Grid>
          <Grid>
            <FormControl fullWidth>
              <InputLabel>{t("generate-mode-config.number-of-questions")}</InputLabel>
              <Select
                label={t("generate-mode-config.number-of-questions")}
                value={config.numQuestions}
                onChange={(e: SelectChangeEvent<string>) => {
                  setConfig({ ...config, numQuestions: e.target.value })
                }}
                fullWidth
              >
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={15}>15</MenuItem>
                <MenuItem value={20}>20</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid container justifyContent="center">
              <Button
                sx={{ width: '200px'}}
                variant="contained"
                color="primary"
                onClick={() => onGenerate(config)}
              >
                {t('generate')}
              </Button>
          </Grid>
        </Grid>
      </FullScreenDialog>
    </DashboardContent>
  );
}

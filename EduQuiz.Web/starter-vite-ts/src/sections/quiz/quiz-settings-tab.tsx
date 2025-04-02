import type { Operation } from "src/types/operation";
import type { Quiz, Visibility } from "src/types/quiz";

import { LoadingButton } from "@mui/lab";
import {
  Box,
  Card,
  Radio,
  Container,
  TextField,
  Typography,
  RadioGroup,
  FormControlLabel
} from "@mui/material";

import { paths } from "src/routes/paths";
import { useRouter } from "src/routes/hooks";

import { useTranslate } from "src/locales";
import { usePromise } from "src/axios/hooks";

import { toast } from "src/components/snackbar";
import { Iconify } from "src/components/iconify";

type Props = {
  operation: Operation;
  action: () => Promise<any>;
  quiz: Quiz;
  setQuiz: (quiz: Quiz) => void;
}

export function QuizSettingsTab({ operation, action, quiz, setQuiz }: Props) {
  const { t } = useTranslate();
  const router = useRouter();
  const { execute: saveQuiz, isLoading } = usePromise(action);

  const onSubmit = async () => {
    try {
      await saveQuiz();
      router.push(paths.dashboard.library);
      if (operation === "create") {
        toast.success(t("quiz-created.success"));
      } else {
        toast.success(t("quiz-updated.success"));
      }
    } catch (error) {
      if (operation === "create") {
        toast.error(t("quiz-created.error"));
      } else {
        toast.error(t("quiz-updated.error"));
      }
      console.error("Error saving quiz", error);
    }
  };

  return (
    <Container sx={{ width: '100%' }}>
      <Card
        sx={{
          border: '1px solid #ddd',
          borderRadius: '10px',
          padding: 2,
          marginTop: 2
        }}
      >
        <TextField
          value={quiz.title}
          label={t('title')}
          fullWidth
          onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
          sx={{
            my: 2,
            '& .MuiInputBase-root': {
              backgroundColor: (theme) => theme.palette.background.default,
            }
          }}
        />
        <RadioGroup
          value={quiz.visibility}
          onChange={(e) => setQuiz({ ...quiz, visibility: e.target.value as Visibility })}
          sx={{ mt: 1 }}
        >
          <FormControlLabel
            value="public"
            control={
              <Radio
                sx={{
                  alignSelf: "flex-start",
                  padding: '2px 10px'
                }}
              />
            }
            label={
              <>
                <Box display="flex" flexDirection="row" alignItems="center">
                  <Typography variant="body1" fontWeight="bold" mr={1}>
                    {t("visibility.public.label")}
                  </Typography>
                  <Iconify width={16} icon="solar:lock-keyhole-minimalistic-unlocked-bold-duotone" />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {t("visibility.public.description")}
                </Typography>
              </>
            }
          />
          <FormControlLabel
            value="private"
            sx={{ my: 1 }}
            control={
              <Radio
                sx={{
                  alignSelf: "flex-start",
                  padding: '2px 10px'
                }}
              />
            }
            label={
              <>
                <Box display="flex" flexDirection="row" alignItems="center">
                  <Typography variant="body1" fontWeight="bold" mr={1}>
                    {t('visibility.private.label')}
                  </Typography>
                  <Iconify width={16} icon="solar:lock-keyhole-minimalistic-bold-duotone" />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {t('visibility.private.description')}
                </Typography>
              </>
            }
          />
        </RadioGroup>
        <Box display="flex" justifyContent="flex-end">
          <LoadingButton
            variant="contained"
            color="primary"
            onClick={onSubmit}
            loading={isLoading}
          >
            {t("save")}
          </LoadingButton>
        </Box>
      </Card>
    </Container>
  );
}

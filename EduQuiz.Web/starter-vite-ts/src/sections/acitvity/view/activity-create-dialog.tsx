import { useState } from "react";

import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Grid2 as Grid, DialogActions, DialogContent } from "@mui/material";

import { useRouter } from "src/routes/hooks";

import { useTranslate } from "src/locales";
import { CONFIG } from "src/global-config";

import { ActionCard } from "src/components/action-card";

import { QuizCreateView } from "src/sections/quiz/view";
import { FlashcardDeckCreateView } from "src/sections/flashcard-deck/view";

export function ActivityCreateDialog() {
  const [activityType, setActivityType] = useState<string | undefined>(undefined);
  const [open, setOpen] = useState<boolean>(true);
  const router = useRouter();
  const { t } = useTranslate('activity');
  const onClose = () => {
    setOpen(false);
    router.back();
  };

  const renderContent = () => (
    <>
      <Typography
        variant="h3"
        sx={{ fontWeight: 'bold', mb: 2, mt: 10 }}
      >
        {t('generate-new-activity')}
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        {t('select-activity-type')}
      </Typography>

      <Grid container spacing={3} justifyContent="center" sx={{ width: { xs: '100%', lg: '80%', xl: '60%' } }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <ActionCard
            title="Quiz"
            image={`${CONFIG.assetsDir}/assets/icons/activity/ic-quiz.png`}
            description={t('test-your-knowledge')}
            onClick={() => setActivityType('quiz')}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <ActionCard
            title="Flash Cards"
            image={`${CONFIG.assetsDir}/assets/icons/activity/ic-flash-cards.png`}
            description={t('learn-with-flash-cards')}
            onClick={() => setActivityType('flashcards')}
          />
        </Grid>
      </Grid>
    </>
  );


  return (
    <Dialog
      fullScreen
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDialogContent-root': {
          backgroundColor: (theme) => theme.palette.background.default,
        },
      }}
    >

      <DialogContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'center',
          textAlign: 'left',
          position: 'relative',
        }}
      >

        {
          activityType === undefined &&
          renderContent()
        }

        {
          activityType === 'quiz' && (
            <QuizCreateView />
          )
        }

        {
          activityType === 'flashcards' && (
            <FlashcardDeckCreateView />
          )
        }

      </DialogContent>
      <DialogActions sx={{ py: 2, px: 3 }}>
        <Button variant="outlined" color="inherit" onClick={onClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}

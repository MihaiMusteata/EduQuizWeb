import { useState } from "react";

import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { DialogActions, DialogContent, Grid } from "@mui/material";

import { CONFIG } from "../../global-config";
import { useTranslate } from "../../locales";
import { useRouter } from "../../routes/hooks";
import { QuizCreateView } from "./view/quiz-create-view";
import { ActionCard } from "../../components/action-card";

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
        <Grid item xs={12} md={6}>
          <ActionCard
            title="Quiz"
            image={`${CONFIG.assetsDir}/assets/icons/activity/ic-quiz.png`}
            description={t('test-your-knowledge')}
            onClick={() => setActivityType('quiz')}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <ActionCard
            title="Flash Card"
            image={`${CONFIG.assetsDir}/assets/icons/activity/ic-flash-cards.png`}
            description={t('learn-with-flash-cards')}
            onClick={() => setActivityType('flash-card')}
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

        {activityType === 'quiz' && (
          <QuizCreateView />
        )}

      </DialogContent>
      <DialogActions sx={{ py: 2, px: 3 }}>
        <Button variant="outlined" color="inherit" onClick={onClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
    ;
}

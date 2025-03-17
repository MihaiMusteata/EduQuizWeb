import { Grid2 as Grid } from "@mui/material";
import Typography from "@mui/material/Typography";

import { paths } from "src/routes/paths";
import { useRouter } from "src/routes/hooks";

import { useTranslate } from "src/locales";
import { CONFIG } from "src/global-config";

import { ActionCard } from "src/components/action-card";
import { FullScreenDialog } from "src/components/dialog/full-screen-dialog";


export function ActivityCreateDialog() {
  const router = useRouter();
  const { t } = useTranslate('activity');

  return (
    <FullScreenDialog>
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
            onClick={() => router.push(paths.activity.quiz.new)}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <ActionCard
            title="Flash Cards"
            image={`${CONFIG.assetsDir}/assets/icons/activity/ic-flash-cards.png`}
            description={t('learn-with-flash-cards')}
            onClick={() => router.push(paths.activity.flashcards.new)}
          />
        </Grid>
      </Grid>
    </FullScreenDialog>
  );
}

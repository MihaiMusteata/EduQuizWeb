import { TFunction } from "i18next";
import { varAlpha } from "minimal-shared/utils";

import { Grid, Box, Typography } from "@mui/material";

import { DashboardContent } from 'src/layouts/dashboard';

import { CONFIG } from "../../../global-config";
import { useTranslate } from "../../../locales";
import { useRouter } from "../../../routes/hooks";
import { ActionCard } from "../../../components/action-card";

// ----------------------------------------------------------------------

const tools = (t: TFunction, router: any) => [
  {
    title: t('tools.manual-quiz.title'),
    image: `${CONFIG.assetsDir}/assets/icons/activity/ic-manual.png`,
    description: t('tools.manual-quiz.description'),
    onClick: () => {
      router.push('/create')
    }
  }
];

export function ToolsView() {
  const { t } = useTranslate('tools-page');
  const router = useRouter();

  return (
    <DashboardContent maxWidth="xl" sx={{
      borderTop: (theme) => ({
        lg: `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.12)}`,
      }),
    }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h4" sx={{ mb: 1 }}>
          {t('title')}
        </Typography>
        <Typography
          sx={{ color: 'text.secondary' }}
        >{t('description')}🚀</Typography>
      </Box>
      <Grid container spacing={3}>
        {
          tools(t, router).map((card, index) => (
            <>
              <Grid item xs={12} md={6} lg={6} xl={4} key={index}>
                <ActionCard {...card} />
              </Grid>
            </>
          ))
        }
      </Grid>
    </DashboardContent>
  );
}

import type { TFunction } from "i18next";

import { Box, Divider, Typography, Grid2 as Grid } from "@mui/material";

import { paths } from "src/routes/paths";
import { useRouter } from "src/routes/hooks";

import { CONFIG } from "src/global-config";
import { useTranslate } from "src/locales";
import { DashboardContent } from 'src/layouts/dashboard';

import { ActionCard } from "../../../components/action-card";

// ----------------------------------------------------------------------

const tools = (t: TFunction, router: any) => [
  {
    title: t('tools.manual-activity.title'),
    image: `${CONFIG.assetsDir}/assets/icons/activity/ic-manual.png`,
    description: t('tools.manual-activity.description'),
    onClick: () => {
      router.push(paths.activity.create);
    }
  },
  {
    title: t('tools.ai-activity.title'),
    image: `${CONFIG.assetsDir}/assets/icons/activity/ic-ai.png`,
    description: t('tools.ai-activity.description'),
    onClick: () => {
      router.push(paths.activity.generate);
    }
  }
];

export function ToolsView() {
  const { t } = useTranslate('pages');
  const router = useRouter();

  return (
    <DashboardContent>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h4" sx={{ mb: 1 }}>
          {t('tools-page.title')}
        </Typography>
        <Typography
          sx={{ color: 'text.secondary' }}
        >{t('tools-page.description')}🚀</Typography>
      </Box>
      <Divider sx={{ mb: 5 }} />
      <Grid container spacing={3}>
        {
          tools(t, router).map((card, index) => (
            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={index}>
                <ActionCard {...card} />
              </Grid>
          ))
        }
      </Grid>
    </DashboardContent>
  );
}

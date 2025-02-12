import { useCallback, useState } from "react";
import { varAlpha } from "minimal-shared/utils";

import { Tab, Tabs, Container } from "@mui/material";

import { useTranslate } from "../../../locales";
import { QuizEditorTab } from "./quiz-editor-tab";
import { QuizSettingsTab } from "./quiz-settings-tab";

export function QuizCreateView() {
  const { t } = useTranslate('common');

  const [currentTab, setCurrentTab] = useState('Editor');

  const handleChangeTab = useCallback((event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  }, []);

  return (
    <Container sx={{ width: { xs: '100%', lg: '70%', xl: '60%' } }}>
      <Tabs
        value={currentTab}
        onChange={handleChangeTab}
        sx={[
          (theme) => ({
            px: 2.5,
            boxShadow: `inset 0 -2px 0 0 ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
          }),
        ]}
      >
        <Tab
          iconPosition="end"
          value="Editor"
          label={t('editor')}
        />
        <Tab
          iconPosition="end"
          value="Settings"
          label={t('settings')}
        />
      </Tabs>
      {
        currentTab === 'Editor' &&
        <QuizEditorTab />
      }
      {
        currentTab === 'Settings' &&
        <QuizSettingsTab />
      }
    </Container>

  );
}

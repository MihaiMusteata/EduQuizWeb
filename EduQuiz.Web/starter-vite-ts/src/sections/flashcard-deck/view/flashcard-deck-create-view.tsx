import { useState, useCallback } from "react";
import { varAlpha } from "minimal-shared/utils";

import { Tab, Tabs, Container } from "@mui/material";

import { paths } from "../../../routes/paths";
import { useAxios } from "../../../axios/hooks";
import { useTranslate } from "../../../locales";
import { useRouter } from "../../../routes/hooks";
import { endpoints } from "../../../axios/endpoints";
import { FlashcardDeckEditorTab } from "../flashcard-deck-editor-tab";
import { FlashcardDeckSettingsTab } from "../flashcard-deck-settings-tab";

import type { Flashcard, FlashcardDeck } from "../../../types/flashcard";

export function FlashcardDeckCreateView() {
  const { t } = useTranslate('common');
  const router = useRouter();

  const { postAuth } = useAxios();
  const [currentTab, setCurrentTab] = useState('Editor');
  const [flashcardDeck, setFlashcardDeck] = useState<FlashcardDeck>({
    title: '',
    visibility: 'public',
    flashcards: [],
  });

  const handleChangeTab = useCallback((event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  }, []);

  const handleSetFlashcards = (flashcards: Flashcard[]) => {
    setFlashcardDeck({ ...flashcardDeck, flashcards });
  };

  const handleSave = async () => {
    await postAuth(endpoints.flashcardDeck.create, flashcardDeck)
      .then((response) => {
        router.push(paths.dashboard.library);
      })
      .catch((error) => {
        console.error('Error creating flashcard deck', error);
      });
  };

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
        <FlashcardDeckEditorTab flashcards={flashcardDeck.flashcards} setFlashcards={handleSetFlashcards} />
      }
      {
        currentTab === 'Settings' &&
        <FlashcardDeckSettingsTab onSubmit={handleSave} flashcardDeck={flashcardDeck} setFlashcardDeck={setFlashcardDeck} />
      }
    </Container>
  );
}

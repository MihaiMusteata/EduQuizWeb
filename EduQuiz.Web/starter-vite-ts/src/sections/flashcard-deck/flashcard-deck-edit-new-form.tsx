import type { Flashcard, FlashcardDeck } from "src/types/flashcard";

import { useState, useCallback } from "react";
import { varAlpha } from "minimal-shared/utils";

import { Tab, Tabs, Container } from "@mui/material";

import { paths } from "src/routes/paths";
import { useRouter } from "src/routes/hooks";

import { useAxios } from "src/axios/hooks";
import { useTranslate } from "src/locales";
import { endpoints } from "src/axios/endpoints";

import { FlashcardDeckEditorTab } from "./flashcard-deck-editor-tab";
import { FlashcardDeckSettingsTab } from "./flashcard-deck-settings-tab";

type Props = {
  currentFlashcardDeck?: FlashcardDeck;
}

export function FlashcardDeckEditNewForm({ currentFlashcardDeck }: Props) {
  const { t } = useTranslate('common');
  const router = useRouter();

  const { postAuth, putAuth } = useAxios();
  const [currentTab, setCurrentTab] = useState('Editor');
  const [flashcardDeck, setFlashcardDeck] = useState<FlashcardDeck>(currentFlashcardDeck ?? {
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
    try{
      if(currentFlashcardDeck) {
        await putAuth(endpoints.flashcardDeck.update, flashcardDeck);
      } else {
        await postAuth(endpoints.flashcardDeck.create, flashcardDeck);
      }

      router.push(paths.dashboard.library);
    } catch (error) {
      console.error("Error saving flashcard deck", error);
    }
  };

  return (
    <Container sx={{ width: { xs: '100%', lg: '70%', xl: '60%' }, padding: { xs: '0' } }}>
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

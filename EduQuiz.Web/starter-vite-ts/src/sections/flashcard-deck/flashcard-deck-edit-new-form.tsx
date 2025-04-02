import type { Flashcard, FlashcardDeck } from "src/types/flashcard";

import { useState, useCallback } from "react";
import { varAlpha } from "minimal-shared/utils";

import { Tab, Tabs, Container } from "@mui/material";

import { useTranslate } from "src/locales";
import { useAxios } from "src/axios/hooks";
import { endpoints } from "src/axios/endpoints";

import { FlashcardDeckEditorTab } from "./flashcard-deck-editor-tab";
import { FlashcardDeckSettingsTab } from "./flashcard-deck-settings-tab";

import type { Operation } from "../../types/operation";

type Props = {
  operation: Operation;
  currentFlashcardDeck?: FlashcardDeck;
}

export function FlashcardDeckEditNewForm({ currentFlashcardDeck, operation }: Props) {
  const { t } = useTranslate();

  const { postAuth, patchAuth } = useAxios();
  const [currentTab, setCurrentTab] = useState('Editor');
  const [flashcardDeck, setFlashcardDeck] = useState<FlashcardDeck>(currentFlashcardDeck ?? {
    title: '',
    visibility: 'public',
    flashcards: [],
  });

  const saveAction = () => {
    if (operation === "create") {
      return () => postAuth(endpoints.flashcardDeck.create, flashcardDeck);
    } else {
      return () => patchAuth(endpoints.flashcardDeck.update, flashcardDeck);
    }
  };

  const handleChangeTab = useCallback((event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  }, []);

  const handleSetFlashcards = (flashcards: Flashcard[]) => {
    setFlashcardDeck({ ...flashcardDeck, flashcards });
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
        <FlashcardDeckEditorTab
          flashcardDeckOperation={operation}
          flashcards={flashcardDeck.flashcards}
          setFlashcards={handleSetFlashcards}
        />
      }
      {
        currentTab === 'Settings' &&
        <FlashcardDeckSettingsTab
          operation={operation}
          action={saveAction()}
          flashcardDeck={flashcardDeck}
          setFlashcardDeck={setFlashcardDeck}
        />
      }
    </Container>
  );
}

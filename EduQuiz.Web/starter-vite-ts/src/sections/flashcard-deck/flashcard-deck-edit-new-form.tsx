import type { Operation } from "src/types/operation";
import type { Flashcard, FlashcardDeck, AIConfigParams } from "src/types/flashcard";

import { useState, useCallback } from "react";
import { varAlpha } from "minimal-shared/utils";
import { useBoolean } from "minimal-shared/hooks";

import { Tab, Tabs, Container } from "@mui/material";

import { useSearchParams } from "src/routes/hooks";

import { useTranslate } from "src/locales";
import { useAxios } from "src/axios/hooks";
import { endpoints } from "src/axios/endpoints";

import { FlashcardDeckEditorTab } from "./flashcard-deck-editor-tab";
import { FlashcardDeckSettingsTab } from "./flashcard-deck-settings-tab";
import { FlashcardDeckAIConfigDialog } from "./flashcard-deck-ai-config-dialog";


type Props = {
  operation: Operation;
  currentFlashcardDeck?: FlashcardDeck;
}

export function FlashcardDeckEditNewForm({ currentFlashcardDeck, operation }: Props) {
  const { t } = useTranslate();
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode') || 'manual';
  const openAIDialog = useBoolean(true);

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

  const handleGenerate = async (config: AIConfigParams) => {
    openAIDialog.onFalse();
    try {
      const response = await fetch("http://localhost:8001/api/ai/flashcard/generate", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });

      if (!response.ok) {
        throw new Error('Failed to generate flashcards');
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Failed to read response stream');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');

        for (let i = 0; i < lines.length - 1; i++) {
          const line = lines[i].trim();
          if (line) {
            try {
              const flashcard: Flashcard = JSON.parse(line);
              setFlashcardDeck((prevFlashcardDeck) => ({
                ...prevFlashcardDeck,
                flashcards: [...prevFlashcardDeck.flashcards, flashcard],
              }));
            } catch (error) {
              console.error('Failed to parse flashcard:', error);
            }
          }
        }

        buffer = lines[lines.length - 1];
      }

      if (buffer.trim()) {
        try {
          const flashcard: Flashcard = JSON.parse(buffer.trim());
          setFlashcardDeck((prevFlashcardDeck) => ({
            ...prevFlashcardDeck,
            flashcards: [...prevFlashcardDeck.flashcards, flashcard],
          }));
        } catch (error) {
          console.error('Failed to parse final flashcard:', error);
        }
      }
    } catch (error) {
      console.error('Error generating quiz:', error);
    }
  };

  return (
    <>
      {
        mode === 'ai' && openAIDialog.value ?
          <FlashcardDeckAIConfigDialog
            onGenerate={handleGenerate}
          />
          :
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
      }
    </>
  );
}

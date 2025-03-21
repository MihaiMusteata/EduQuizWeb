import type { Visibility } from "src/types/quiz";
import type { FlashcardDeck } from "src/types/flashcard";

import {
  Box,
  Card,
  Radio,
  Button,
  Container,
  TextField,
  Typography,
  RadioGroup,
  FormControlLabel
} from "@mui/material";

import { useTranslate } from "src/locales";

import { Iconify } from "../../components/iconify";

type Props = {
  flashcardDeck: FlashcardDeck;
  setFlashcardDeck: (flashcardDeck: FlashcardDeck) => void;
  onSubmit: () => void;
}

export function FlashcardDeckSettingsTab({ onSubmit, flashcardDeck, setFlashcardDeck }: Props) {
  const { t } = useTranslate();

  return (
    <Container sx={{ width: '100%' }}>
      <Card
        sx={{
          border: '1px solid #ddd',
          borderRadius: '10px',
          padding: 2,
          marginTop: 2
        }}
      >
        <TextField
          value={flashcardDeck.title}
          label={t('title')}
          fullWidth
          onChange={(e) => setFlashcardDeck({ ...flashcardDeck, title: e.target.value })}
          sx={{
            my: 2,
            '& .MuiInputBase-root': {
              backgroundColor: (theme) => theme.palette.background.default,
            }
          }}
        />
        <RadioGroup
          value={flashcardDeck.visibility}
          onChange={(e) => setFlashcardDeck({ ...flashcardDeck, visibility: e.target.value as Visibility })}
          sx={{ mt: 1 }}
        >
          <FormControlLabel
            value="public"
            control={
              <Radio
                sx={{
                  alignSelf: "flex-start",
                  padding: '2px 10px'
                }}
              />
            }
            label={
              <>
                <Box display="flex" flexDirection="row" alignItems="center">
                  <Typography variant="body1" fontWeight="bold" mr={1}>
                    {t("visibility.public.label")}
                  </Typography>
                  <Iconify width={16} icon="solar:lock-keyhole-minimalistic-unlocked-bold-duotone" />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {t("visibility.public.description")}
                </Typography>
              </>
            }
          />
          <FormControlLabel
            value="private"
            sx={{ my: 1 }}
            control={
              <Radio
                sx={{
                  alignSelf: "flex-start",
                  padding: '2px 10px'
                }}
              />
            }
            label={
              <>
                <Box display="flex" flexDirection="row" alignItems="center">
                  <Typography variant="body1" fontWeight="bold" mr={1}>
                    {t('visibility.private.label')}
                  </Typography>
                  <Iconify width={16} icon="solar:lock-keyhole-minimalistic-bold-duotone" />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {t('visibility.private.description')}
                </Typography>
              </>
            }
          />
        </RadioGroup>
        <Box display="flex" justifyContent="flex-end">
          <Button variant="contained" color="primary" onClick={onSubmit}>
            {t("save")}
          </Button>
        </Box>
      </Card>
    </Container>
  );
}

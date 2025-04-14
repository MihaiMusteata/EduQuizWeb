import type { Flashcard } from "src/types/flashcard";
import type { Operation } from "src/types/operation";

import Divider from "@mui/material/Divider";
import EditIcon from '@mui/icons-material/Edit';
import {
  Box,
  Card,
  Tooltip,
  Typography,
  IconButton, CircularProgress,
} from '@mui/material';

import { useDeleteFlashcard } from "src/actions/flashcard";

import { Iconify } from "src/components/iconify";

import { useTranslate } from "../../../locales";

type FlashcardViewProps = {
  index: number;
  flashcard: Flashcard;
  onEdit: () => void;
  editorProps: {
    flashcardDeckOperation: Operation;
    flashcards: Flashcard[];
    setFlashcards: (flashcards: Flashcard[]) => void;
  }
};

export function FlashcardView({ index, flashcard, onEdit, editorProps }: FlashcardViewProps) {
  const { t } = useTranslate();
  const { deleteFlashcard, isDeleting } = useDeleteFlashcard(editorProps);

  const renderFlashcard = (side: "front" | "back", text: string) => (
    <Box sx={{ flex: 1, padding: '10px' }}>
      <Typography variant="subtitle2" sx={{ opacity: 0.7, mb: 1 }}>{t(`${side}-side-text`)}</Typography>
      <Box
        sx={{
          backgroundColor: (theme) => theme.palette.background.default,
          borderRadius: '10px',
          padding: '16px',
          height: '200px',
        }}
      >
        <Typography variant="h6">{text}</Typography>
      </Box>
    </Box>
  )
  return (
    <Card
      sx={{
        borderRadius: '10px',
        padding: '20px 20px 10px 20px',
        marginTop: 2
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          flexDirection: { xs: 'column', sm: 'row' }
        }}
      >
        {
          renderFlashcard('front', flashcard.frontSideText)
        }
        {
          renderFlashcard('back', flashcard.backSideText)
        }
      </Box>
      <Divider />
      <Box sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center' }}>
        <Tooltip title="Edit flashcard" arrow>
          <IconButton onClick={onEdit}>
            <EditIcon fontSize='small' />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete flashcard" arrow>
          <IconButton onClick={() => deleteFlashcard(index)} disabled={isDeleting}>
            {
              isDeleting ?
                <CircularProgress size={20} />
                :
                <Iconify width={20} icon="solar:trash-bin-trash-bold" />
            }
          </IconButton>
        </Tooltip>
      </Box>
    </Card>
  );
}

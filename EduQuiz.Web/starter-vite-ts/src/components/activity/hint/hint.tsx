import { useBoolean } from "minimal-shared/hooks";

import { Button, Dialog, IconButton, Typography, DialogTitle, DialogActions, DialogContent } from "@mui/material";

import { Iconify } from "src/components/iconify";

import type { HintProps } from "./types";

export function Hint({ text, t }: HintProps) {
  const openDialog = useBoolean();
  return (
    <>
      <IconButton edge="end" onClick={openDialog.onTrue}>
        <Iconify icon="solar:lightbulb-minimalistic-bold" sx={{ color: 'warning.light' }} />
      </IconButton>
      <Dialog
        open={openDialog.value}
        onClose={openDialog.onFalse}
        BackdropProps={{
          style: { backgroundColor: 'rgba(0, 0, 0, 0.5)' }
        }}
      >
        <DialogTitle>{t('hint')}</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            {text}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button variant='soft' onClick={openDialog.onFalse} color="info">OK</Button>
        </DialogActions>
      </Dialog>
    </>
  )
};

import { useBoolean } from "minimal-shared/hooks";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";

export type FullScreenDialogProps = {
  children: React.ReactNode;
  onClose?: () => void;
};

export function FullScreenDialog({ children, onClose }: FullScreenDialogProps) {
  const openDialog = useBoolean(true);
  const handleClose = () => {
    openDialog.onFalse();
    if (onClose) {
      onClose();
    }
  };
  return (
    <Dialog
      fullScreen
      open={openDialog.value}
      onClose={openDialog.onFalse}
      disableEscapeKeyDown
      disableEnforceFocus
      sx={{
        '& .MuiDialogContent-root': {
          backgroundColor: (theme) => theme.palette.background.default,
        },
      }}
    >
      <DialogContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'center',
          textAlign: 'left',
          position: 'relative',
        }}
      >
        {children}
      </DialogContent>
      <DialogActions sx={{ py: 2, px: 3 }}>
        <Button variant="outlined" color="inherit" onClick={handleClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}

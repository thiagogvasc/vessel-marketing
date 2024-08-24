import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
} from "@mui/material";

interface ConfirmStatusChangeDialogProps {
  open: boolean;
  status: string;
  notifyClient: boolean;
  onConfirm: (confirm: boolean) => void;
  onCancel: () => void;
  setNotifyClient: (notify: boolean) => void;
  comment: string;
  setComment: (comment: string) => void;
}

const ConfirmStatusChangeDialog: React.FC<ConfirmStatusChangeDialogProps> = ({
  open,
  status,
  notifyClient,
  onConfirm,
  onCancel,
  setNotifyClient,
  comment,
  setComment,
}) => {
  return (
    <Dialog open={open} onClose={() => onConfirm(false)}>
      <DialogTitle>Confirm Status Change</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to change the status to `{status}`?
        </DialogContentText>
        <FormControlLabel
          control={
            <Checkbox
              checked={notifyClient}
              onChange={(e) => setNotifyClient(e.target.checked)}
              color="primary"
            />
          }
          label="Notify client via email"
        />
        <TextField
          autoFocus
          margin="dense"
          id="comment"
          label="Comment"
          type="text"
          fullWidth
          multiline
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onCancel()}>Cancel</Button>
        <Button onClick={() => onConfirm(true)} color="primary">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmStatusChangeDialog;

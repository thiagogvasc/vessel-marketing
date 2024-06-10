import React, { useState } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Checkbox,
  FormControlLabel,
} from '@mui/material';

interface ConfirmStatusChangeDialogProps {
  open: boolean;
  status: string;
  notifyClient: boolean;
  onConfirm: (confirm: boolean, notifyClient: boolean) => void;
  onCancel: () => void;
  setNotifyClient: (value: boolean) => void;
}

const ConfirmStatusChangeDialog: React.FC<ConfirmStatusChangeDialogProps> = ({
  open,
  status,
  notifyClient,
  onConfirm,
  onCancel,
  setNotifyClient,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{"Change Request Status"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Are you sure you want to change the status of this request to `{status}`?
        </DialogContentText>
        <FormControlLabel
          control={
            <Checkbox
              checked={notifyClient}
              onChange={(e) => setNotifyClient(e.target.checked)}
            />
          }
          label="Notify client by email"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onConfirm(false, notifyClient)} color="primary">
          Cancel
        </Button>
        <Button onClick={() => onConfirm(true, notifyClient)} color="primary" autoFocus>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmStatusChangeDialog;

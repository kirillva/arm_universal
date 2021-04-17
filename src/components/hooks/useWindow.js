import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";

export const useWindow = () => {
  const [open, setOpen] = useState(false);

  return {
    setWindowOpen: setOpen,
    Window: ({ title, children, buttons }) => {
      return (
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">{title}</DialogTitle>
          <DialogContent>{children}</DialogContent>
          <DialogActions>
            {buttons}
          </DialogActions>
        </Dialog>
      );
    },
  };
};

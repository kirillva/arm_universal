import React from "react";
import { Paper, DialogContent, DialogTitle, Dialog } from "@material-ui/core";

const PaperComponent = (props) => {
  const { ...paperProps } = props;

  return <Paper {...paperProps} />;
};

export const Window = ({
  className,
  children,
  open,
  setOpen,
  title = "Сообщение",
}) => {
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog
      maxWidth="lg"
      PaperProps={{ className }}
      PaperComponent={PaperComponent}
      open={open}
      onClose={handleClose}
      aria-labelledby="draggable-dialog-title"
    >
      <DialogTitle
        id="draggable-dialog-title"
      >
        {title}
      </DialogTitle>
      <DialogContent>{children}</DialogContent>
    </Dialog>
  );
};

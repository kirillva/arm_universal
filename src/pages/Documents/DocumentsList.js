import React from "react";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    makeStyles,
  } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    toolbar: theme.mixins.toolbar,
    content: {
      overflow: "auto",
      flexGrow: 1,
      display: "flex",
      flexDirection: "column",
      padding: theme.spacing(3),
    },
    table: {
      flex: 1,
    },
}));
  
export const DocumentsList = ({ text, open, onClose }) => {  
  const classes = useStyles();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="form-dialog-title"
      PaperProps={{ className: classes.Paper }}
      maxWidth="calc(100% - 60px)"
    >
      <DialogTitle id="form-dialog-title">Найденные заявления</DialogTitle>
      <DialogContent>
        
      </DialogContent>
      <DialogActions>
        
      </DialogActions>
    </Dialog>
  );
};

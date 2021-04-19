import React, { useEffect } from "react";
import {
  Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    makeStyles,
  } from "@material-ui/core";
import { runRpc, runRpcRecords } from "utils/rpc";
  
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

  useEffect(()=>{
    runRpcRecords({
      action: "cf_arm_dd_documents_search",
      method: "Select",
      data: [
        {
          params: [text]
        },
      ],
      type: "rpc",
    }).then((records)=>{
      console.log('records', records)
    });
    
  }, [text]);

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
        {text}
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="primary" onClick={onClose}>Закрыть</Button>
      </DialogActions>
    </Dialog>
  );
};

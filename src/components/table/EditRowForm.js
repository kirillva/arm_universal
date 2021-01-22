import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  makeStyles,
  TableHead,
  TextField,
} from "@material-ui/core";
import { runRpc } from "utils/rpc";

const useStyles = makeStyles((theme) => ({
  dialogContent: {
    display: "grid",
    columnGap: theme.spacing(1),
    gridTemplateColumns: "1fr 1fr",
  },
}));

export const EditRowForm = ({
  title,
  action,
  idProperty,
  setSelectedRow,
  selectedRow,
  columns
}) => {
  const classes = useStyles();

  function updateSelectedRow() {
    console.log(selectedRow);
    debugger;
    // runRpc({
    //   action: action,
    //   method: "Update",
    //   data: [
    //     {
    //       data: [{}],
    //     },
    //   ],
    //   type: "rpc",
    // }).then((responce) => {
    //   if (responce.meta && responce.meta.success) {
    //     const _records = responce.result.records;
    //   } else {
    //   }
    // });
  }

  return (
    <Dialog onClose={() => setSelectedRow(null)} open={Boolean(selectedRow)}>
      <DialogTitle>Редактирование {title}</DialogTitle>
      {selectedRow ? selectedRow.original[idProperty] : ""}
      <DialogContent className={classes.dialogContent}>
        {columns.map((item) => {
          return (
            <TextField
              variant="outlined"
              margin="dense"
              label={item.title}
              value={selectedRow ? selectedRow.original[item.accessor] : ""}
            />
          );
        })}
      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          variant="contained"
          // disabled={!Boolean(addField)}
          onClick={updateSelectedRow}
        >
          Сохранить
        </Button>
      </DialogActions>
    </Dialog>
  );
};

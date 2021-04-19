import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  makeStyles,
  Typography,
} from "@material-ui/core";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
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
  item: {
    cursor: "pointer",
  },
  itemTitle: {
    cursor: "pointer",
    textDecoration: "underline",
  },
}));

export const DocumentsList = ({ onSelect, text, open, onClose }) => {
  const classes = useStyles();
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    runRpcRecords({
      action: "cf_arm_dd_documents_search",
      method: "Select",
      data: [
        {
          params: [text],
          filter: [
            {
              property: "sn_delete",
              value: false,
              operator: "=",
            },
          ],
          limit: 10,
        },
      ],
      type: "rpc",
    }).then((records) => {
      setDocuments(records);
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
        <List className={classes.root}>
          {documents.map((item) => {
            const { id, c_fio, c_address, c_notice, c_account } = item;
            return (
              <ListItem className={classes.item}>
                <ListItemText
                  primaryTypographyProps={{
                    className: classes.itemTitle,
                  }}
                  onClick={()=>onSelect(id)}
                  primary={`${c_fio} ${c_address}`}
                  secondary={`${c_notice} ${c_account}`}
                />
              </ListItem>
            );
          })}
        </List>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="primary" onClick={onClose}>
          Закрыть
        </Button>
      </DialogActions>
    </Dialog>
  );
};

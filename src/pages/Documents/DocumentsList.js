import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  LinearProgress,
  makeStyles,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { runRpc, runRpcRecords } from "utils/rpc";
import SearchIcon from "@material-ui/icons/Search";
import useDebounce from "components/hooks/useDebounce";
import { Clear } from "@material-ui/icons";
import moment from "moment";

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
  Paper: {
    width: "calc(100% - 40px)",
    height: "calc(100% - 40px)",
    maxWidth: "calc(100% - 60px)",
    // padding: theme.spacing(3),
  },
  searchToolbar: {
    display: "flex",
    flexDirection: "row",
    gap: "15px",
    // margin: "0 24px 0 0",
    alignItems: "center",
  },
  searchField: {
    flex: 1,
  },
  title: {
    flex: 1,
    margin: "0 0 0 15px",
  },
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  }
}));

export const DocumentsList = ({ onSelect, setOpen, open, onClose }) => {
  const classes = useStyles();
  const [documents, setDocuments] = useState([]);
  const [text, setText] = useState("");
  const deferredText = useDebounce(text, 1000);
  const [loading, setLoading] = useState(false);

  const buttons = useMemo(
    () => (
      <div className={classes.searchToolbar}>
        <TextField
          variant="outlined"
          className={classes.searchField}
          size="small"
          margin="none"
          value={text}
          placeholder="Поиск заявлений..."
          onChange={(e) => setText(e.target.value)}
          InputProps={{
            endAdornment: (
              <IconButton
                classes={{
                  root: classes.root,
                }}
                onClick={() => {
                  setText("");
                }}
              >
                <Clear fontSize="small" />
              </IconButton>
            ),
          }}
        />
      </div>
    ),
    [text]
  );

  useEffect(() => {
    if (deferredText) {
      setLoading(true);
      runRpcRecords({
        action: "cf_arm_dd_documents_search",
        method: "Select",
        data: [
          {
            params: [deferredText],
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
      })
        .then((records) => {
          setDocuments(records);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [deferredText]);

  return (
    <Dialog
      open={open}
      onClose={() => {
        setText("");
        onClose();
      }}
      aria-labelledby="form-dialog-title"
      PaperProps={{ className: classes.Paper }}
    >
      <DialogTitle id="form-dialog-title">Поиск заявлений</DialogTitle>
      <DialogContent>
        {buttons}
        {loading ? (
          <CircularProgress />
        ) : (
          <List className={classes.root}>
            {documents.length ? (
              documents.map((item) => {
                const {
                  id,
                  c_fio,
                  c_address,
                  d_date,
                  c_notice,
                  c_account,
                  n_number,
                } = item;
                const jb_child = JSON.parse(item.jb_child);
                return (
                  <Paper>
                    <ListItem className={classes.item}>
                      <ListItemText
                        primaryTypographyProps={{
                          className: classes.itemTitle,
                        }}
                        onClick={() => onSelect(id)}
                        primary={`№${n_number}; ${moment(d_date).format(
                          "DD.MM.YYYY"
                        )}; ${c_fio};`}
                        secondary={`${c_address}; ${c_account}; ${c_notice}`}
                      />
                    </ListItem>
                    <List>
                      <ListItem className={classes.item}>
                        {jb_child.map((item) => {
                          const { c_address, c_fio, d_birthday } = item;
                          return (
                            <ListItemText
                              primary={`${c_fio} ${moment(d_birthday).format(
                                "DD.MM.YYYY"
                              )}`}
                              secondary={c_address}
                            />
                          );
                        })}
                      </ListItem>
                    </List>
                  </Paper>
                );
              })
            ) : (
              <Typography>Заявления не найдены</Typography>
            )}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setText("");
            onClose();
          }}
        >
          Закрыть
        </Button>
      </DialogActions>
    </Dialog>
  );
};

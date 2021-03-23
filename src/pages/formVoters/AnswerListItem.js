import React, { useEffect, useState } from "react";
import {
  Button,
  IconButton,
  makeStyles,
  Paper,
  TextField,
} from "@material-ui/core";
import { Check, Clear } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  content: {
    // backgroundColor: theme.palette.grey[600],
    // color: theme.palette.secondary.main,
    padding: theme.spacing(3),
  },
}));

export const AnswerListItem = ({ text, action, setText = () => {} }) => {
  const [value, setValue] = useState(text);
  const [changed, setChanged] = useState(false);
  const classes = useStyles();
  switch (action) {
    case "":
      break;

    default:
      break;
  }

  useEffect(() => {
    if (text !== value) {
      setChanged(true);
    } else {
      setChanged(false);
    }
  }, [text, value]);

  return (
    <Paper square variant="outlined" className={classes.content}>
      <TextField
        variant={"outlined"}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <IconButton disabled={!changed} onClick={() => setText(value)}>
        <Check />
      </IconButton>
      <IconButton disabled={!changed} onClick={() => setValue(text)}>
        <Clear />
      </IconButton>
    </Paper>
  );
};

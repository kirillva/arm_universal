import React, { useEffect, useState } from "react";
import { Button, makeStyles, Paper, TextField } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  content: {
    // backgroundColor: theme.palette.grey[600],
    // color: theme.palette.secondary.main,
    padding: theme.spacing(3),
  },
}));

export const AnswerListItem = ({ text, action }) => {
  const [value, setValue] = useState(text);
  const [changed, setChanged] = useState(false);
  const classes = useStyles();
  switch (action) {
    case "":
      break;

    default:
      break;
  }

  useEffect(()=>{
    if (text !== value) {
        setChanged(true);
    } else {
        setChanged(false);
    }
  }, [text, value])

  return (
    <Paper square variant="outlined" className={classes.content}>
      <TextField
        variant={"outlined"}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <Button disabled={!changed}>Save</Button>
    </Paper>
  );
};

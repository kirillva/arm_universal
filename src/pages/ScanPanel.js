import { Typography } from "@material-ui/core";
import React from "react";
import { withRouter } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

export const ScanPanel = withRouter(() => {
    const classes = useStyles();
  return (
    <div className={classes.content}>
      <div className={classes.toolbar} />
      <Typography paragraph>
        camera
      </Typography>

    </div>
  );
});

import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import { VotersAssignList } from "pages/VotersAssignList";

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
  selectColumn: {
    width: 250,
  },
  drawer: {
    minWidth: 300,
    maxWidth: 700,
    overflowX: "hidden",
    width: "50%",
  },
}));

export const AssignUsers = () => {
  const classes = useStyles();
  const [state, setState] = useState(null);

  const match = useRouteMatch();

  return (
    <div className={classes.content}>
      <div className={classes.toolbar} />
      <Switch>
        <Route path={match.path}>
          <VotersAssignList state={state} setState={setState} />
        </Route>
      </Switch>
    </div>
  );
};

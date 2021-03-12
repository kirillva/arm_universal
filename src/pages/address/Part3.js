import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import { VotersAssignList } from "pages/VotersAssignList";
import { VoterSearchForm } from "pages/VoterSearchForm";
// import { EditStreet } from "./cards/EditStreet";
// import { Drawer } from "@material-ui/core";
// import { AddStreet } from "./cards/AddStreet";

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

export const Part3 = () => {
  const classes = useStyles();
  const [state, setState] = useState(null);

  // const [open, setOpen] = useState(false);

  // const [selectedStreet, setSelectedStreet] = useState(null);
  // const [selectedHouse, setSelectedHouse] = useState(null);

  const match = useRouteMatch();

  return (
    <div className={classes.content}>
      <div className={classes.toolbar} />
      <Switch>
        <Route path={`${match.path}/search`}>
          <VoterSearchForm
            // setSelectedStreet={(id) => {
            //   setSelectedStreet(id);
            //   setOpen(true);
            // }}
            // setSelectedHouse={(id) => {
            //   setSelectedHouse(id);
            //   setOpen(true);
            // }}
          />
          {/* <Drawer
            anchor="right"
            className={classes.drawer}
            open={open}
            onClose={() => {
              setSelectedStreet(null);
              setOpen(false);
            }}
          >
            <EditStreet
              id={selectedStreet}
              refreshPage={() => {
                setSelectedStreet(null);
                setOpen(false);
              }}
            />
          </Drawer>
          <Drawer
            anchor="right"
            className={classes.drawer}
            open={open}
            onClose={() => {
              setSelectedStreet(null);
              setOpen(false);
            }}
          >
            <AddStreet
              // id={selectedStreet}
              refreshPage={() => {
                setSelectedStreet(null);
                setOpen(false);
              }}
            />
          </Drawer> */}
          {/* <Drawer
            anchor="right"
            className={classes.drawer}
            open={open}
            onClose={() => {
              setSelectedHouse(null);
              setOpen(false);
            }}
          >
            <EditStreet
              id={selectedHouse}
              refreshPage={() => {
                setSelectedHouse(null);
                setOpen(false);
              }}
            />
          </Drawer> */}
        </Route>
        <Route path={match.path}>
          <VotersAssignList state={state} setState={setState} />
        </Route>
      </Switch>
    </div>
  );
};

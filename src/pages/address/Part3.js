import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import { VotersList } from "pages/VotersList";
import { VoterSearchForm } from "pages/VoterSearchForm";
import { SelectUik } from "components/SelectUik";
import { getDivisionByLogin } from "utils/helpers";
import { getItem, getUserId } from "utils/user";
import { getUsers } from "utils/getUsers";


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
  const match = useRouteMatch();

  const [house, setHouse] = useState(null);
  const [street, setStreet] = useState(null);
  const [appartment, setAppartment] = useState(null);
  const [uik, setUik] = useState(null);
  const [users, setUsers] = useState([]);
  
  const login = getItem("login");
  
  useEffect(() => {
    getUsers(getUserId()).then((_users) => setUsers(_users));
  }, []);

  const usersLoaded = users && users.length;

  const division = usersLoaded ? users[0].division.f_division : 0;
  
  return (
    <div className={classes.content}>
      <div className={classes.toolbar} />
      <Switch>
        <Route path={`${match.path}/search`}>
          <VoterSearchForm
            f_house={house}
            f_street={street}
            f_appartment={appartment}
          />
        </Route>
        <Route path={match.path}>
          <SelectUik
            margin="dense"
            size="small"
            name="n_uik"
            division={division}
            value={uik}
            className={classes.selectUik}
            handleChange={(e) => setUik(e.target.value)}
          />
          <VotersList
            uik={uik}
            division={division}
            state={state}
            setState={setState}
            setHouse={setHouse}
            setStreet={setStreet}
            setAppartment={setAppartment}
          />
        </Route>
      </Switch>
    </div>
  );
};

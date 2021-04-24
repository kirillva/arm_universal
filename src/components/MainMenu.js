import React from "react";
import {
  Box,
  Button,
  Typography,
} from "@material-ui/core";
import { useHistory, useLocation } from "react-router-dom";
import { getItem, getUsername, getActivate, logout } from "utils/user";
// import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

export const SimpleMenu = ({ setAuth }) => {
  const history = useHistory();

  return (
    <Box display="flex" >
      <Button color="secondary">
        {getActivate()}
      </Button>
      <Button
        style={{flex: 1}}
        // endIcon={<AccountCircleIcon />}
        color="secondary"
        size="small"
      >
        {getUsername() || getItem("login")}
      </Button>
      <Button
        style={{flex: 1}}
        endIcon={<ExitToAppIcon />}
        color="secondary"
        onClick={() => {
          logout();
          history.push("/");
          setAuth(false);
        }}
        size="small"
      >
        Выход
      </Button>
    </Box>
  );
};

export const MainMenu = ({ data, mobileOpen, handleDrawerToggle, setAuth, buttons }) => {
  const location = useLocation();

  const item = data.find((item) => location.pathname.indexOf(item.path) === 0);

  return (
    <Box width="100%" display="flex" alignItems="center">
      {buttons ? buttons : <Typography style={{flex: 1}}>{item ? item.title : ""}</Typography>}
      <SimpleMenu setAuth={setAuth} />
    </Box>
  );
};

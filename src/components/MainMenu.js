import React from "react";
import {
  Box,
  Button,
  Typography,
} from "@material-ui/core";
import { useHistory, useLocation } from "react-router-dom";
import { getItem, getUsername, logout } from "utils/user";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

export const SimpleMenu = ({ setAuth }) => {
  const history = useHistory();

  return (
    <Box display="grid" gridTemplateColumns="1fr 1fr" >
      <Button
        endIcon={<AccountCircleIcon />}
        color="secondary"
        onClick={() => {
          logout();
          history.push("/");
          setAuth(false);
        }}
        size="small"
      >
        {getUsername() || getItem("login")}
      </Button>
      <Button
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

export const MainMenu = ({ data, mobileOpen, handleDrawerToggle, setAuth }) => {
  const location = useLocation();

  const item = data.find((item) => location.pathname.indexOf(item.path) === 0);

  return (
    <Box width="100%" display="grid" gridTemplateColumns="1fr 200px" alignItems="center">
      <Typography>{item ? item.title : ""}</Typography>
      <SimpleMenu setAuth={setAuth} />
    </Box>
  );
};

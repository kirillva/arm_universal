import React from "react";
import {
  Box,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { useHistory, useLocation } from "react-router-dom";
import { getItem, getUsername, logout } from "utils/user";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  drawerPaper: {
    width: drawerWidth,
  },
  grow: {
    flexDirection: "row",
    display: "flex",
    flex: 1,
  },
  avatar: {
    width: 200,
    textAlign: "center",
    flexDirection: "row",
    display: "flex",
    columnGap: theme.spacing(1),
    alignItems: "center",
  },
  username: {
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
}));

export const SimpleMenu = ({ setAuth }) => {
  const history = useHistory();

  return (
    <Box display="grid" gridTemplateColumns="1fr 1fr 1fr" alignItems="center">
      <Typography variant="body1">
        {getUsername() || getItem("login")}
      </Typography>
      <AccountCircleIcon color="secondary" />
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
  const classes = useStyles();

  const location = useLocation();

  const item = data.find((item) => location.pathname.indexOf(item.path) === 0);

  return (
    <List className={classes.grow}>
      <ListItem>
        <ListItemText primary={item ? item.title : ""} />
      </ListItem>
      <Divider />
      <SimpleMenu setAuth={setAuth} />
    </List>
  );
};

import React, { useState } from "react";
import {
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { Link, useHistory, useLocation } from "react-router-dom";
import { getItem, getUsername, logout } from "utils/user";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

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
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const history = useHistory();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <div className={classes.avatar} onClick={handleClick}>
        <Typography variant="body1" className={classes.username}>
          {getUsername() || getItem("login")}
        </Typography>
        <AccountCircleIcon color="secondary" />
      </div>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem
          button
          onClick={() => {
            history.push("/part1");
            handleClose();
          }}
        >
          I этап: привязка домов
        </MenuItem>
        {getItem("login") !== "nov" ? (
          <MenuItem
            button
            onClick={() => {
              history.push("/part2");
              handleClose();
            }}
          >
            II этап: подтверждение
          </MenuItem>
        ) : null}
        {/* <MenuItem
          button
          onClick={() => {
            history.push("/part3");
            handleClose();
          }}
        >
          III этап: избиратели
        </MenuItem> */}
        <MenuItem
          button
          key={"/"}
          component={Link}
          to={"/"}
          onClick={() => {
            logout();
            history.push("/");
            handleClose();
            setAuth(false);
          }}
        >
          Выход
        </MenuItem>
      </Menu>
    </>
  );
};

export const MainMenu = ({ data, mobileOpen, handleDrawerToggle, setAuth }) => {
  const classes = useStyles();

  const location = useLocation();

  const item = data.find((item) => location.pathname.indexOf(item.path) === 0);

  return (
    <List className={classes.grow}>
      <ListItem
        button
        // key={path}
        // component={Link}
        // to={path}
        // selected={active}
        // onClick={() => mobileOpen && handleDrawerToggle()}
      >
        {/* <ListItemIcon>
          {React.createElement(item ? item.icon : HomeIcon, { color: "secondary" })}
        </ListItemIcon> */}
        <ListItemText primary={item ? item.title : ""} />
      </ListItem>
      <Divider />
      <SimpleMenu setAuth={setAuth} />
    </List>
  );
  // return (
  //   <div className={classes.drawer} aria-label="mailbox folders">
  //     <Hidden smUp implementation="css">
  //       <Drawer
  //         variant="temporary"
  //         open={mobileOpen}
  //         onClose={handleDrawerToggle}
  //         classes={{
  //           paper: classes.drawerPaper,
  //         }}
  //         ModalProps={{
  //           keepMounted: true,
  //         }}
  //       >
  //         {drawer}
  //       </Drawer>
  //     </Hidden>
  //     <Hidden xsDown implementation="css">
  //       <Drawer
  //         classes={{
  //           paper: classes.drawerPaper,
  //         }}
  //         variant="permanent"
  //         open
  //       >
  //         {drawer}
  //       </Drawer>
  //     </Hidden>
  //   </div>
  // );
};

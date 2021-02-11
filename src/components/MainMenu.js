import React, { useState } from "react";
import {
  Divider,
  Drawer,
  Hidden,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { Link, useHistory, useLocation } from "react-router-dom";
import { getUsername, logout } from "utils/user";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  // toolbar: theme.mixins.toolbar,
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
}));

export const SimpleMenu = () => {
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
      <ListItem
        button
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <ListItemIcon>
          <AccountCircleIcon />
        </ListItemIcon>
        <ListItemText primary={getUsername() || "Без имени"} />
      </ListItem>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem
          button
          key={"/"}
          component={Link}
          to={"/"}
          onClick={handleClose}
        >
          Профиль
        </MenuItem>
        <MenuItem
          button
          key={"/"}
          component={Link}
          to={"/"}
          onClick={()=> {
            logout();
            history.push("/");
            handleClose()
          }}
        >
          Выход
        </MenuItem>
      </Menu>
    </>
  );
};

export const MainMenu = ({ data, mobileOpen, handleDrawerToggle }) => {
  const classes = useStyles();
  // const history = useHistory();
  const location = useLocation();

  // const drawer = (
  //   <>
  //     <div className={classes.toolbar}>
  //       <ListItem
  //         button
  //         key={"/"}
  //         component={Link}
  //         to={"/"}
  //         onClick={() => mobileOpen && handleDrawerToggle()}
  //       >
  //         <ListItemIcon>
  //           <AccountCircleIcon />
  //         </ListItemIcon>
  //         <ListItemText primary={getUsername() || "Без имени"} />
  //       </ListItem>
  //       <ListItem
  //         button
  //         onClick={() => {
  //           logout();
  //           mobileOpen && handleDrawerToggle();
  //           history.push("/");
  //         }}
  //       >
  //         <ListItemIcon>
  //           <ExitToAppIcon />
  //         </ListItemIcon>
  //         <ListItemText primary={"Выход"} />
  //       </ListItem>
  //     </div>
  //     <Divider />
  //     <List className={classes.grow}>
  //       {data.map((item, index) => {
  //         const { path, title, icon } = item;
  //         const active = location.pathname === path;
  //         return (
  //           <ListItem
  //             button
  //             key={path}
  //             component={Link}
  //             to={path}
  //             selected={active}
  //             onClick={() => mobileOpen && handleDrawerToggle()}
  //           >
  //             <ListItemIcon>{React.createElement(icon)}</ListItemIcon>
  //             <ListItemText primary={title} />
  //           </ListItem>
  //         );
  //       })}
  //     </List>
  //   </>
  // );

  return (
    <List className={classes.grow}>
      {data.map((item, index) => {
        const { path, title, icon } = item;
        const active = location.pathname === path;
        return (
          <ListItem
            button
            key={path}
            component={Link}
            to={path}
            selected={active}
            onClick={() => mobileOpen && handleDrawerToggle()}
          >
            <ListItemIcon>{React.createElement(icon)}</ListItemIcon>
            <ListItemText primary={title} />
          </ListItem>
        );
      })}
      <Divider />
      <SimpleMenu />
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

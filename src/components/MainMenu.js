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
import { getItem, getUsername, logout } from "utils/user";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

import HomeIcon from '@material-ui/icons/Home';
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
  avatar: {
    maxWidth: 200,
    textAlign: "center",
  },
}));

export const SimpleMenu = () => {
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
      <ListItem
        button
        className={classes.avatar}
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <ListItemText primary={getUsername() || getItem("login")} />
        <ListItemIcon>
          <AccountCircleIcon color="secondary" />
        </ListItemIcon>
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
          onClick={() => {
            history.push("/address");
            handleClose();
          }}
        >
          I этап: привязка домов
        </MenuItem>
        <MenuItem
          button
          onClick={() => {
            history.push("/street");
            handleClose();
          }}
        >
          II этап: подтверждение
        </MenuItem>
        <MenuItem
          button
          key={"/"}
          component={Link}
          to={"/"}
          onClick={() => {
            logout();
            history.push("/");
            handleClose();
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
  
  const location = useLocation();
  
  const item = data.find(item=>item.path === location.pathname);

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
        <ListItemIcon>
          {React.createElement(item ? item.icon : HomeIcon, { color: "secondary" })}
        </ListItemIcon>
        <ListItemText primary={item ? item.title : 'Заголовок страницы'} />
      </ListItem>
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

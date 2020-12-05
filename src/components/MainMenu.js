import React from "react";
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
import { Link } from "react-router-dom";

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
}));

export const MainMenu = ({ data, mobileOpen, handleDrawerToggle }) => {
  const classes = useStyles();

  const drawer = (
    <>
      <div className={classes.toolbar} />
      <Divider />
      <List>
        {data.map((item, index) => {
          const { path, title, icon } = item;
          return (
            <ListItem button key={path} component={Link} to={path}>
              <ListItemIcon>{React.createElement(icon)}</ListItemIcon>
              <ListItemText primary={title} />
            </ListItem>
          );
        })}
      </List>
    </>
  );

  return (
    <div className={classes.drawer} aria-label="mailbox folders">
      <Hidden smUp implementation="css">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          classes={{
            paper: classes.drawerPaper,
          }}
          ModalProps={{
            keepMounted: true,
          }}
        >
          {drawer}
        </Drawer>
      </Hidden>
      <Hidden xsDown implementation="css">
        <Drawer
          classes={{
            paper: classes.drawerPaper,
          }}
          variant="permanent"
          open
        >
          {drawer}
        </Drawer>
      </Hidden>
    </div>
  );
};

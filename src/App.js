import React, { useState } from "react";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { MainMenu } from "components/MainMenu";
import { menuItems } from "components/Menu";
import { routeItems } from "components/Routes";
import { getClaims } from "utils/user";
import { Route, Switch, useLocation } from "react-router-dom";
import { SigninForm } from "pages/SigninForm";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    [theme.breakpoints.up("sm")]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
}));

function ResponsiveDrawer() {
  const classes = useStyles();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const currentMenuItem = menuItems.find(
    (item) => item.path === location.pathname
  );
  debugger;
  console.log(currentMenuItem);
  console.log(location);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const filter = (item) => {
    let val = false;
    if (item.public) return true;
    item.claims.forEach((element) => {
      if (getClaims().indexOf(`.${element}.`) >= 0) {
        val = true;
      }
    });
    return val;
  };
  const filteredMenu = menuItems.filter(filter);
  const filteredRoute = routeItems.filter(filter);
  debugger;

  console.log("filteredMenu", filteredMenu);
  console.log("filteredRoute", filteredRoute);

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            {currentMenuItem ? currentMenuItem.title : ""}
          </Typography>
        </Toolbar>
      </AppBar>
      <MainMenu
        mobileOpen={mobileOpen}
        data={menuItems}
        handleDrawerToggle={handleDrawerToggle}
      />
      <Switch>
        <Route exact={true} path={"/auth"}>
          <SigninForm />
        </Route>
        {routeItems.map((item) => {
          return (
            <Route exact={true} path={item.path}>
              {React.createElement(item.component)}
            </Route>
          );
        })}
      </Switch>
    </div>
  );
}

export default ResponsiveDrawer;

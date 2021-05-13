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
import { getClaims, getItem, isAuthorized } from "utils/user";
import {
  Redirect,
  Route,
  Switch,
  useLocation,
  useRouteMatch,
} from "react-router-dom";
import MessageContextProvider from "context/MessageContext";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    height: "100%",
  },
  appBar: {
    backgroundColor: theme.palette.primary.main,
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
  const [auth, setAuth] = useState(Boolean(localStorage.getItem('token')));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const PrivateRoute = ({ component: Component, ...rest }) => {
    return isAuthorized() ? <Route {...rest} /> : <Redirect to="/auth" />;
  };

  const login = getItem("login");

  const claims = getClaims();
  
  return (
    <div className={classes.root}>
      <MessageContextProvider>
        <CssBaseline />
        <Switch>
          {routeItems.map((item) => {
            return item.public ? (
              <Route path={item.path}>
                {React.createElement(item.component, { auth, setAuth })}
              </Route>
            ) : (
              <PrivateRoute path={item.path}>
                <AppBar position="fixed" className={classes.appBar}>
                  <Toolbar>
                    {/* <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={handleDrawerToggle}
                    className={classes.menuButton}
                  >
                    <MenuIcon />
                  </IconButton> */}
                    <MainMenu
                      mobileOpen={mobileOpen}
                      data={menuItems}
                      handleDrawerToggle={handleDrawerToggle}
                      setAuth={setAuth}
                    />
                  </Toolbar>
                </AppBar>
                {React.createElement(item.component, { auth, setAuth })}
              </PrivateRoute>
            );
          })}
          {auth ? (
            <Route path="/">
              <Redirect to={claims.indexOf('.monkey.') >= 0 ? '/assignDivisions' : "/part3"} />
            </Route>
          ) : (
            <Route path="/">
              <Redirect to="/auth" />
            </Route>
          )}
        </Switch>
      </MessageContextProvider>
    </div>
  );
}

export default ResponsiveDrawer;

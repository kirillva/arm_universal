import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { HashRouter as Router } from "react-router-dom";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import blue from "@material-ui/core/colors/blue";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import rootReducer from "rootReducer";

const outerTheme = createMuiTheme({
  palette: {
    primary: {
      main: '#2196F3',
    },
    secondary: {
      main: blue[500],
    },
    text: {
      main: 'rgba(0, 0, 0, 0.6)',
      dark: 'rgba(0, 0, 0, 0.87)',
    }
  },
  typography: { useNextVariants: true },
});

const store = configureStore({
  reducer: rootReducer
});

ReactDOM.render(
  <Provider store={store}>
    <MuiThemeProvider theme={outerTheme}>
      <Router>
        <App />
      </Router>
    </MuiThemeProvider>
  </Provider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

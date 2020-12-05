import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { HashRouter as Router } from "react-router-dom";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import orange from "@material-ui/core/colors/orange";

const outerTheme = createMuiTheme({
  palette: {
    secondary: {
      main: orange[500],
    },
  },
  typography: { useNextVariants: true },
});

// ReactDOM.render(
//   <React.StrictMode>
//     <MuiThemeProvider theme={outerTheme}>
//       <Router>
//         <App />
//       </Router>
//     </MuiThemeProvider>
//   </React.StrictMode>,
//   document.getElementById("root")
// );

ReactDOM.render(
    <MuiThemeProvider theme={outerTheme}>
      <Router>
        <App />
      </Router>
    </MuiThemeProvider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

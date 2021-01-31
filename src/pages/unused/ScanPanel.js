import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import QrReader from "react-qr-reader";

const useStyles = makeStyles((theme) => ({
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

export const ScanPanel = withRouter(({ history }) => {
  const classes = useStyles();
  const [result, setResult] = useState("Нет данных");

  const handleScan = (data) => {
    if (data) {
      // setResult(data);
      history.push(`/result`);
    }
  };
  const handleError = (err) => {
    console.error(err);
  };

  return (
    <div className={classes.content}>
      <div className={classes.toolbar} />
      <QrReader
        delay={300}
        onError={handleError}
        onScan={handleScan}
        style={{ width: "100%" }}
      />

      {result}
    </div>
  );
});

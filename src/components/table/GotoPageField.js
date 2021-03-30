import { TextField } from "@material-ui/core";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { useTableComponentStyles } from "./tableComponentStyles";

export const GotoPageField = ({ pageCount, gotoPage, pageIndex }) => {
  const [error, setError] = useState(null);
  const classes = useTableComponentStyles();

  const [targetPage, setTargetPage] = useState(pageIndex + 1);

  useEffect(() => {
    const schema = Yup.number().required().nullable().max(pageCount).min(1);

    schema
      .validate(targetPage)
      .then(() => setError(null))
      .catch((err) => setError(err));
  }, [targetPage]);

  const isValid = error && error.errors.length ? false : true;
  return (
    <TextField
      inputProps={{
        className: classes.input,
      }}
      variant="outlined"
      value={targetPage}
      className={classes.gotoPage}
      onKeyPress={(e) => {
        if (e.key === "Enter" && isValid) gotoPage(Number(targetPage) - 1);
      }}
      onChange={(e) => setTargetPage(e.target.value || "")}
    />
  );
};

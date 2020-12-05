import React from "react";
import { useFormik } from "formik";
import { makeStyles, TextField } from "@material-ui/core";
import { auth } from "utils/user";
import { withRouter } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

export const SigninForm = withRouter(({ history }) => {
  const { handleSubmit, handleChange, values } = useFormik({
    initialValues: {
      login: "",
      password: "",
      remember: true,
    },
    onSubmit: (values) => {
      auth({
        login: values.login,
        password: values.password,
        persist: true,
      }).then(()=>{
        history.push("/");
      });
    },
  });
  const classes = useStyles();
  return (
    <div className={classes.content}>
      <div className={classes.toolbar} />
      <form onSubmit={handleSubmit}>
        <TextField onChange={handleChange} name="login" value={values.login} />
        <TextField
          onChange={handleChange}
          type="password"
          name="password"
          value={values.password}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
});
